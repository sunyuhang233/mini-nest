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
    Reflect.defineMetadata(CONTROLLERS, metadata.controllers, target)
    Reflect.defineMetadata('providers', metadata.providers, target)
    Reflect.defineMetadata('imports', metadata.imports, target)
    Reflect.defineMetadata('exports', metadata.exports, target)
  }
}
