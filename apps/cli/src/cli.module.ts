import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from '@shared/shared';
import { ReloadRuntimeConfigCommand } from './reload-runtime-config.command';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
    SharedModule,
  ],
  providers: [ReloadRuntimeConfigCommand],
})
export class CliModule {}
