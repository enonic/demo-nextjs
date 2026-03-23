const getTwoColumnLayout = `
query {
  guillotine(siteKey: $siteKey, branch: $branch, project: $project) {
    getSite {
      displayName
      type
    }
  }
}`;

export default getTwoColumnLayout;
