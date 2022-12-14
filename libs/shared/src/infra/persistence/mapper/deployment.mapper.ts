import { Deployment as DBDeployment } from '@prisma/client';
import { Deployment, DeploymentStatus } from '../../../domain/deployment';
import { ITypeMapper } from './type';

export class DeploymentMapper implements ITypeMapper<Deployment, DBDeployment> {
  map(deployment: Deployment): DBDeployment {
    return {
      id: deployment.id,
      projectId: deployment.projectId,
      createdAt: deployment.createdAt,
      modifiedAt: deployment.createdAt,
      deployStrategyName: deployment.deployStrategyName,
      domains: deployment.domains,
      metadata: deployment.metadata,
      status: deployment.status,
    };
  }
  invertMap(record: DBDeployment): Deployment {
    return new Deployment(
      record.id,
      record.projectId,
      record.deployStrategyName,
      record.domains,
      record.status as DeploymentStatus,
      record.metadata as object,
      record.createdAt,
      record.modifiedAt,
    );
  }
}
