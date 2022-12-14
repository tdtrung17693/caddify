import { Inject, Injectable } from '@nestjs/common';
import {
  DEPLOY_STRATEGY_MANAGER_TOKEN,
  IDeployStrategyManager,
} from '../../domain/deploy.service';
import {
  DEPLOYMENT_REPOSITORY_TOKEN,
  IDeploymentRepository,
} from '../../domain/deployment.repository';
import { PipelineInput } from '../type';
import { Step } from './step';

@Injectable()
export class ConfigDeploymentStep extends Step {
  constructor(
    @Inject(DEPLOY_STRATEGY_MANAGER_TOKEN)
    private deployStrategyManager: IDeployStrategyManager<any>,
    @Inject(DEPLOYMENT_REPOSITORY_TOKEN)
    private deploymentRepository: IDeploymentRepository,
  ) {
    super();
  }

  async run(input: PipelineInput): Promise<any> {
    this.logger.debug('Updating server config...');
    const { deployment } = input;
    const deployStrategy = this.deployStrategyManager.getDeployStrategy(
      deployment.deployStrategyName,
    );
    const site = await deployStrategy.deploy(deployment);
    deployment.metadata = {
      ...site,
    };
    await this.deploymentRepository.save(deployment);
    this.logger.debug('Successfully updated server config...');
    return { ...input, deployment };
  }
}
