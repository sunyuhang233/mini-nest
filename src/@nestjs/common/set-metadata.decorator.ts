import 'reflect-metadata';
export function SetMetadata(metadataKey: any, metadataValue: any): MethodDecorator & ClassDecorator {
  return (target: object | Function, key?: string | symbol, descriptor?: TypedPropertyDescriptor<any>) => {
    if (descriptor) {
      Reflect.defineMetadata(metadataKey, metadataValue, descriptor.value);
    } else {
      Reflect.defineMetadata(metadataKey, metadataValue, target);
    }
  };
}
