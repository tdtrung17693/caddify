import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base.service';
import { runMaybe } from 'src/common/maybe.type';
import { Deployment } from './deployment';
import {
  IProjectRepository,
  PROJECT_REPOSITORY_TOKEN,
} from './product.repository';
import {
  DeployArtifact,
  DeploymentResult,
  IUnitOfWork,
  UNIT_OF_WORK_TOKEN,
} from './unit-of-work';

export const DEPLOY_STRATEGY_TOKEN = Symbol('DEPLOY_STRATEGY');
export const DEPLOY_STRATEGY_MANAGER_TOKEN = Symbol('DEPLOY_STRATEGY_MANAGER');

export interface IDeployStrategy<T> {
  deploy(deployment: Deployment): Promise<T>;
}

export interface Site {
  id: string;
}

export interface IDeployStrategyManager {
  getDeployStrategy(strategyName: string): IDeployStrategy<Site>;
}

@Injectable()
export class DeployService extends BaseService {
  constructor(
    @Inject(PROJECT_REPOSITORY_TOKEN)
    private projectRepository: IProjectRepository,
    @Inject(UNIT_OF_WORK_TOKEN)
    private unitOfWork: IUnitOfWork<any>,
  ) {
    super();
  }
  async deployProject<T extends object>(
    projectId: string,
    deployArtifact: DeployArtifact<T>,
    deployStrategyName: string,
  ): Promise<DeploymentResult> {
    this.logger.log(
      `Deploying ${projectId} using strategy ${deployStrategyName}...`,
    );
    const project = await this.projectRepository.getById(projectId);

    return runMaybe(project, async (project) => {
      const deployment = project.deploy();
      const result = await this.unitOfWork.createDeployment(
        deployment,
        deployArtifact,
        deployStrategyName,
      );
      this.logger.log(
        `Deployed ${projectId} using strategy ${deployStrategyName}.`,
      );
      return result;
    });
  }
}
