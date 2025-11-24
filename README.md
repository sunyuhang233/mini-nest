# Mini-Nest

一个轻量级的NestJS框架实现，展示了NestJS核心概念的自定义实现。

## 项目概述

Mini-Nest是一个简化的NestJS框架实现，包含了NestJS的核心功能，如依赖注入、模块系统、控制器、服务、管道、拦截器和异常过滤器等。该项目旨在帮助理解NestJS的内部工作原理。

## 技术栈

- TypeScript
- Express.js
- RxJS
- reflect-metadata
- class-validator
- class-transformer

## 项目结构

```
mini-nest/
├── src/
│   ├── @nestjs/              # 自定义NestJS核心实现
│   │   ├── common/           # 通用装饰器和接口
│   │   │   ├── pipes/        # 内置管道实现
│   │   ├── core/             # 核心应用逻辑
│   │   └── platform-express/ # Express平台特定实现
│   ├── pipes/                # 自定义管道
│   │   └── file-size-validation.pipe.ts
│   ├── app.controller.ts     # 示例控制器
│   ├── app.module.ts         # 应用模块
│   ├── app.service.ts        # 示例服务
│   └── main.ts               # 应用入口点
├── package.json
├── tsconfig.json
└── nodemon.json
```

## 核心功能

### 1. 模块系统

项目实现了基于装饰器的模块系统：

```typescript
@Module({
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
```

### 2. 控制器

支持RESTful API路由定义：

```typescript
@Controller("app")
export class AppController {
  @Get()
  getHello(): string {
    return 'hello world';
  }
}
```

### 3. 依赖注入

实现了完整的依赖注入容器，支持构造函数注入：

```typescript
export class AppController {
  constructor(private appService: AppService) {}
}
```

### 4. 管道 (Pipes)

内置多种管道类型，包括：
- 验证管道 (ValidationPipe)
- 转换管道 (ParseIntPipe, ParseBoolPipe, ParseFloatPipe等)
- 自定义管道 (如FileSizeValidationPipe)

#### 自定义管道示例

```typescript
@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const maxSize = 1 * 1024 * 1024; // 1MB
    if (value.size > maxSize) {
      throw new BadRequestException('File size is too large');
    }
    return value;
  }
}
```

### 5. 拦截器 (Interceptors)

实现了请求/响应拦截器，可用于：
- 日志记录
- 数据转换
- 缓存
- 异常处理

### 6. 异常过滤器 (Exception Filters)

提供全局和局部异常过滤功能，可以自定义异常响应格式：

```typescript
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    // 自定义异常处理逻辑
  }
}
```

### 7. 中间件支持

支持Express中间件的集成：

```typescript
configure(consumer: MiddlewareConsumer) {
  consumer
    .apply(LoggerMiddleware)
    .forRoutes('cats');
}
```

## 安装与运行

### 安装依赖

```bash
pnpm install
```

### 开发模式运行

```bash
pnpm run start:dev
```

### 生产模式运行

```bash
pnpm run start
```

## API示例

### GET请求

```http
GET /app
```

响应：
```json
"hello world"
```

## 自定义实现亮点

1. **依赖注入系统**：完整的DI容器实现，支持循环依赖检测
2. **装饰器系统**：基于reflect-metadata的装饰器实现
3. **模块解析**：动态加载和解析模块依赖
4. **路由系统**：基于Express的自定义路由解析
5. **异常处理**：全局和局部异常过滤器支持
6. **生命周期管理**：完整的请求生命周期处理

## 开发指南

### 添加新控制器

1. 创建控制器类并使用`@Controller`装饰器
2. 使用HTTP方法装饰器(`@Get`, `@Post`等)定义路由
3. 在模块中注册控制器

### 创建自定义管道

1. 实现`PipeTransform`接口
2. 使用`@Injectable`装饰器标记为可注入
3. 在参数或全局注册管道

### 实现异常过滤器

1. 实现`ExceptionFilter`接口
2. 使用`@Catch`装饰器指定捕获的异常类型
3. 在控制器、方法或全局注册过滤器

## 贡献指南

1. Fork项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建Pull Request

## 许可证

ISC
