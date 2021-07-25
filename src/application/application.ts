import LoggerService from '@entity/adapter/application/loggerService';

export default class Application {
  constructor(
    private logger: LoggerService,
  ) { }

  start(): void {
    this.logger.info('Starting application!');
  }
}
