import Knex, { Knex as KnexType } from 'knex';
import { Code } from '@daisugi/kintsugi';

import { Result } from '../libs/Result.js';

type Query = (knex: KnexType) => Promise<any>;

export class PostgreSQLClient {
  private knex;

  constructor(
    postgreSQLHost: string,
    postgreSQLPort: number,
    postgreSQLUser: string,
    postgreSQLPassword: string,
    postgreSQLDatabaseName: string,
  ) {
    this.knex = Knex({
      client: 'pg',
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
      return Result.failure({
        code: Code.UnexpectedError,
        message: `PostgreSQLClient.query ${error.message}`,
      });
    }
  }
}
