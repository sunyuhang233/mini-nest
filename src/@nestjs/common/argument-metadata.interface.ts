export interface ArgumentMetadata {
  // 代表参数的类型
  type: "body" | "query" | "param" | "custom"
  // 代表参数的元类型
  metatype?: any
  // 代表参数的额外数据
  data?: string
}
