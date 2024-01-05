export default function getRepoOwnerAndRepo(repoFullName) {
  if (!repoFullName) return {};

  const [repoOwner, repo] = repoFullName.split('/');

  return {
    repoOwner,
    repo,
  };
}
