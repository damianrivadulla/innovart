export const MUTATION_SEND_EMAIL = `
  mutation MyMutation($email: String, $message: String, $subject: String) {
    sendEmail(
        input: {
          clientMutationId: "12345",
          email: $email,
          message: $message,
          subject: $subject,
          trap: "12345",
        }
      ) {
        email
        message
        subject
        sent
    }
  }
`;

export const QUERY_CONTACT = `
  query ContactQuery {
    page(id: "74", idType: DATABASE_ID) {
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
      contactFields {
        title
        contactFormEmailTo
        contactFormSubjectOptions {
          option
        }
        howDidYouHearFromUs {
          option
        }
        formNotice
        formButton
      }
    }
  }
`;
