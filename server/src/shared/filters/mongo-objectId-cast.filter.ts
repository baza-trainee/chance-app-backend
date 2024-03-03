import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { Response } from 'express';
import { Error } from 'mongoose';

interface IJsonResp {
  statusCode: number;
  message: any;
  error: any;
}

@Catch(Error.CastError)
export class MongoCastErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger();
  catch(exception: Error.CastError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const json: IJsonResp = {
      statusCode: 404,
      message: [`${exception.value} is wrong format id`],
      error: 'Bad Request',
    };
    this.logger.log(`${exception.value} is wrong format id`);
    response.status(404).json(json);
  }
}
