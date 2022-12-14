import { Logger } from '@nestjs/common';

export interface IPipelineStep {
  run(input: any): Promise<any>;
}

export abstract class Step implements IPipelineStep {
  protected readonly logger: Logger;

  constructor() {
    this.logger = new Logger(this.constructor.name);
  }

  abstract run(input: any): Promise<any>;
}
