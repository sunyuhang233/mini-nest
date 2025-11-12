import { RequestMethod } from "./request.method.enum";

export interface MiddlewareConsumer {
  apply(...middlewares: Function[]): this;
  forRoutes(...routes: (string | { path: string, method: RequestMethod })[]): void;
}
