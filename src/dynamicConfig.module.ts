import { Module, DynamicModule } from '@nestjs/common';
@Module({
  providers: [{ provide: 'Token', useValue: 'token' }],
  controllers: [],
  exports: ['Token'],
})
export class DynamicConfigModule {
  static forRoot(data?: any): DynamicModule | Promise<DynamicModule> {
    const providers: any = [
      {
        provide: 'CONFIG',
        useValue: { apiKey: data }
      }
    ];
    // return {
    //   module: DynamicConfigModule,
    //   providers,
    //   exports: providers.map(provider => (provider instanceof Function ? provider : provider.provide))
    // };

    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          module: DynamicConfigModule,
          providers,
          exports: providers.map(provider => (provider instanceof Function ? provider : provider.provide))
        });
      }, 3000);
    });
  }
}
