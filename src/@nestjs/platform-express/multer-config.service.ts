import { Inject, Injectable } from '@nestjs/common';
import { MULTER_MODULE_OPTIONS } from './constants';
import { MulterModuleOptions } from './multer-options.interface';

import multer from 'multer';

@Injectable()
export class MulterConfigService {

  constructor(
    @Inject(MULTER_MODULE_OPTIONS) private options: MulterModuleOptions,
  ) { }

  createMulterOptions() {
    console.log('createMulterOptions', this.options);
    return this.options;
  }
  getMulterInstance() {
    return multer(this.createMulterOptions());
  }
}
