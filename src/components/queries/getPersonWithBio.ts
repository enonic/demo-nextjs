import {APP_NAME_UNDERSCORED, richTextQuery} from '@enonic/nextjs-adapter';

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

export default getPersonWithBio;
