import { APP_NAME_UNDERSCORED } from '@enonic/nextjs-adapter';

const getPerson = () => `
query {
  guillotine(siteKey: $siteKey, branch: $branch, project: $project) {
    get(key:$path) {
      displayName
      ... on ${APP_NAME_UNDERSCORED}_Person {
        data {
          dateofbirth
          photos {
           ... on media_Image {
              imageUrl(scale: "width(500)") {
                url
              }
              attachments {
                name
              }
            }
          }
        }
      }
      parent {
        _path
        pageUrl {
          path
        }
      }
    }
  }
}`;

export default getPerson;
