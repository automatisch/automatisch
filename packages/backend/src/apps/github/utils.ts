export function assignOwnerAndRepo<T extends { repoOwner?: string; repo?: string; hasRepo?: boolean; }>(object: T, repoFullName: string): T {
  if (object && repoFullName) {
    const [repoOwner, repo] = repoFullName.split('/');
    object.repoOwner = repoOwner;
    object.repo = repo;
    object.hasRepo = true;
  }

  return object;
}
