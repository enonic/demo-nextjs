import { APP_NAME_UNDERSCORED, imageUrlQuery, pageUrlQuery } from '@enonic/nextjs-adapter';

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
              ${imageUrlQuery({ scale: 'width(500)' })}
              attachments {
                name
              }
            }
          }
        }
      }
      parent {
        _path
        ${pageUrlQuery()}
      }
    }
  }
}`;

export default getPerson;
