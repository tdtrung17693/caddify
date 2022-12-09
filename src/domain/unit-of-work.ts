import { Deployment } from './deployment';

export const UNIT_OF_WORK_TOKEN = Symbol('UNIT_OF_WORK');
export interface DeploymentResult {
  success: boolean;
  error?: any;
  deployment: Deployment;
}
export interface DeployArtifact<T> {
  artifact: T;
}
export interface IUnitOfWork<T> {
  createDeployment(
    newDeployment: Deployment,
    deployArtifact: DeployArtifact<any>,
    deployStrategyName: T,
  ): Promise<DeploymentResult>;
}
