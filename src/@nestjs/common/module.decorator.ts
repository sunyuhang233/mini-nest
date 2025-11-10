import "reflect-metadata"
import { CONTROLLERS } from "./constants"
interface ModuleMetadata {
  controllers: Function[]
  providers: any
}
export function Module(metadata: ModuleMetadata): ClassDecorator {
  return function (target: Function) {
    Reflect.defineMetadata(CONTROLLERS, metadata.controllers, target)
    Reflect.defineMetadata('providers', metadata.providers, target)
  }
}
