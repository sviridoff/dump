import { Knex as KnexType } from 'knex';

import { PostgreSQLClient } from '../clients/PostgreSQLClient.js';
import { contextualizeError } from '../libs/contextualizeError.js';
import { Result } from '../libs/Result.js';
import { notFound } from '../libs/Error.js';

interface DBUser {
  id: string;
  username: string;
  name: string;
  item_id: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  username: string;
  itemId: string;
}

function toUser(dbUser: DBUser): User {
  return {
    id: dbUser.id,
    username: dbUser.username,
    itemId: dbUser.item_id,
  };
}

export class UserStore {
  constructor(private postgreSQLClient: PostgreSQLClient) {}

  async get(username: string) {
    const resDBUsers = await this.postgreSQLClient.query<
      DBUser[]
    >((knex: KnexType) => {
      return knex
        .where({ username })
        .select('*')
        .from('user');
    });

    if (resDBUsers.isFailure) {
      return contextualizeError(
        resDBUsers,
        'UserStore.get',
      );
    }

    const dbUser = resDBUsers.getValue()[0];

    if (!dbUser) {
      return notFound(
        `UserStore.get User not found ${username}.`,
      );
    }

    const user = toUser(dbUser);

    return Result.success(user);
  }
}
