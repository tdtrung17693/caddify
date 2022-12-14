function getSiteName(
  deploymentId: string,
  projectName: string,
  userName: string,
) {
  return `${deploymentId}-${projectName}-${userName}`;
}

export function getSiteHostName(
  deploymentId: string,
  projectName: string,
  userName: string,
  siteBaseDomain: string,
) {
  return `${getSiteName(
    deploymentId,
    projectName,
    userName,
  )}.${siteBaseDomain}`;
}

export function getSiteRootDirectory(
  deploymentId: string,
  siteBaseDirectory: string,
) {
  return `${siteBaseDirectory}/${deploymentId}`;
}
