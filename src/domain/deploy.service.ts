import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base.service';
import { runMaybe } from 'src/common/maybe.type';
import { Deployment } from './deployment';
import {
  DEPLOYMENT_REPOSITORY_TOKEN,
  IDeploymentRepository,
} from './deployment.repository';
import {
  IProjectRepository,
  PROJECT_REPOSITORY_TOKEN,
} from './product.repository';

export const DEPLOY_STRATEGY_TOKEN = Symbol('DEPLOY_STRATEGY');
export const DEPLOY_STRATEGY_MANAGER_TOKEN = Symbol('DEPLOY_STRATEGY_MANAGER');

export interface IDeployStrategy {
  deploy(deployment: Deployment): Promise<boolean>;
}
export interface IDeployStrategyManager {
  getDeployStrategy(strategyName: string): IDeployStrategy;
}

@Injectable()
export class DeployService extends BaseService {
  constructor(
    @Inject(DEPLOY_STRATEGY_MANAGER_TOKEN)
    private deployStrategyManager: IDeployStrategyManager,
    @Inject(PROJECT_REPOSITORY_TOKEN)
    private projectRepository: IProjectRepository,
    @Inject(DEPLOYMENT_REPOSITORY_TOKEN)
    private deploymentRepository: IDeploymentRepository,
  ) {
    super();
  }
  async deployProject(projectId: string, deployStrategyName: string) {
    this.logger.log(
      `Deploying ${projectId} using strategy ${deployStrategyName}...`,
    );
    const strategy =
      this.deployStrategyManager.getDeployStrategy(deployStrategyName);
    const project = await this.projectRepository.getById(projectId);
    return runMaybe(project, async (project) => {
      const deployment = project.deploy();
      await this.deploymentRepository.save(deployment);
      const result = await strategy.deploy(deployment);

      this.logger.log(
        `Deployed ${projectId} using strategy ${deployStrategyName}.`,
      );
      return result;
    });
  }
}
