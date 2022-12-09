import * as shortUUID from 'short-uuid';
type DeploymentMetadataBag = {
  [K: string]: string;
};
export class Deployment {
  public id: string;
  public metadata: DeploymentMetadataBag;

  constructor(public projectId: string) {
    this.id = shortUUID.generate();
  }
}
