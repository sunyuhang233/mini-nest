import 'reflect-metadata'
import { INJECTED_TOKENS } from './constants'

export function Inject(token: string): ParameterDecorator {
  /**
   * target: 类本身
   * propertyKey: 方法名
   * parameterIndex: 参数索引
   */
  return function (target: Object, propertyKey: string | symbol, parameterIndex: number) {
    const existingInjectTokens = Reflect.getMetadata(INJECTED_TOKENS, target) || []
    existingInjectTokens[parameterIndex] = token
    Reflect.defineMetadata(INJECTED_TOKENS, existingInjectTokens, target)
  }
}
