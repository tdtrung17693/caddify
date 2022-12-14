import { Inject, Logger } from '@nestjs/common';
import { UNIT_OF_WORK_TOKEN } from '@shared/shared/domain/unit-of-work';
import { UnitOfWork } from '@shared/shared/infra/unit-of-work';
import { Command, CommandRunner } from 'nest-commander';

@Command({
  name: 'reload-runtime',
  options: { isDefault: true },
})
export class ReloadRuntimeConfigCommand extends CommandRunner {
  public readonly logger: Logger = new Logger(ReloadRuntimeConfigCommand.name);
  constructor(
    @Inject(UNIT_OF_WORK_TOKEN) private readonly unitOfWork: UnitOfWork,
  ) {
    super();
  }

  async run(): Promise<void> {
    await this.unitOfWork.reloadRuntimeConfiguration();
  }
}
