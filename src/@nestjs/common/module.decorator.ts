import "reflect-metadata"
import { CONTROLLERS } from "./constants"
interface ModuleMetadata {
  controllers?: Function[]
  providers?: any[]
  imports?: any[]
  exports?: any[]
}
export function Module(metadata: ModuleMetadata): ClassDecorator {
  return function (target: Function) {
    Reflect.defineMetadata('isModule', true, target)
    defineModule(target, metadata.controllers)
    Reflect.defineMetadata(CONTROLLERS, metadata.controllers, target)
    // let providers = metadata.providers || [].filter(Boolean).map(provider => {
    //   if (provider instanceof Function) {
    //     return provider
    //   } else if (provider.useClass instanceof Function) {
    //     return provider.useClass
    //   } else {
    //     return null
    //   }
    // }).filter(Boolean)
    defineProvidersModule(target, metadata.providers);
    defineModule(target, (metadata.providers || []).map((item) => item instanceof Function ? item : item.useClass).filter(Boolean))
    Reflect.defineMetadata('providers', metadata.providers, target)
    Reflect.defineMetadata('imports', metadata.imports, target)
    Reflect.defineMetadata('exports', metadata.exports, target)
  }
}

/**
 * 私有化模块
 * @param nestModule 模块实例
 * @param targets 模块的控制器或提供者
 */
export function defineModule(nestModule, targets = []) {
  // 给每个target 定义 nestModule 元数据
  targets.forEach(target => {
    Reflect.defineMetadata('nestModule', nestModule, target)
  })
}


export function Global(): ClassDecorator {
  return function (target: Function) {
    Reflect.defineMetadata('global', true, target)
  }
}

/**
 * 动态模块
 */
export interface DynamicModule extends ModuleMetadata {
  module: Function
}


export function defineProvidersModule(nestModule, providers = []) {
  defineModule(nestModule,
    (providers ?? []).map(provider => provider instanceof Function ? provider : provider.useClass)
      .filter(Boolean));
}
