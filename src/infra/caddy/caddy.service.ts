import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { BaseService } from 'src/common/base.service';
import { CaddySite } from './type';

type CaddyConfig = unknown;
@Injectable()
export class CaddyService extends BaseService {
  private readonly caddyApiBaseUrl: string;

  constructor(private httpClient: HttpService, configService: ConfigService) {
    super();
    this.caddyApiBaseUrl = configService.get('CADDY_API_BASE_URL');
  }

  protected generateSiteConfig(site: CaddySite) {
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

  async reloadConfig(sites: CaddySite[]) {
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
