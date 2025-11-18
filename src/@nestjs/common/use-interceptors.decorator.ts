import 'reflect-metadata';

export function UseInterceptors(...interceptors) {
  return (target: object | Function, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<any>) => {
    if (descriptor) {
      const existingInterceptors = Reflect.getMetadata('interceptors', descriptor.value) || [];
      Reflect.defineMetadata('interceptors', [...existingInterceptors, ...interceptors], descriptor.value);
    } else {
      const existingInterceptors = Reflect.getMetadata('interceptors', target) || [];
      Reflect.defineMetadata('interceptors', [...existingInterceptors, ...interceptors], target);
    }
  };
}
