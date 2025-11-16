import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Roles2 } from './role2.decorator';
@Injectable()
export class Auth2Guard implements CanActivate {
  constructor(private reflector: Reflector) { }
  canActivate(context: ExecutionContext): boolean {
    // const roles = this.reflector.get<string[]>('roles', context.getHandler());
    // if (!roles) {
    //   return true;
    // }
    // const request = context.switchToHttp().getRequest<Request>();
    // const user = { role: request.query.role as string };
    // return matchRoles(roles, user.role || '');
    const roles = this.reflector.get<string[]>(Roles2, context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest<Request>();
    const user = { role: request.query.role as string };
    return matchRoles(roles, user.role || '');
  }
}
function matchRoles(roles: string[], userRole: string): boolean {
  return roles.includes(userRole);
}
