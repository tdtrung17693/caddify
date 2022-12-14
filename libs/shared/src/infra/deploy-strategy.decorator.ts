import { applyDecorators, Injectable, SetMetadata } from '@nestjs/common';
import { DEPLOY_STRATEGY_TOKEN } from '../domain/deploy.service';
import { SupportedDeployStrategy } from './type';

export interface DeployStrategyMetadata {
  strategyName: string;
}
export function DeployStrategy(strategyName: SupportedDeployStrategy) {
  return applyDecorators(
    Injectable(),
    SetMetadata(DEPLOY_STRATEGY_TOKEN, {
      strategyName,
    } as DeployStrategyMetadata),
  );
}
