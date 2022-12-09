import { Site } from 'src/domain/deploy.service';

export interface CaddySite extends Site {
  siteName: string;
  rootDirectory: string;
  hostName: string;
}
