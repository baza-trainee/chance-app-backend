import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const WsJwtGuardData = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    return ctx.switchToWs().getData();
  },
);
