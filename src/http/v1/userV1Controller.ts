import LoggerService from '@entity/adapter/application/loggerService';
import Controller from '@entity/adapter/http/controller';
import UserService from '@entity/adapter/service/userService';
import { User } from '@entity/user';
import { Payload } from '@http/entity/payload';
import { ResponseMetadata } from '@http/entity/responseMetadata';
import {
  Request, Response, Express, NextFunction,
} from 'express';
import { StatusCodes } from 'http-status-codes';
import { v4 as uuid } from 'uuid';

export default class UserV1Controller implements Controller {
  private version = 1;

  private path = `/v${this.version}/user`;

  constructor(
    private logger: LoggerService,
    private service: UserService,
  ) { }

  register(server: Express): void {
    server.post(`${this.path}`, this.save.bind(this));
    server.get(`${this.path}/:id`, this.findById.bind(this));
    server.delete(`${this.path}/:id`, this.delete.bind(this));
  }

  private async save(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const user = await this.service.save(request.body);

      const payload = UserV1Controller.buildPayload(user);

      response.status(StatusCodes.CREATED)
        .location(request.path.concat(`/${user.id}`))
        .send(payload);
    } catch (error) {
      next(error);
    }
  }

  private async findById(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = request.params;

      this.logger.info(`id -> ${id}`);

      const user = await this.service.findById(Number(id));
      const payload = UserV1Controller.buildPayload(user);

      response.send(payload);
    } catch (error) {
      next(error);
    }
  }

  private async delete(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(request.params.id);

      this.logger.info(`id -> ${id}`);

      await this.service.delete(id);

      response.status(StatusCodes.NO_CONTENT).end();
    } catch (error) {
      next(error);
    }
  }

  private static buildPayload(user: User): Payload<User, ResponseMetadata> {
    const payload: Payload<User, ResponseMetadata> = {
      data: user,
      metadata: {
        origin: 'backend',
        timestamp: new Date(Date.now()),
        trackingId: uuid(),
      },
    };

    return payload;
  }
}
