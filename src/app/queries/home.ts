export const QUERY_HOME = `
  query HomeQuery {
    page(id: "12", idType: DATABASE_ID) {
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
      homeFields {
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
        viewAllWorkLabel
        selectedWorkLabel
        selectedWork(first: 50) {
          edges {
            node {
              ... on PortfolioCompany {
                title
                link
                uri
                portfolioSingleFields {
                  portfolioImage{
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
          }
        }
        testimonialsLabel
        testimonials {
          edges {
            node {
              ... on Testimonial {
                testimonialSingleFields {
                  name
                  title
                  company
                  description
                }
              }
            }
          }
        }
      }
    }
  }
`;
