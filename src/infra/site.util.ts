import { Deployment } from 'src/domain/deployment';

function getSiteName(deployment: Deployment) {
  return deployment.id;
}

export function getSiteHostName(
  deployment: Deployment,
  siteBaseDomain: string,
) {
  return `${getSiteName(deployment)}.${siteBaseDomain}`;
}

export function getSiteRootDirectory(
  deployment: Deployment,
  siteBaseDirectory: string,
) {
  return `${siteBaseDirectory}/${getSiteName(deployment)}`;
}
