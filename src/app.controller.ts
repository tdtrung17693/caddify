import {
  Controller,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileTypeValidator } from './infra/file-type.validator';
import { DeployService } from './domain/deploy.service';
import { DeployStrategyName } from './infra/type';

@Controller()
export class AppController {
  constructor(private deployService: DeployService) {}

  @Post('/deployments/:projectid')
  @UseInterceptors(FileInterceptor('file'))
  deployProject(
    @Param('projectid') projectId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: /(tar)/ })],
      }),
    )
    archiveFile: Express.Multer.File,
  ) {
    return this.deployService.deployProject(
      projectId,
      {
        artifact: archiveFile,
      },
      DeployStrategyName.Caddy,
    );
  }
}
