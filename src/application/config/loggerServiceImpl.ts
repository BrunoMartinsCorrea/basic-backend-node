import LoggerService from '@entity/adapter/application/loggerService';
import {
  createLogger, transports, format, Logger,
} from 'winston';

export default class LoggerServiceImpl implements LoggerService {
  private logger: Logger;

  constructor() {
    this.logger = createLogger({
      transports: new transports.Console(),
      format: format.combine(
        format.timestamp(),
        format.json(),
        format.colorize(),
      ),
    });
  }

  info(message: string): void {
    this.logger.info(message);
  }

  error(message: string): void {
    this.logger.error(message);
  }
}
