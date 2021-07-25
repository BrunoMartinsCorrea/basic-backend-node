import LoggerServiceImpl from '@application/config/loggerServiceImpl';
import DatabaseClientServiceImpl from '@database/config/databaseClientServiceImpl';
import MigrationServiceImpl from '@database/config/migrationServiceImpl';
import TokenRepositoryImpl from '@database/tokenRepositoryImpl';
import UserRepositoryImpl from '@database/userRepositoryImpl';
import { DatabaseConfig } from '@entity/config/databaseConfig';
import HttpServerServiceImpl from '@http/config/httpClientImpl';
import HealthController from '@http/healthController';
import AuthenticationV1Controller from '@http/v1/authenticationV1Controller';
import UserV1Controller from '@http/v1/userV1Controller';
import AuthenticationServiceImpl from '@service/authenticationServiceImpl';
import TokenServiceImpl from '@service/tokenServiceImpl';
import UserServiceImpl from '@service/userServiceImpl';

async function init() {
  const databaseConfig: DatabaseConfig = {
    host: 'localhost',
    port: 5432,
    database: 'node-back',
    user: 'postgres',
    password: 'postgres',
  };

  const logger = new LoggerServiceImpl();
  await new MigrationServiceImpl(databaseConfig).migrate();
  const database = new DatabaseClientServiceImpl(logger, databaseConfig);
  const userRepository = new UserRepositoryImpl(logger, database);
  const tokenRepository = new TokenRepositoryImpl(logger, database);
  const tokenService = new TokenServiceImpl();
  const userService = new UserServiceImpl(userRepository);
  const authenticationService = new AuthenticationServiceImpl(userService, tokenService,
    tokenRepository);
  const healthController = new HealthController();
  const userV1Controller = new UserV1Controller(logger, userService);
  const authenticationV1Controller = new AuthenticationV1Controller(logger, authenticationService);
  const controllers = [healthController, userV1Controller, authenticationV1Controller];
  const server = new HttpServerServiceImpl(logger, controllers);

  server.start();
}

init();
