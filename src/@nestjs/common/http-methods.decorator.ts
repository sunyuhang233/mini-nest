export function Get(path: string = ''): MethodDecorator {
  /**
   * target: 类的原型对象
   * propertyKey: 方法名
   * descriptor: 方法描述符
   */
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata('path', path, descriptor.value)
    Reflect.defineMetadata('method', 'GET', descriptor.value)
  }
}


export function Post(path: string = ''): MethodDecorator {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata('path', path, descriptor.value)
    Reflect.defineMetadata('method', 'Post', descriptor.value)
  }
}
