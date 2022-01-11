import Knex, { Knex as KnexType } from 'knex';
import { Code, result } from '@daisugi/kintsugi';

interface Query {
  (knex: KnexType): Promise<any>;
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

      return result.ok(response);
    } catch (error: any) {
      return result.fail({
        code: Code.UnexpectedError,
        message: `PostgreSQLClient.query ${error.message}`,
      });
    }
  }
}
