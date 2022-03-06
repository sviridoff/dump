import { Knex as KnexType } from 'knex';

import { PostgreSQLClient } from '../../clients/postgre_sql_client.js';
import { contextualizeError } from '../../libs/contextualize_error.js';
import { Result } from '../../libs/result.js';
import { notFound } from '../../libs/error.js';
import { User, SRCUser } from './user.js';

export class UserStore {
  constructor(private postgreSQLClient: PostgreSQLClient) {}

  async get(username: string) {
    const resSRCUsers = await this.postgreSQLClient.query<
      SRCUser[]
    >((knex: KnexType) => {
      return knex
        .where({ username })
        .select('*')
        .from('user');
    });
    if (resSRCUsers.isFailure) {
      return contextualizeError(
        resSRCUsers,
        'UserStore.get',
      );
    }
    const dbUser = resSRCUsers.getValue()[0];
    if (!dbUser) {
      return notFound(
        `UserStore.get User not found ${username}.`,
      );
    }
    return Result.success(User.fromSRC(dbUser));
  }
}
