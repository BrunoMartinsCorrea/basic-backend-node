import Controller from '@entity/adapter/http/controller';
import { v4 as uuid } from 'uuid';
import { Request, Response, Express } from 'express';
import { Payload } from './entity/payload';
import { ResponseMetadata } from './entity/responseMetadata';

export default class HealthController implements Controller {
  private PATH = '/health';

  register(server: Express): void {
    server.get(`${this.PATH}`, HealthController.health);
  }

  private static async health(request: Request, response: Response): Promise<void> {
    type Health = { status: boolean };

    const payload: Payload<Health, ResponseMetadata> = {
      data: {
        status: true,
      },
      metadata: {
        timestamp: new Date(Date.now()),
        origin: 'backend',
        trackingId: uuid(),
      },
    };

    response.send(payload);
  }
}
