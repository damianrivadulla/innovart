import { writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const PRIMARY_URI = 'https://api.innovart.agency/graphql';
const FALLBACK_URI = 'https://adrianp69.sg-host.com/graphql';
const SITE_ORIGIN = 'https://innovart.agency';

const PAGE_ORDER = [
  '/',
  '/company/',
  '/portfolio/',
  '/methodology/',
  '/renderings/',
  '/work-with-us/',
  '/contact/',
  '/privacy-policy/',
  '/terms-of-use/',
];

const publicDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');

const NODE_FIELDS = `
  title
  uri
  seo {
    title
    metaDesc
    metaRobotsNoindex
    objectLastModified
  }
`;

const QUERIES = {
  pages: `
    query SeoPages($after: String) {
      pages(first: 100, after: $after, where: { status: PUBLISH }) {
        nodes { ${NODE_FIELDS} }
        pageInfo { hasNextPage endCursor }
      }
    }
  `,
  portfolioCompanies: `
    query SeoPortfolios($after: String) {
      portfolioCompanies(first: 100, after: $after, where: { status: PUBLISH }) {
        nodes { ${NODE_FIELDS} }
        pageInfo { hasNextPage endCursor }
      }
    }
  `,
};

async function graphql(uri, query, after) {
  const response = await fetch(uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { after } }),
  });

  if (!response.ok) {
    throw new Error(`${uri} responded ${response.status}`);
  }

  const payload = await response.json();
  if (payload.errors?.length) {
    throw new Error(payload.errors.map((error) => error.message).join('; '));
  }

  return payload.data;
}

async function fetchConnection(uri, field) {
  const nodes = [];
  let after = null;

  do {
    const data = await graphql(uri, QUERIES[field], after);
    const connection = data[field];
    nodes.push(...connection.nodes);
    after = connection.pageInfo.hasNextPage ? connection.pageInfo.endCursor : null;
  } while (after);

  return nodes;
}

async function fetchContent() {
  const errors = [];

  for (const uri of [PRIMARY_URI, FALLBACK_URI]) {
    try {
      const pages = await fetchConnection(uri, 'pages');
      const portfolios = await fetchConnection(uri, 'portfolioCompanies');
      return { pages, portfolios };
    } catch (error) {
      errors.push(`${uri}: ${error.cause?.message || error.message}`);
    }
  }

  throw new Error(`Could not load SEO content.\n${errors.join('\n')}`);
}

function isNoindex(seo) {
  return (seo?.metaRobotsNoindex || '').toLowerCase() === 'noindex';
}

function publicUrl(uri) {
  if (!uri || !uri.startsWith('/')) {
    return null;
  }

  return `${SITE_ORIGIN}${uri}`;
}

function lastmod(value) {
  const match = String(value || '').match(/^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}:\d{2})/);
  return match ? `${match[1]}T${match[2]}+00:00` : null;
}

function xmlEscape(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function toEntry(node) {
  if (isNoindex(node.seo)) {
    return null;
  }

  const loc = publicUrl(node.uri);
  if (!loc) {
    return null;
  }

  return {
    title: (node.title || node.seo?.title || loc).replace(/\s+/g, ' ').trim(),
    description: (node.seo?.metaDesc || '').replace(/\s+/g, ' ').trim(),
    loc,
    uri: node.uri,
    lastmod: lastmod(node.seo?.objectLastModified),
  };
}

function unique(entries) {
  const seen = new Set();
  return entries.filter((entry) => {
    if (seen.has(entry.loc)) {
      return false;
    }
    seen.add(entry.loc);
    return true;
  });
}

function sortPages(entries) {
  return [...entries].sort((a, b) => {
    const aIndex = PAGE_ORDER.indexOf(a.uri);
    const bIndex = PAGE_ORDER.indexOf(b.uri);
    const aRank = aIndex === -1 ? PAGE_ORDER.length : aIndex;
    const bRank = bIndex === -1 ? PAGE_ORDER.length : bIndex;
    return aRank - bRank || a.title.localeCompare(b.title);
  });
}

function sitemapXml(entries) {
  const urls = entries
    .map((entry) => {
      const modified = entry.lastmod ? `\n    <lastmod>${entry.lastmod}</lastmod>` : '';
      return `  <url>\n    <loc>${xmlEscape(entry.loc)}</loc>${modified}\n  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function sitemapIndexXml() {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <sitemap>\n    <loc>${SITE_ORIGIN}/sitemap.xml</loc>\n  </sitemap>\n</sitemapindex>\n`;
}

function markdownLink(entry) {
  const label = entry.title.replaceAll('[', '(').replaceAll(']', ')');
  const link = `- [${label}](${entry.loc})`;
  return entry.description ? `${link}: ${entry.description}` : link;
}

function llmsTxt(pages, portfolios) {
  const home = pages.find((entry) => entry.uri === '/') ?? pages[0];
  const heading = home?.seoTitle || home?.title || 'INNOVART';
  const summary = home?.description || '';
  const sections = [
    `# ${heading}`,
    summary ? `> ${summary}` : '',
    '## Pages',
    pages.map(markdownLink).join('\n'),
    '## Portfolios',
    portfolios.map(markdownLink).join('\n'),
    '## Optional',
    `- [Sitemap](${SITE_ORIGIN}/sitemap.xml)`,
  ];

  return `${sections.filter(Boolean).join('\n\n')}\n`;
}

const { pages: pageNodes, portfolios: portfolioNodes } = await fetchContent();
const homeNode = pageNodes.find((node) => node.uri === '/');
const pages = sortPages(unique(pageNodes.map(toEntry).filter(Boolean)));
const portfolios = unique(portfolioNodes.map(toEntry).filter(Boolean)).sort((a, b) =>
  a.title.localeCompare(b.title),
);

if (homeNode) {
  const home = pages.find((entry) => entry.uri === '/');
  if (home) {
    home.seoTitle = (homeNode.seo?.title || '').replace(/\s+/g, ' ').trim();
  }
}

if (!pages.length) {
  throw new Error('GraphQL returned no indexable pages.');
}

await writeFile(join(publicDir, 'sitemap.xml'), sitemapXml([...pages, ...portfolios]));
await writeFile(join(publicDir, 'sitemap_index.xml'), sitemapIndexXml());
await writeFile(join(publicDir, 'llms.txt'), llmsTxt(pages, portfolios));

console.log(`Wrote sitemap.xml (${pages.length} pages, ${portfolios.length} portfolios) and llms.txt`);
