import LoggerService from '@entity/adapter/application/loggerService';
import DatabaseClientService from '@entity/adapter/database/databaseClientService';
import TokenRepository from '@entity/adapter/database/tokenRepository';
import ServiceError from '@entity/error/serviceError';
import ServiceRule from '@entity/error/serviceRule';
import { Token } from '@entity/token';

export default class TokenRepositoryImpl implements TokenRepository {
  constructor(
    private logger: LoggerService,
    private database: DatabaseClientService,
  ) { }

  async save(token: Token): Promise<Token> {
    try {
      const query = (token.id)
        ? `UPDATE token SET access = '${token.access}', refresh = '${token.refresh}' WHERE id = ${token.id}`
        : `INSERT INTO token (user_id, access, refresh) VALUES (${token.userId}, '${token.access}', '${token.refresh}')`;

      return (await this.database.query<Token>(query.concat(' RETURNING id, user_id, access, refresh;')))[0];
    } catch (error) {
      const message = (error as Error)?.message ?? 'Something went wrong';
      this.logger.error(message);
      throw new ServiceError(ServiceRule.UNKNOWN, message);
    }
  }

  async findById(id: number): Promise<Token | undefined> {
    let result: Token[];

    try {
      result = await this.database.query<Token>(`SELECT id, user_id, access, refresh FROM token WHERE id = ${id};`);
    } catch (error) {
      const message = (error as Error)?.message ?? 'Something went wrong';
      this.logger.error(message);
      throw new ServiceError(ServiceRule.UNKNOWN, message);
    }

    return result[0];
  }

  async findByUserId(userId: number): Promise<Token | undefined> {
    let result: Token[];

    try {
      result = await this.database.query<Token>(`SELECT id, user_id, access, refresh FROM token WHERE user_id = ${userId};`);
    } catch (error) {
      const message = (error as Error)?.message ?? 'Something went wrong';
      this.logger.error(message);
      throw new ServiceError(ServiceRule.UNKNOWN, message);
    }

    return result[0];
  }

  async deleteByUserId(userId: number): Promise<void> {
    let rowsCount;

    try {
      rowsCount = await this.database.execute(`DELETE FROM "token" WHERE user_id = ${userId};`);
    } catch (error) {
      const message = (error as Error)?.message ?? 'Something went wrong';
      this.logger.error(message);
      throw new ServiceError(ServiceRule.UNKNOWN, message);
    }

    if (rowsCount < 1) {
      throw new ServiceError(ServiceRule.NOT_FOUND, 'No register found!');
    }
  }
}
