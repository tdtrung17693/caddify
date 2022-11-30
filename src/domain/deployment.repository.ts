import { Deployment } from './deployment';

export const DEPLOYMENT_REPOSITORY_TOKEN = Symbol('DEPLOYMENT_REPOSITORY');
export interface IDeploymentRepository {
  getAll(): Promise<Deployment[]>;
  getByProjectId(projectId: string): Promise<Deployment[]>;
  save(deployment: Deployment): Promise<boolean>;
}
