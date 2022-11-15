import { CanActivate, ExecutionContext } from '@nestjs/common';

export class AdminGuard {
  CanActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (!request.CurrentUser) return false;
    return request.CurrentUser.admin;
  }
}
