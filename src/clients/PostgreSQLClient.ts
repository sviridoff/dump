import { knex, Knex } from 'knex';
import { Code, result } from '@daisugi/kintsugi';

interface Query {
  (knex: Knex): Promise<any>;
}

export class PostgreSQLClient {
  private knex;

  constructor(
    postgreSQLHost: string,
    postgreSQLPort: number,
    postgreSQLUser: string,
    postgreSQLPassword: string,
    postgreSQLDatabaseName: string,
  ) {
    this.knex = knex({
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

  get() {
    return this.knex;
  }

  async query(fn: Query) {
    try {
      const response = await fn(this.knex);

      return result.ok(response);
    } catch (error: any) {
      return result.fail({
        code: Code.UnexpectedError,
        message: `PostgreSQLClient.query ${error.message}`,
      });
    }
  }
}
