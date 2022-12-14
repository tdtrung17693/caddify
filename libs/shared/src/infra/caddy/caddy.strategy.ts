import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IDeployStrategy } from '@shared/shared/domain/deploy.service';
import { Deployment } from '@shared/shared/domain/deployment';
import {
  DEPLOYMENT_REPOSITORY_TOKEN,
  IDeploymentRepository,
} from '@shared/shared/domain/deployment.repository';
import { getSiteRootDirectory } from '../../utils/siteUtils';
import { DeployStrategy } from '../deploy-strategy.decorator';
import { SupportedDeployStrategy } from '../type';
import { CaddyService } from './caddy.service';
import { CaddySite } from './type';

@DeployStrategy(SupportedDeployStrategy.Caddy)
export class CaddyStrategy implements IDeployStrategy<CaddySite> {
  private readonly siteBaseDirectory: string;
  constructor(
    @Inject(DEPLOYMENT_REPOSITORY_TOKEN)
    private deploymentRepository: IDeploymentRepository,
    private caddyService: CaddyService,
    configService: ConfigService,
  ) {
    this.siteBaseDirectory = configService.get('SITE_BASE_DIRECTORY');
  }

  async deploy(deployment: Deployment): Promise<CaddySite> {
    try {
      const deployments = await this.deploymentRepository.getAll();
      const sites: CaddySite[] = deployments.map((deployment) => ({
        id: deployment.id,
        hostName: deployment.domains,
        rootDirectory: getSiteRootDirectory(
          deployment.id,
          this.siteBaseDirectory,
        ),
        siteName: deployment.id,
      }));
      const deploymentSite = sites.find((site) => site.id === deployment.id);
      await this.caddyService.reloadConfig(sites);

      return deploymentSite;
    } catch (err) {}
  }

  async reloadConfiguration(sites: CaddySite[]) {
    await this.caddyService.reloadConfig(sites);

    return true;
  }
}
