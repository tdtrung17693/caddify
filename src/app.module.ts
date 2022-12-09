import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import fs from 'fs';
import multer from 'multer';
import os from 'os';
import path from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  DeployService,
  DEPLOY_STRATEGY_MANAGER_TOKEN,
} from './domain/deploy.service';
import { DEPLOYMENT_REPOSITORY_TOKEN } from './domain/deployment.repository';
import { PROJECT_REPOSITORY_TOKEN } from './domain/product.repository';
import { UNIT_OF_WORK_TOKEN } from './domain/unit-of-work';
import { CaddyService } from './infra/caddy/caddy.service';
import { CaddyStrategy } from './infra/caddy/caddy.strategy';
import { DeployStrategyManager } from './infra/deploy-strategy-manager';
import { DeploymentRepository } from './infra/deployment.repository';
import { ArchiveUnpackStep } from './infra/pipeline/archive-unpack.step';
import { ConfigDeploymentStep } from './infra/pipeline/config-deployment.step';
import { PipelineFactory } from './infra/pipeline/pipeline-builder';
import { ProjectRepository } from './infra/project.repository';
import { DeployStrategyName } from './infra/type';
import { UnitOfWork } from './infra/unit-of-work';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
    HttpModule,
    MulterModule.registerAsync({
      useFactory: () => ({
        storage: multer.diskStorage({
          destination: (req, file, cb) => {
            const uploadPath = fs.mkdtempSync(
              path.join(os.tmpdir(), 'deployment-artifact-'),
            );
            return cb(null, uploadPath);
          },
          filename: (req, file, cb) => {
            cb(null, `${file.originalname}-${Date.now()}`);
          },
        }),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [
    DeployService,
    AppService,
    CaddyService,
    ArchiveUnpackStep,
    ConfigDeploymentStep,
    PipelineFactory,
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
    {
      provide: UNIT_OF_WORK_TOKEN,
      useClass: UnitOfWork,
    },
  ],
})
export class AppModule {}
