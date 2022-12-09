import { Injectable } from '@nestjs/common';
import { Deployment } from 'src/domain/deployment';
import { IDeploymentRepository } from 'src/domain/deployment.repository';

const MEM: Record<string, Deployment> = {};
@Injectable()
export class DeploymentRepository implements IDeploymentRepository {
  async getAll(): Promise<Deployment[]> {
    return Object.values(MEM);
  }
  async getByProjectId(projectId: string): Promise<Deployment[]> {
    return Object.values(MEM).filter(
      (deployment) => deployment.projectId === projectId,
    );
  }
  async save(deployment: Deployment): Promise<boolean> {
    MEM[deployment.id] = deployment;
    return true;
  }
}
