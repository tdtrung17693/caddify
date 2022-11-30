import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Deployment } from 'src/domain/deployment';

type CaddyConfig = unknown;
interface Site {
  siteName: string;
  rootDirectory: string;
  hostName: string;
}

@Injectable()
export class CaddyService {
  private readonly caddyApiBaseUrl: string;
  private readonly siteBaseDomain: string;
  private readonly siteBaseDirectory: string;

  constructor(private httpClient: HttpService, configService: ConfigService) {
    this.caddyApiBaseUrl = configService.get('CADDY_API_BASE_URL');
    this.siteBaseDomain = configService.get('SITE_BASE_DOMAIN');
    this.siteBaseDirectory = configService.get('SITE_BASE_DIRECTORY');
  }

  protected generateSiteConfig(site: Site) {
    const { siteName, rootDirectory, hostName } = site;

    return {
      group: siteName,
      match: [
        {
          host: [hostName],
        },
      ],
      handle: [
        {
          handler: 'file_server',
          root: rootDirectory,
        },
      ],
    };
  }

  private async updateConfig(newConfig: CaddyConfig) {
    await firstValueFrom(
      this.httpClient.post(`${this.caddyApiBaseUrl}/config/`, newConfig),
    );
  }

  private getSiteHostName(siteName: string) {
    return `${siteName}.${this.siteBaseDomain}`;
  }

  private getSiteRootDirectory(siteName: string) {
    return `${this.siteBaseDirectory}/${siteName}`;
  }

  async reloadConfig(deployments: Deployment[]) {
    const sites: Site[] = deployments.map((deployment) => ({
      hostName: this.getSiteHostName(deployment.id),
      rootDirectory: this.getSiteRootDirectory(deployment.id),
      siteName: deployment.id,
    }));
    const sitesConfig = sites.map(this.generateSiteConfig);
    const adminConfig = this.getAdminConfig();

    const newConfig = {
      ...adminConfig,
      apps: {
        http: {
          servers: {
            sites: {
              listen: [':80'],
              routes: [...sitesConfig],
            },
          },
        },
      },
    };
    await this.updateConfig(newConfig);
  }

  private getAdminConfig() {
    return {
      admin: {
        disabled: false,
        listen: `0.0.0.0:2019`,
      },
    };
  }

  async getCurrentConfig(): Promise<CaddyConfig> {
    const caddyConfig = await firstValueFrom(
      this.httpClient.get<CaddyConfig>(`${this.caddyApiBaseUrl}/config/`),
    );

    return caddyConfig.data;
  }
}
