import "reflect-metadata"

export function UseFilters(...filters: any[]) {
  return function (target: object | Function, propertyKey?: string, descriptor?: PropertyDescriptor) {
    if (descriptor) {
      Reflect.defineMetadata('filters', filters, descriptor.value)
    } else {
      Reflect.defineMetadata('filters', filters, target)
    }
  }
}
