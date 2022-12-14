import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createReadStream } from 'fs';
import fs from 'fs/promises';
import { getSiteRootDirectory } from '../../utils/siteUtils';
import tar from 'tar';
import { PipelineInput } from '../type';
import { Step } from './step';

@Injectable()
export class ArchiveUnpackStep extends Step {
  private readonly siteBaseDirectory: string;

  constructor(configService: ConfigService) {
    super();
    this.siteBaseDirectory = configService.get('SITE_BASE_DIRECTORY');
  }
  async run(input: PipelineInput): Promise<any> {
    this.logger.debug('Unpacking the artifact...');
    const fileStream = createReadStream(input.artifact.path);
    const deploymentRoot = getSiteRootDirectory(
      input.deployment.id,
      this.siteBaseDirectory,
    );

    await fs.mkdir(deploymentRoot);

    // extract the files from the tar archive
    fileStream.pipe(
      tar.x({
        C: deploymentRoot, // alias for cwd:'some-dir', also ok
      }),
    );

    this.logger.debug('Successfully unpacked the artifact.');
    return { ...input };
  }
}
