import { FileValidator } from '@nestjs/common';

interface FileValidatorOptions {
  fileType: RegExp;
}

export class FileTypeValidator extends FileValidator<FileValidatorOptions> {
  buildErrorMessage(): string {
    return `Validation failed (expected type is ${this.validationOptions.fileType})`;
  }

  async isValid(file: Express.Multer.File): Promise<boolean> {
    const { fileTypeFromFile } = await import('file-type');
    if (!this.validationOptions) {
      return true;
    }

    const fileType = await fileTypeFromFile(file.path);
    if (!fileType) {
      return false;
    }

    return Boolean(fileType.mime.match(this.validationOptions.fileType));
  }
}
