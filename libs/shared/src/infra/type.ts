import { Deployment } from '../domain/deployment';
import { CaddySite } from './caddy/type';

export interface PipelineInput {
  artifact: Express.Multer.File;
  deployment: Deployment;
}

export const SUPPORTED_DEPLOY_STRATEGIES_TOKEN = Symbol(
  'SUPPORTED_DEPLOY_STRATEGIES',
);
export enum SupportedDeployStrategy {
  Caddy = 'Caddy',
}

export type DeployStrategyType = {
  [SupportedDeployStrategy.Caddy]: CaddySite;
};
