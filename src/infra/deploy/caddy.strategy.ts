import { Inject, Injectable } from '@nestjs/common';
import { IDeployStrategy } from 'src/domain/deploy.service';
import { Deployment } from 'src/domain/deployment';
import {
  DEPLOYMENT_REPOSITORY_TOKEN,
  IDeploymentRepository,
} from 'src/domain/deployment.repository';
import { CaddyService } from './caddy.service';

@Injectable()
export class CaddyStrategy implements IDeployStrategy {
  constructor(
    private caddyService: CaddyService,
    @Inject(DEPLOYMENT_REPOSITORY_TOKEN)
    private deploymentRepository: IDeploymentRepository,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async deploy(_: Deployment) {
    const deployments = await this.deploymentRepository.getAll();

    return this.caddyService.reloadConfig(deployments) as any;
  }
}
