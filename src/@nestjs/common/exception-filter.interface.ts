import { ArgumentsHost } from "./argument-host.interface";

export interface ExceptionFilter<T = any> {
  catch(exception: T, host: ArgumentsHost): void;
}
