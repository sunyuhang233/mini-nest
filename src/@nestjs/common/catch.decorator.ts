import "reflect-metadata"

export function Catch(...exceptions: Function[]): ClassDecorator {
  return function (target: Function) {
    Reflect.defineMetadata('catch', exceptions, target)
  }
}
