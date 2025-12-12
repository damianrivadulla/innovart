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
        image5 {
          node {
            altText
            title
            sourceUrl
            srcSet
          }
        }
        description2
        bottomGallery {
          edges {
            node {
              title
              altText
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
            clientLocation
            description
            clientName
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
