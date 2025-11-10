import { PREFIX } from "./constants"

interface ControllerOptions {
  prefix?: string
}
export function Controller(): ClassDecorator
export function Controller(prefix: string): ClassDecorator
export function Controller(options: ControllerOptions): ClassDecorator
export function Controller(prefixOrOptions?: string | ControllerOptions): ClassDecorator {
  let options: string | ControllerOptions = {}
  if (typeof prefixOrOptions === 'string') {
    options.prefix = prefixOrOptions
  } else if (typeof prefixOrOptions === 'object') {
    options = prefixOrOptions
  }
  return function (target: Function) {
    Reflect.defineMetadata(PREFIX, options.prefix || '', target)
  }
}
