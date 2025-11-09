import "reflect-metadata"
interface ModuleMetadata {
  controllers: Function[]
  providers: any
}
export function Module(metadata: ModuleMetadata): ClassDecorator {
  return function (target: Function) {
    Reflect.defineMetadata('controllers', metadata.controllers, target)
    Reflect.defineMetadata('providers', metadata.providers, target)
  }
}
