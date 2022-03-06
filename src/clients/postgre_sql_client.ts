import Knex, { Knex as KnexType } from 'knex';

import { Result } from '../libs/result.js';
import { unexpected } from '../libs/error.js';

type Query = (knex: KnexType) => Promise<any>;

export class PostgreSQLClient {
  private knex;
  private client = 'pg';

  constructor(
    postgreSQLHost: string,
    postgreSQLPort: number,
    postgreSQLUser: string,
    postgreSQLPassword: string,
    postgreSQLDatabaseName: string,
  ) {
    this.knex = Knex({
      client: this.client,
      connection: {
        host: postgreSQLHost,
        port: postgreSQLPort,
        user: postgreSQLUser,
        password: postgreSQLPassword,
        database: postgreSQLDatabaseName,
      },
    });
  }

  async query<T>(queryBuilder: Query) {
    try {
      const response: T = await queryBuilder(this.knex);
      return Result.success(response);
    } catch (error: any) {
      return unexpected(
        `PostgreSQLClient.query ${error.message}`,
      );
    }
  }
}
