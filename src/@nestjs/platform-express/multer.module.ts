import { DynamicModule, Global, Module } from '@nestjs/common';
import { MulterModuleOptions } from './multer-options.interface';
import { MULTER_MODULE_OPTIONS } from './constants';
import { MulterConfigService } from './multer-config.service';

@Global()

@Module({})
export class MulterModule {
  static register(options: MulterModuleOptions): DynamicModule {
    return {
      module: MulterModule,
      providers: [
        {
          provide: MULTER_MODULE_OPTIONS,
          useValue: options,
        },
        MulterConfigService,
      ],
      exports: [MulterConfigService],
    };
  }
}
