import LoggerService from '@entity/adapter/application/loggerService';
import DatabaseClientService from '@entity/adapter/database/databaseClientService';
import { DatabaseConfig } from '@entity/config/databaseConfig';
import { Client } from 'pg';

export default class DatabaseClientServiceImpl implements DatabaseClientService {
  private client: Client;

  constructor(
    private logger: LoggerService,
    private config: DatabaseConfig,
  ) {
    this.client = new Client({ ...this.config });
    this.client.connect();
  }

  async query<T>(command: string): Promise<T[]> {
    try {
      const result = new Array<T>();

      const queryResult = await this.client.query<T>(command);
      result.push(...queryResult.rows);

      return result;
    } catch (error) {
      const message = (error as Error)?.message ?? 'Something went wrong!';
      this.logger.error(message);
      throw new Error(message);
    }
  }

  async execute(command: string): Promise<number> {
    try {
      return (await this.client.query(command)).rowCount;
    } catch (error) {
      const message = (error as Error)?.message ?? 'Something went wrong!';
      this.logger.error(message);
      throw new Error(message);
    }
  }
}
