export const QUERY_HEADER = `
  query MainQuery {
    globalContent {
      globalFields {
        siteLogo {
          node {
            altText
            title
            sourceUrl
            srcSet
          }
        }
        contactPhrase
        contactPhraseLink
        whoWeAre
        phoneNumber {
          target
          title
          url
        }
        emailAddress {
          target
          title
          url
        }
        socialMedia {
          socialMediaItem {
            target
            title
            url
          }
        }
        footerLogo {
          node {
            altText
            title
            sourceUrl
            srcSet
          }
        }
        copyright
        bookCall {
          target
          title
          url
        }
      }
    }
    menus {
      nodes {
        databaseId
        name
        menuItems {
          nodes {
            label
            url
            uri
            parentId
            target
          }
        }
      }
    }
  }
 `;
