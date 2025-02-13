import 'reflect-metadata'

/**
 * Injectable装饰器
 * @returns 
 */
export function Injectable(): ClassDecorator {
  return (target: Function) => {
    // 将元数据保存在类上 数据名称为injectable 数据类型为boolean
    Reflect.defineMetadata('injectable', true, target)
  }
}
