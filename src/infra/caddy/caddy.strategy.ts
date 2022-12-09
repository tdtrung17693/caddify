import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IDeployStrategy } from 'src/domain/deploy.service';
import { Deployment } from 'src/domain/deployment';
import {
  DEPLOYMENT_REPOSITORY_TOKEN,
  IDeploymentRepository,
} from 'src/domain/deployment.repository';
import { getSiteHostName, getSiteRootDirectory } from 'src/infra/site.util';
import { CaddyService } from './caddy.service';
import { CaddySite } from './type';

@Injectable()
export class CaddyStrategy implements IDeployStrategy<CaddySite> {
  private readonly siteBaseDomain: string;
  private readonly siteBaseDirectory: string;
  constructor(
    @Inject(DEPLOYMENT_REPOSITORY_TOKEN)
    private deploymentRepository: IDeploymentRepository,
    private caddyService: CaddyService,
    configService: ConfigService,
  ) {
    this.siteBaseDomain = configService.get('SITE_BASE_DOMAIN');
    this.siteBaseDirectory = configService.get('SITE_BASE_DIRECTORY');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async deploy(deployment: Deployment): Promise<CaddySite> {
    try {
      const deployments = await this.deploymentRepository.getAll();
      const sites: CaddySite[] = deployments.map((deployment) => ({
        id: deployment.id,
        hostName: getSiteHostName(deployment, this.siteBaseDomain),
        rootDirectory: getSiteRootDirectory(deployment, this.siteBaseDirectory),
        siteName: deployment.id,
      }));
      const deploymentSite = sites.find((site) => site.id === deployment.id);
      await this.caddyService.reloadConfig(sites);

      return deploymentSite;
    } catch (err) {}
  }
}
