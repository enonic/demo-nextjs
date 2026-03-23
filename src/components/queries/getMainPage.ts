const getMainPage = `
query {
  guillotine(siteKey: $siteKey, branch: $branch, project: $project) {
    getSite {
      displayName
    }
  }
}`;

export default getMainPage;
