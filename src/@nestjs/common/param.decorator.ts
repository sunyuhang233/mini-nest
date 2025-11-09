import "reflect-metadata"

export const createParamDecorator = (key: string) => {
  /**
   * target: 类的原型对象
   * propertyKey: 方法名
   * parameterIndex: 参数索引(从右往左执行)
   */
  return (data?: any) => (target: any, propertyKey: string, parameterIndex: number) => {
    // 给控制器的原型的propertyKey方法添加一个params的元数据
    // 属性名是params 值是数组 数组里面放置数据 表示哪个位置使用哪个装饰器
    const existingParams = Reflect.getMetadata("params", target, propertyKey) || []
    //existingParams.push({ parameterIndex, key })
    existingParams[parameterIndex] = { parameterIndex, key, data }
    Reflect.defineMetadata(`params`, existingParams, target, propertyKey)
  }
};

export const Request = createParamDecorator('Request');
export const Req = createParamDecorator('Req');
export const Query = createParamDecorator('Query');
export const Headers = createParamDecorator('Headers');
export const Session = createParamDecorator('Session');
export const Ip = createParamDecorator('Ip');
export const Param = createParamDecorator('Param');
export const Body = createParamDecorator('Body');
export const Res = createParamDecorator('Res');
export const Response = createParamDecorator('Response');
export const Next = createParamDecorator('Next');
