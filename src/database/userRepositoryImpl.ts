import LoggerService from '@entity/adapter/application/loggerService';
import DatabaseClientService from '@entity/adapter/database/databaseClientService';
import UserRepository from '@entity/adapter/database/userRepository';
import ServiceError from '@entity/error/serviceError';
import ServiceRule from '@entity/error/serviceRule';
import { User } from '@entity/user';

export default class UserRepositoryImpl implements UserRepository {
  constructor(
    private logger: LoggerService,
    private database: DatabaseClientService,
  ) { }

  async save(user: User): Promise<User> {
    try {
      const query = (user.id)
        ? `UPDATE "user" SET name = ${user.name} WHERE id = ${user.id}`
        : `INSERT INTO "user" (name, email, password) VALUES ('${user.name}', '${user.email}', '${user.password}')`;

      return (await this.database.query<User>(query.concat(' RETURNING id, name, email;')))[0];
    } catch (error) {
      const message = (error as Error)?.message ?? 'Something went wrong';
      this.logger.error(message);
      throw new ServiceError(ServiceRule.UNKNOWN, message);
    }
  }

  async findById(id: number): Promise<User> {
    let result: User[];

    try {
      result = await this.database.query<User>(`SELECT id, name, email FROM "user" WHERE id = ${id};`);
    } catch (error) {
      const message = (error as Error)?.message ?? 'Something went wrong';
      this.logger.error(message);
      throw new ServiceError(ServiceRule.UNKNOWN, message);
    }

    if (result.length !== 1) {
      throw new ServiceError(ServiceRule.NOT_FOUND, `Could not find user with id ${id}!`);
    }

    return result[0];
  }

  async findByEmailAndPassword(email: string, password: string): Promise<User> {
    let result: User[];

    try {
      result = await this.database.query<User>(`SELECT id, name, email FROM "user" WHERE email = '${email}' AND password = '${password}';`);
    } catch (error) {
      const message = (error as Error)?.message ?? 'Something went wrong';
      this.logger.error(message);
      throw new ServiceError(ServiceRule.UNKNOWN, message);
    }

    if (result.length !== 1) {
      throw new ServiceError(ServiceRule.NOT_FOUND, 'Could not find user!');
    }

    return result[0];
  }

  async delete(id: number): Promise<void> {
    let rowsCount;

    try {
      rowsCount = await this.database.execute(`DELETE FROM "user" WHERE id = ${id};`);
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
