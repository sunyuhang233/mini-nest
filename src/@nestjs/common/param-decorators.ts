import 'reflect-metadata';

export const createParamsDecorator = (key: string) => {
  /**
   * target 原型 propertyKey 方法名 parameterIndex 参数索引 先走1再走0
   */
  return () => (target: any, propertyKey: string, parameterIndex: number) => {
    // 也就是给原型上的方法添加元数据
    // 属性名为param:handleRequest 数据类型为数组 数组里放置表示哪个位置使用哪个装饰器
    const existingParams = Reflect.getMetadata(`params`, target, propertyKey) || [];
    existingParams.push({ parameterIndex, key });
    Reflect.defineMetadata(`params`, existingParams, target, propertyKey);

  }
}


export const Request = createParamsDecorator('Request');
export const Req = createParamsDecorator('Req');
