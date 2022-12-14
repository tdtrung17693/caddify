import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { SharedModule } from '@shared/shared';
import fs from 'fs';
import multer from 'multer';
import os from 'os';
import path from 'path';
import { AppController } from './app.controller';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
    SharedModule,
    HttpModule,
    MulterModule.registerAsync({
      useFactory: () => ({
        storage: multer.diskStorage({
          destination: (req, file, cb) => {
            const uploadPath = fs.mkdtempSync(
              path.join(os.tmpdir(), 'deployment-artifact-'),
            );
            return cb(null, uploadPath);
          },
          filename: (req, file, cb) => {
            cb(null, `${file.originalname}-${Date.now()}`);
          },
        }),
      }),
    }),
    PrometheusModule.register(),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
