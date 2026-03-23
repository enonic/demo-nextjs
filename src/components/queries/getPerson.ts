import {APP_NAME_UNDERSCORED} from '@enonic/nextjs-adapter';

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
              imageUrl: imageUrl(type: absolute, scale: "width(500)")
              attachments {
                name
              }
            }
          }
        }
      }
      parent {
        _path
      }
    }
  }
}`;

export default getPerson;
