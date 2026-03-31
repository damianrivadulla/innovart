/** Límite de categorías por proyecto (single portfolio). Por defecto WPGraphQL devuelve 10; aquí se permite el total que consideremos. */
export const PORTFOLIO_CATEGORIES_FIRST = 100;

export const QUERY_PORTFOLIO_SINGLE = (id: string) => `
  query PortfolioSingleQuery($id: ID = "${id}") {
    portfolioCompany(idType: URI, id: $id) {
      seo {
        title
        metaDesc
        metaRobotsNofollow
        metaRobotsNoindex
        opengraphImage {
          sourceUrl
          mediaDetails {
            height
            width
            file
          }
        }
        canonical
        opengraphDescription
        schema {
          raw
        }
        opengraphSiteName
        opengraphUrl
        opengraphTitle
        opengraphType
      }
      databaseId
      slug
      title
      categories(first: ${PORTFOLIO_CATEGORIES_FIRST}, where: { orderby: TERM_ORDER, order: ASC }) {
        edges {
          node {
            name
          }
        }
      }
      portfolioSingleFields {
        textColor
        backgroundColor
        buttonTextColor
        title
        description
        mainGallery {
          edges {
            node {
              title
              altText
              caption
              sourceUrl
              srcSet
            }
          }
        }
        galleryDescription
        image1 {
          node {
            altText
            title
            sourceUrl
            srcSet
          }
        }
        video1
        block1Position
        image2 {
          node {
            altText
            title
            sourceUrl
            srcSet
          }
        }
        image3 {
          node {
            altText
            title
            sourceUrl
            srcSet
          }
        }
        video23
        block23Position
        quote
        quoteName
        quoteTitle
        quoteCompany
        image4 {
          node {
            altText
            title
            sourceUrl
            srcSet
          }
        }
        video4
        block45Position
        image5 {
          node {
            altText
            title
            sourceUrl
            srcSet
          }
        }
        video5
        description2
        bottomGallery {
          edges {
            node {
              title
              altText
              caption
              sourceUrl
              srcSet
            }
          }
        }
      }
      nextPortfolioCompany {
        node {
          databaseId
          uri
          slug
        }
      }
    }
    portfolioCompanies(first: 1, where: {status: PUBLISH, orderby: {order: ASC, field: MENU_ORDER}}) {
      edges {
        node {
          uri
        }
      }
    }
  }
`;

export const QUERY_PORTFOLIO_INFO = `
  query PortfolioQuery {
    page(id: "69", idType: DATABASE_ID) {
      seo {
        title
        metaDesc
        metaRobotsNofollow
        metaRobotsNoindex
        opengraphImage {
          sourceUrl
          mediaDetails {
            height
            width
            file
          }
        }
        canonical
        opengraphDescription
        schema {
          raw
        }
        opengraphSiteName
        opengraphUrl
        opengraphTitle
        opengraphType
      }
      title
      portfolioFields {
        title
        description
        loadMore
      }
    }
}
`;

export const QUERY_PORTFOLIO = (noPosts: any, afterKey: any) => `
  query PortfolioPosts {
    portfolioCompanies(first: ${noPosts}, where: {status: PUBLISH, orderby: {order: ASC, field: MENU_ORDER}}, after: "${afterKey ? afterKey : ''}") {
      edges {
        node {
          title
          link
          uri
          portfolioSingleFields {
            galleryGrid {
              edges {
                node {
                  title
                  altText
                  sourceUrl
                  srcSet
                }
              }
            }          
            title
            portfolioImage {
              node {
                altText
                title
                sourceUrl
                srcSet
              }
            }
            name
            location
            voiceTone
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
 `;
