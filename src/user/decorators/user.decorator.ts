import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { ExpressRequestInterface } from "@app/types/expressRequest.interface";

export const User = createParamDecorator((prop: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<ExpressRequestInterface>();

  if (prop) {
    return request.user?.[prop];
  }

  return request.user;
});