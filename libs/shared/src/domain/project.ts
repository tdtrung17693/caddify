import * as shortUUID from 'short-uuid';
import { Deployment } from './deployment';

export class Project {
  constructor(
    public id: string,
    public userId: string,
    public projectName: string,
    public deployments: Deployment[] = [],
    public createdAt: Date = new Date(),
    public modifiedAt: Date = new Date(),
  ) {}

  deploy(deployStrategyName: string) {
    const deploymentId = shortUUID.generate();
    const newDeploy = new Deployment(
      deploymentId,
      this.projectName,
      deployStrategyName,
    );
    this.deployments.push(newDeploy);

    return newDeploy;
  }
}
