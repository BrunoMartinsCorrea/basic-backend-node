import express, {
  json, Express, Request, Response, NextFunction,
} from 'express';
import cors from 'cors';
import HttpServerService from '@entity/adapter/http/httpClientService';
import LoggerService from '@entity/adapter/application/loggerService';
import Controller from '@entity/adapter/http/controller';
import ServiceError from '@entity/error/serviceError';
import ServiceRule from '@entity/error/serviceRule';
import { StatusCodes } from 'http-status-codes';
import { v4 as uuid } from 'uuid';
import { ResponseMetadata } from '@http/entity/responseMetadata';
import { Payload } from '@http/entity/payload';

export default class HttpServerServiceImpl implements HttpServerService {
  private server: Express;

  constructor(
    private logger: LoggerService,
    private controllers: Controller[],
  ) {
    this.server = HttpServerServiceImpl.configureServer();
  }

  start(): void {
    this.controllers.forEach((controller) => { controller.register(this.server); });

    // this.server.use((request: Request, response: Response, next: NextFunction) => {
    //   try {
    //     const token = request.headers.authorization.split(' ')[1];
    //     const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    //     const userId = decodedToken.userId;
    //     if (request.body.userId && request.body.userId !== userId) {
    //       throw 'Invalid user ID';
    //     } else {
    //       next();
    //     }
    //   } catch {
    //     response.status(401).json({
    //       error: new Error('Invalid request!');
    //     });
    //   }
    // });

    this.server.use(async (error: ServiceError, _request: Request, response: Response,
      _next: NextFunction) => {
      this.logger.error(error.message);

      let statusCode: number;

      switch (error.rule) {
        case ServiceRule.NOT_FOUND:
          statusCode = StatusCodes.NOT_FOUND;
          break;
        case ServiceRule.UNAUTHORIZED:
          statusCode = StatusCodes.UNAUTHORIZED;
          break;
        default:
          statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
          break;
      }

      type ResponseError = { message: string };

      const payload: Payload<ResponseError, ResponseMetadata> = {
        data: {
          message: error.message,
        },
        metadata: {
          origin: 'backend',
          timestamp: new Date(Date.now()),
          trackingId: uuid(),
        },
      };

      response.status(statusCode).send(payload);
    });

    this.server.listen(4000, () => this.logger.info('Running server on http://localhost:4000'));
  }

  private static configureServer(): Express {
    return express()
      .use(json())
      .use(cors());
  }
}
