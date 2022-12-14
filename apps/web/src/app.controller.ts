import {
  Controller,
  FileTypeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DeployService } from '@shared/shared/domain/deploy.service';
import { SupportedDeployStrategy } from '@shared/shared/infra/type';

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
      SupportedDeployStrategy.Caddy,
    );
  }
}
