import 'reflect-metadata';

export const createParamsDecorator = (key: string) => {
  /**
   * target 原型 propertyKey 方法名 parameterIndex 参数索引 先走1再走0
   */
  return (data?: any) => (target: any, propertyKey: string, parameterIndex: number) => {
    // 也就是给原型上的方法添加元数据
    // 属性名为param:handleRequest 数据类型为数组 数组里放置表示哪个位置使用哪个装饰器
    const existingParams = Reflect.getMetadata(`params`, target, propertyKey) || [];
    existingParams[parameterIndex] = { key, index: parameterIndex, data };
    Reflect.defineMetadata(`params`, existingParams, target, propertyKey);

  }
}


export const Request = createParamsDecorator('Request');
export const Req = createParamsDecorator('Req');
export const Query = createParamsDecorator('Query');
export const Headers = createParamsDecorator('Headers');
export const Session = createParamsDecorator('Session');
export const Ip = createParamsDecorator('Ip');
export const Param = createParamsDecorator('Param');
