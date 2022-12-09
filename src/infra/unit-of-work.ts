import { Inject, Injectable } from '@nestjs/common';
import { Deployment } from 'src/domain/deployment';
import {
  DEPLOYMENT_REPOSITORY_TOKEN,
  IDeploymentRepository,
} from 'src/domain/deployment.repository';
import {
  DeployArtifact,
  DeploymentResult,
  IUnitOfWork,
} from 'src/domain/unit-of-work';
import { PipelineFactory } from './pipeline/pipeline-builder';
import { DeployStrategyName, PipelineInput } from './type';

@Injectable()
export class UnitOfWork implements IUnitOfWork<DeployStrategyName> {
  constructor(
    @Inject(DEPLOYMENT_REPOSITORY_TOKEN)
    private deploymentRepository: IDeploymentRepository,
    private pipelineFactory: PipelineFactory,
  ) {}
  async createDeployment(
    deployment: Deployment,
    deployFileArchive: DeployArtifact<any>,
    deployStrategyName: DeployStrategyName,
  ): Promise<DeploymentResult> {
    await this.deploymentRepository.save(deployment);
    const pipeline = this.pipelineFactory.build(deployStrategyName);
    const output = await pipeline.run<PipelineInput>({
      artifact: deployFileArchive.artifact,
      deployment,
      deployStrategyName,
    });

    return {
      deployment,
      success: true,
    };
  }
}
