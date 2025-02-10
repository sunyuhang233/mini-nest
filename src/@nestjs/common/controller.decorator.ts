import 'reflect-metadata'

/**
 *  controller前缀可以为空 可以为字符串 可以为一个对象 prefix: 'api'
 * @returns 
 */
export function Controller(): ClassDecorator
export function Controller(prefix: string): ClassDecorator
export function Controller(options: { prefix: string }): ClassDecorator
export function Controller(prefixOptions?: string | { prefix: string }): ClassDecorator {
  let options: { prefix: string } = {
    prefix: ''
  }
  if (typeof prefixOptions === 'string') {
    options = {
      prefix: prefixOptions
    }
  } else if (typeof prefixOptions === 'object') {
    options = prefixOptions
  }
  return (target: Function) => {
    // 将元数据保存在类上 数据名称为prefix 数据类型为字符串
    Reflect.defineMetadata('prefix', options.prefix, target)
  }
}
