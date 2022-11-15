import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    // That give us the request that is coming into our application
    const request = context.switchToHttp().getRequest();
    return request.currentUser;
  },
);
