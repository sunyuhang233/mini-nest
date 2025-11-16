import { SetMetadata } from '@nestjs/common';
import 'reflect-metadata';

export class Reflector {
  /**
   * 获取目标对象上的元数据值。
   * @param metadataKey 元数据键
   * @param target 目标对象
   * @param key 可选的键，用于获取对象上的特定属性的元数据
   * @returns 元数据值
   */
  get<T extends any>(metadataKey: any, target: object, key?: string): T {
    return key ? Reflect.getMetadata(metadataKey, target, key) : Reflect.getMetadata(metadataKey, target);
  }
  static createDecorator<T = any>() {
    function decoratorFn(metadataValue: T) {
      // return (target: object, key?: string | symbol, descriptor?: TypedPropertyDescriptor<any>) => {
      //   return SetMetadata(decoratorFn, metadataValue)(target, key, descriptor);
      // };
      return SetMetadata(decoratorFn, metadataValue);
    }
    return decoratorFn;
  }
}
