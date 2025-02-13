import 'reflect-metadata'
import { INJECTED_TOKENS } from './constants';


export function Inject(token: string): ParameterDecorator {
  return (target: Object, propertyKey: string, parameterIndex: number) => {
    // 也就是给原型上的方法添加元数据
    // 属性名为param:handleRequest 数据类型为数组 数组里放置表示哪个位置使用哪个装饰器
    const existingInjectTokens = Reflect.getMetadata(INJECTED_TOKENS, target, propertyKey) || [];
    existingInjectTokens[parameterIndex] = token;
    Reflect.defineMetadata(INJECTED_TOKENS, existingInjectTokens, target);
  }
}
