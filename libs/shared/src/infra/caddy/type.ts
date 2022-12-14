import { Site } from '../../domain/deploy.service';

export interface CaddySite extends Site {
  siteName: string;
  rootDirectory: string;
  hostName: string[];
}

export type CaddyConfig = {
  admin: { disabled: boolean; listen: string };
  apps: {
    http: {
      servers: {
        [K: string]: {
          listen: string[];
          routes: {
            group: string;
            match: {
              host: string[];
            }[];
            handle: {
              handler: string;
              root: string;
            }[];
          }[];
        };
      };
    };
  };
};
