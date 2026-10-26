export const QUERY_LEGAL = `
  query LegalPages {
    privacy: page(id: "privacy-policy", idType: URI) {
      title
      content
    }
    terms: page(id: "terms-of-use", idType: URI) {
      title
      content
    }
  }
`;
