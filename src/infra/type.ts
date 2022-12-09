import { Deployment } from 'src/domain/deployment';
import { CaddySite } from './caddy/type';

export interface PipelineInput {
  artifact: Express.Multer.File;
  deployment: Deployment;
  deployStrategyName: string;
}

export enum DeployStrategyName {
  Caddy = 'Caddy',
}

export type DeployStrategyType = {
  [DeployStrategyName.Caddy]: CaddySite;
};
