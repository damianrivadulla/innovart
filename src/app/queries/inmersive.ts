export const QUERY_INMERSIVE = `
  query InmersiveQuery {
    page(id: "761", idType: DATABASE_ID) {
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
      inmersive {
        title
        description
        mainImage {
          node {
            altText
            title
            sourceUrl
            srcSet
          }
        }
        mainVideo
        image2 {
          node {
            altText
            title
            sourceUrl
            srcSet
          }
        }        
        image2Description
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
        name
        location
      }
    }
  }
`;
