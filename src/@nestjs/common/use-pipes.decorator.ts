import 'reflect-metadata'
import { PipeTransform } from "./pipes";

export function UsePipes(...pipes: PipeTransform[]) {
  return (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => {
    if (descriptor) {
      Reflect.defineMetadata("pipes", pipes, descriptor.value)
    } else {
      Reflect.defineMetadata("pipes", pipes, target)
    }
  }
}
