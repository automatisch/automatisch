type TRepoOwnerAndRepo = {
  repoOwner: string;
  repo: string;
}

export default function getRepoOwnerAndRepo(repoFullName: string): TRepoOwnerAndRepo {
  const [repoOwner, repo] = repoFullName.split('/');

  return {
    repoOwner,
    repo
  };
}
