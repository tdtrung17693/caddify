import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { runInContext } from 'vm';
import { AppModule } from './app.module';

class MainApp {
  private readonly logger: Logger = new Logger(MainApp.name);

  async run() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const port = configService.get('PORT');

    await app.listen(port, () => {
      this.logger.log(`App is listening on ${port}...`);
    });
  }
}
async function bootstrap() {
  const mainApp = new MainApp();
  await mainApp.run();
}
bootstrap();
