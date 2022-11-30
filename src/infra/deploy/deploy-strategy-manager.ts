import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import {
  IDeployStrategy,
  IDeployStrategyManager,
} from 'src/domain/deploy.service';

export enum DeployStrategyName {
  Caddy = 'CADDY_STRATEGY',
}

@Injectable()
export class DeployStrategyManager implements IDeployStrategyManager {
  constructor(private moduleResolver: ModuleRef) {}
  getDeployStrategy(strategyName: string): IDeployStrategy {
    return this.moduleResolver.get(strategyName);
  }
}
