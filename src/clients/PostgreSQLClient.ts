import Knex from 'knex';

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

  public get() {
    return this.knex;
  }
}
