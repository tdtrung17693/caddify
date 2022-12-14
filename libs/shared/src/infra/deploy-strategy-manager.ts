import { Injectable } from '@nestjs/common';
import {
  IDeployStrategy,
  IDeployStrategyManager,
  Site,
} from '../domain/deploy.service';
import { DeployStrategyType, SupportedDeployStrategy } from './type';

class DeployStrategyNotSupported extends Error {}

@Injectable()
export class DeployStrategyManager
  implements IDeployStrategyManager<SupportedDeployStrategy>
{
  private supportedStrategies = new Map<
    SupportedDeployStrategy,
    IDeployStrategy<any>
  >();

  registerStrategy(
    strategyName: SupportedDeployStrategy,
    strategy: IDeployStrategy<any>,
  ) {
    this.supportedStrategies[strategyName] = strategy;
  }

  getDeployStrategy(
    strategyName: SupportedDeployStrategy,
  ): IDeployStrategy<DeployStrategyType[typeof strategyName]> {
    const strategy = this.supportedStrategies[strategyName];

    if (!strategy) throw new DeployStrategyNotSupported();

    return strategy;
  }

  getAllSupportedStrategies(): Map<
    SupportedDeployStrategy,
    IDeployStrategy<Site>
  > {
    return Object.freeze(this.supportedStrategies);
  }
}
