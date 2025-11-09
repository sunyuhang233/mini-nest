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
    Reflect.defineMetadata('method', 'POST', descriptor.value)
  }
}

export function Redirect(url: string = '', statusCode: number = 302): MethodDecorator {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata('redirectUrl', url, descriptor.value)
    Reflect.defineMetadata('redirectStatusCode', statusCode, descriptor.value)
  }
}

export function HttpCode(statusCode: number = 200): MethodDecorator {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata('statusCode', statusCode, descriptor.value)
  }
}

export function Header(key: string, value: string): MethodDecorator {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const existingHeaders = Reflect.getMetadata("headers", descriptor.value) || []
    existingHeaders.push({ key, value })
    Reflect.defineMetadata('headers', existingHeaders, descriptor.value)
  }
}
