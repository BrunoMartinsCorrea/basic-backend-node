import {
  Request, Response, Express, NextFunction,
} from 'express';
import Controller from '@entity/adapter/http/controller';
import LoggerService from '@entity/adapter/application/loggerService';
import { Payload } from '@http/entity/payload';
import { ResponseMetadata } from '@http/entity/responseMetadata';
import { v4 as uuid } from 'uuid';
import AuthenticationService from '@entity/adapter/service/authenticationService';
import { StatusCodes } from 'http-status-codes';

type TokenResponse = {
  access: string,
  refresh: string,
};

export default class AuthenticationV1Controller implements Controller {
  private version = 1;

  private path = `/v${this.version}/auth`;

  constructor(
    private logger: LoggerService,
    private service: AuthenticationService,
  ) { }

  register(server: Express): void {
    server.post(`${this.path}/sign-in`, this.signIn.bind(this));
    server.post(`${this.path}/refresh`, this.refresh.bind(this));
    server.post(`${this.path}/sign-out`, this.signOut.bind(this));
  }

  private async signIn(request: Request, response: Response,
    next: NextFunction): Promise<void> {
    try {
      const { email, password } = request.body;
      const { access, refresh } = await this.service.signIn(email, password);

      const payload: Payload<TokenResponse, ResponseMetadata> = {
        data: {
          access,
          refresh,
        },
        metadata: {
          origin: 'backend',
          timestamp: new Date(Date.now()),
          trackingId: uuid(),
        },
      };

      response.send(payload);
    } catch (error) {
      next(error);
    }
  }

  private async refresh(request: Request, response: Response,
    next: NextFunction): Promise<void> {
    try {
      const oldToken = request.headers.authorization!.replace('Bearer ', '');
      const { access, refresh } = await this.service.refresh(oldToken);

      const payload: Payload<TokenResponse, ResponseMetadata> = {
        data: {
          access,
          refresh,
        },
        metadata: {
          origin: 'backend',
          timestamp: new Date(Date.now()),
          trackingId: uuid(),
        },
      };

      response.send(payload);
    } catch (error) {
      next(error);
    }
  }

  private async signOut(request: Request, response: Response,
    next: NextFunction): Promise<void> {
    try {
      const oldToken = request.headers.authorization!.replace('Bearer ', '');
      await this.service.signOut(oldToken);

      response.sendStatus(StatusCodes.NO_CONTENT);
    } catch (error) {
      next(error);
    }
  }
}
