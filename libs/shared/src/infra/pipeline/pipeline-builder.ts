import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Pipeline } from '../../domain/pipeline';
import { SupportedDeployStrategy } from '../type';
import { ArchiveUnpackStep } from './archive-unpack.step';
import { ConfigDeploymentStep } from './config-deployment.step';

@Injectable()
export class PipelineFactory {
  constructor(private moduleRef: ModuleRef) {}
  build(deployStrategyName: SupportedDeployStrategy) {
    if (deployStrategyName === SupportedDeployStrategy.Caddy) {
      return this.buildCaddyPipeline();
    }
    return this.buildCaddyPipeline();
  }
  private buildCaddyPipeline() {
    const pipeline = new Pipeline();

    const unpackStep = this.moduleRef.get(ArchiveUnpackStep);
    const configStep = this.moduleRef.get(ConfigDeploymentStep);

    pipeline.insertStep(unpackStep, 0);
    pipeline.insertStep(configStep, 1);

    return pipeline;
  }
}
