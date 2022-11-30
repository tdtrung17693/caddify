import { Controller, Param, Post } from '@nestjs/common';
import { DeployService } from './domain/deploy.service';
import { DeployStrategyName } from './infra/deploy/deploy-strategy-manager';

@Controller()
export class AppController {
  constructor(private deployService: DeployService) {}

  @Post('/deployments/:projectid')
  deployProject(@Param('projectid') projectId: string) {
    return this.deployService.deployProject(
      projectId,
      DeployStrategyName.Caddy,
    );
  }
}
