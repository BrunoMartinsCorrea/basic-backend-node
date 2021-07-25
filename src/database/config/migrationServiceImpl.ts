import MigrationService from '@entity/adapter/database/migrationService';
import { DatabaseConfig } from '@entity/config/databaseConfig';
import path from 'path';
import { createDb, migrate } from 'postgres-migrations';

export default class MigrationServiceImpl implements MigrationService {
  constructor(
    private config: DatabaseConfig,
  ) { }

  async migrate(): Promise<void> {
    await createDb(this.config.database, { ...this.config, defaultDatabase: 'postgres' });
    await migrate(this.config, path.resolve('src/database/config/migrations'));
  }
}
