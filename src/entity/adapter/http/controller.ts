import { Express } from 'express';

export default interface Controller {
  register(server: Express): void
}
