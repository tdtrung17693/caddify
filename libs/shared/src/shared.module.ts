import { HttpModule } from '@nestjs/axios';
import { Inject, Module } from '@nestjs/common';
import { DiscoveryModule, DiscoveryService } from '@nestjs/core';
import {
  DeployService,
  DEPLOY_STRATEGY_MANAGER_TOKEN,
  DEPLOY_STRATEGY_TOKEN,
  IDeployStrategy,
  IDeployStrategyManager,
} from './domain/deploy.service';
import { DEPLOYMENT_REPOSITORY_TOKEN } from './domain/deployment.repository';
import { PROJECT_REPOSITORY_TOKEN } from './domain/product.repository';
import { UNIT_OF_WORK_TOKEN } from './domain/unit-of-work';
import { CaddyService } from './infra/caddy/caddy.service';
import { CaddyStrategy } from './infra/caddy/caddy.strategy';
import { DeployStrategyManager } from './infra/deploy-strategy-manager';
import { DeployStrategyMetadata } from './infra/deploy-strategy.decorator';
import { DeploymentRepository } from './infra/persistence/deployment.repository';
import { ArchiveUnpackStep } from './infra/pipeline/archive-unpack.step';
import { ConfigDeploymentStep } from './infra/pipeline/config-deployment.step';
import { PipelineFactory } from './infra/pipeline/pipeline-builder';
import { ProjectRepository } from './infra/persistence/project.repository';
import { SupportedDeployStrategy } from './infra/type';
import { UnitOfWork } from './infra/unit-of-work';
import { PrismaService } from './infra/persistence/prisma.service';

@Module({
  imports: [HttpModule, DiscoveryModule],
  providers: [
    DeployService,
    CaddyService,
    ArchiveUnpackStep,
    ConfigDeploymentStep,
    PipelineFactory,
    CaddyStrategy,
    PrismaService,
    {
      provide: DEPLOYMENT_REPOSITORY_TOKEN,
      useClass: DeploymentRepository,
    },
    {
      provide: PROJECT_REPOSITORY_TOKEN,
      useClass: ProjectRepository,
    },
    {
      provide: DEPLOY_STRATEGY_MANAGER_TOKEN,
      useClass: DeployStrategyManager,
    },
    {
      provide: UNIT_OF_WORK_TOKEN,
      useClass: UnitOfWork,
    },
  ],
  exports: [
    DeployService,
    CaddyService,
    ArchiveUnpackStep,
    ConfigDeploymentStep,
    PipelineFactory,
    CaddyStrategy,
    {
      provide: DEPLOYMENT_REPOSITORY_TOKEN,
      useClass: DeploymentRepository,
    },
    {
      provide: PROJECT_REPOSITORY_TOKEN,
      useClass: ProjectRepository,
    },
    {
      provide: DEPLOY_STRATEGY_MANAGER_TOKEN,
      useClass: DeployStrategyManager,
    },
    {
      provide: UNIT_OF_WORK_TOKEN,
      useClass: UnitOfWork,
    },
  ],
})
export class SharedModule {
  constructor(
    private readonly discovery: DiscoveryService,
    @Inject(DEPLOY_STRATEGY_MANAGER_TOKEN)
    private readonly deployStrategyManager: IDeployStrategyManager<SupportedDeployStrategy>,
  ) {}

  onModuleInit(): any {
    const wrappers = this.discovery.getProviders();

    const strategies = wrappers
      .filter(
        (wrapper) =>
          wrapper.metatype &&
          Reflect.getMetadata(DEPLOY_STRATEGY_TOKEN, wrapper.metatype),
      )
      .map((wrapper) => {
        const metadata: DeployStrategyMetadata = Reflect.getMetadata(
          DEPLOY_STRATEGY_TOKEN,
          wrapper.metatype,
        ) as { strategyName: string };
        return {
          instance: wrapper.instance,
          strategyName: metadata.strategyName,
        };
      }) as {
      instance: IDeployStrategy<any>;
      strategyName: SupportedDeployStrategy;
    }[];

    strategies.forEach((provider) =>
      this.deployStrategyManager.registerStrategy(
        provider.strategyName,
        provider.instance,
      ),
    );
  }
}
