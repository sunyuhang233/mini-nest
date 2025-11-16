import 'reflect-metadata';
export function UseGuards(...guards: any[]) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    if (descriptor) {
      Reflect.defineMetadata('guards', guards, descriptor.value);
    } else {
      Reflect.defineMetadata('guards', guards, target);
    }
  }
}
