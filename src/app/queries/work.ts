export const QUERY_WORK_WITH_US = `
  query WorkQuery {
    page(id: "265", idType: DATABASE_ID) {
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
      content
    }
  }

`;
