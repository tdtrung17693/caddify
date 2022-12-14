import { Inject, Injectable } from '@nestjs/common';
import {
  DEPLOY_STRATEGY_MANAGER_TOKEN,
  IDeployStrategyManager,
} from '../domain/deploy.service';
import { Deployment } from '../domain/deployment';
import {
  DEPLOYMENT_REPOSITORY_TOKEN,
  IDeploymentRepository,
} from '../domain/deployment.repository';
import {
  IUnitOfWork,
  DeployArtifact,
  DeploymentResult,
} from '../domain/unit-of-work';
import { partitionBy } from '../utils/deploymentUtils';
import { PipelineFactory } from './pipeline/pipeline-builder';
import { SupportedDeployStrategy, PipelineInput } from './type';

@Injectable()
export class UnitOfWork implements IUnitOfWork {
  constructor(
    @Inject(DEPLOYMENT_REPOSITORY_TOKEN)
    private deploymentRepository: IDeploymentRepository,
    private pipelineFactory: PipelineFactory,
    @Inject(DEPLOY_STRATEGY_MANAGER_TOKEN)
    private deployStrategyManager: IDeployStrategyManager<any>,
  ) {}
  async createDeployment(
    deployment: Deployment,
    deployFileArchive: DeployArtifact<any>,
  ): Promise<DeploymentResult> {
    await this.deploymentRepository.save(deployment);
    const pipeline = this.pipelineFactory.build(
      deployment.deployStrategyName as SupportedDeployStrategy,
    );
    await pipeline.run<PipelineInput>({
      artifact: deployFileArchive.artifact,
      deployment,
    });

    return {
      deployment,
      success: true,
    };
  }
  async reloadRuntimeConfiguration(): Promise<any> {
    const deployments = await this.deploymentRepository.getAll();
    const partionedDeployments = partitionBy(deployments, 'deployStrategyName');
    const supportedStrategies =
      this.deployStrategyManager.getAllSupportedStrategies();
    const responses = await Promise.allSettled(
      Object.entries(supportedStrategies).map(([strategyName, strategy]) =>
        strategy.reloadConfiguration(partionedDeployments[strategyName]),
      ),
    );
    const errors = [];
    responses.forEach((r) => r.status === 'rejected' && errors.push(r.reason));

    return {
      success: false,
      errors,
    };
  }
}
