export function assignOwnerAndRepo<T extends { repoOwner?: string; repo?: string; }>(object: T, repoFullName: string): T {
  if (object && repoFullName) {
    const [repoOwner, repo] = repoFullName.split('/');
    object.repoOwner = repoOwner;
    object.repo = repo;
  }

  return object;
}
