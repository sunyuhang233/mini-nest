import { Module, DynamicModule } from '@nestjs/common';
@Module({
  providers: [{ provide: 'Token', useValue: 'token' }],
  controllers: [],
  exports: ['Token'],
})
export class DynamicConfigModule {
  static forRoot(): DynamicModule {
    const providers: any = [
      {
        provide: 'CONFIG',
        useValue: { apiKey: '123' }
      }
    ];
    return {
      module: DynamicConfigModule,
      providers,
      exports: providers.map(provider => (provider instanceof Function ? provider : provider.provide))
    };
  }
}
