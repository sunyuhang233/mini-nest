import 'reflect-metadata'
interface ModuleMetadata {
  controllers: Function[]
}
export function Module(metadata: ModuleMetadata): ClassDecorator {
  return (target: Function) => {
    // 将元数据保存在类上 数据名称为controllers 数据类型为数组
    Reflect.defineMetadata('controllers', metadata.controllers, target)
  }
}
