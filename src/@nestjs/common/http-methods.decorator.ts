import 'reflect-metadata'

export function Get(path: string = ''): MethodDecorator {
  /**
   * 返回一个方法装饰器
   * @param target 原型
   * @param propertyKey 方法名
   * @param descriptor 方法描述器
   * @returns
   */
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    // 也就是给方法函数添加path元数据
    Reflect.defineMetadata('path', path, descriptor.value)
    // 也就是给方法函数添加method元数据
    Reflect.defineMetadata('method', 'GET', descriptor.value)
  }
}


export function Post(path: string = ''): MethodDecorator {
  /**
   * 返回一个方法装饰器
   * @param target 原型
   * @param propertyKey 方法名
   * @param descriptor 方法描述器
   * @returns
   */
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    // 也就是给方法函数添加path元数据
    Reflect.defineMetadata('path', path, descriptor.value)
    // 也就是给方法函数添加method元数据
    Reflect.defineMetadata('method', 'POST', descriptor.value)
  }
}

export function Redirect(url: string = '', statusCode: number = 302): MethodDecorator {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata('redirectUrl', url, descriptor.value)
    Reflect.defineMetadata('redirectStatusCode', statusCode, descriptor.value)
  }
}


export function HttpCode(statusCode: number = 200): MethodDecorator {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata('statusCode', statusCode, descriptor.value)
  }
}


export function Header(name: string, value: string): MethodDecorator {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const existingHeaders = Reflect.getMetadata('headers', descriptor.value) || [];
    existingHeaders.push({ name, value });
    Reflect.defineMetadata('headers', existingHeaders, descriptor.value);
  }
}
