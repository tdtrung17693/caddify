import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import {
  DeployStrategyManager,
  DeployStrategyName,
} from './infra/deploy/deploy-strategy-manager';
import { CaddyStrategy } from './infra/deploy/caddy.strategy';
import { CaddyService } from './infra/deploy/caddy.service';
import { DEPLOYMENT_REPOSITORY_TOKEN } from './domain/deployment.repository';
import { DeploymentRepository } from './infra/deployment.repository';
import {
  DeployService,
  DEPLOY_STRATEGY_MANAGER_TOKEN,
} from './domain/deploy.service';
import { PROJECT_REPOSITORY_TOKEN } from './domain/product.repository';
import { ProjectRepository } from './infra/project.repository';

@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  controllers: [AppController],
  providers: [
    DeployService,
    AppService,
    CaddyService,
    {
      provide: DeployStrategyName.Caddy,
      useClass: CaddyStrategy,
    },
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
  ],
})
export class AppModule {}
