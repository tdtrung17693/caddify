import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import {
  IDeployStrategy,
  IDeployStrategyManager,
} from 'src/domain/deploy.service';
import { DeployStrategyType } from './type';

@Injectable()
export class DeployStrategyManager implements IDeployStrategyManager {
  constructor(private moduleResolver: ModuleRef) {}
  getDeployStrategy(
    strategyName: keyof DeployStrategyType,
  ): IDeployStrategy<DeployStrategyType[typeof strategyName]> {
    return this.moduleResolver.get(strategyName as string);
  }
}
