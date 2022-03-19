import { Knex as KnexType } from 'knex';

import { PostgreSQLClient } from '../../clients/postgre_sql_client.js';
import {
  notFound,
  contextualizeError,
} from '../../libs/error.js';
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
        resSRCUsers.getError(),
        'UserStore.get',
      );
    }
    const dbUser = resSRCUsers.getValue()[0];
    if (!dbUser) {
      return notFound(
        `UserStore.get User not found ${username}.`,
      );
    }
    return User.resFromSRC(dbUser);
  }
}
