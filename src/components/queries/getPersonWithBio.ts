import { APP_NAME_UNDERSCORED, imageUrlQuery, pageUrlQuery, richTextQuery } from '@enonic/nextjs-adapter';

const getPersonWithBio = () => `
query {
  guillotine(siteKey: $siteKey, branch: $branch, project: $project) {
    get(key:$path) {
      displayName
      ... on ${APP_NAME_UNDERSCORED}_Person {
        data {
          ${richTextQuery('bio')}
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

export default getPersonWithBio;
