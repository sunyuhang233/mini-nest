import { Module } from '@nestjs/common';
import { MyLogger } from './loggerService';

@Module({
  providers: [MyLogger,
    {
      provide: 'logger',
      useValue: 'logger',
    }
  ],
  exports: [MyLogger],
})
export class LoggerModule { }
