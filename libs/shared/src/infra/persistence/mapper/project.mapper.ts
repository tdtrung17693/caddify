import {
  Project as DBProject,
  Deployment as DBDeployment,
} from '@prisma/client';
import { Project } from '../../../domain/project';
import { DeploymentMapper } from './deployment.mapper';
import { ITypeMapper } from './type';

export class ProjectMapper implements ITypeMapper<Project, DBProject> {
  constructor(private deploymentMapper: DeploymentMapper) {}
  map(project: Project): DBProject {
    return {
      id: project.id,
      projectName: project.projectName,
      userId: project.userId,
      createdAt: project.createdAt,
      modifiedAt: project.modifiedAt,
    };
  }
  invertMap(record: DBProject & { deployments: DBDeployment[] }): Project {
    return new Project(
      record.id,
      record.userId,
      record.projectName,
      record.deployments.map(this.deploymentMapper.invertMap),
      record.createdAt,
      record.modifiedAt,
    );
  }
}
