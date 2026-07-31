export const QUERY_COMPANY = `
  query CompanyQuery {
    page(id: "68", idType: DATABASE_ID) {
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
      companyFields {
        title
        story
        storyDescription
        values
        valuesItems {
          subDescription
          subTitle
        }
        leadership
        leadershipDescription
        team {
          edges {
            node {
              ... on TeamMember {
                teamSingleFields {
                  name
                  title
                  description
                }
              }
            }
          }
        }
        clients
        clientsDescription
        clientsLogos {
          edges {
            node {
              ... on Client {
                title
                logos {
                  logo {
                    node {
                      title
                      altText
                      sourceUrl
                    }
                  }
                  link
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
