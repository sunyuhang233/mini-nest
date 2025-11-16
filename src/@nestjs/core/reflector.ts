import 'reflect-metadata';

export class Reflector {
  /**
   * 获取目标对象上的元数据值。
   * @param metadataKey 元数据键
   * @param target 目标对象
   * @param key 可选的键，用于获取对象上的特定属性的元数据
   * @returns 元数据值
   */
  get<T extends any>(metadataKey: string, target: object, key?: string): T {
    return key ? Reflect.getMetadata(metadataKey, target, key) : Reflect.getMetadata(metadataKey, target);
  }
}
