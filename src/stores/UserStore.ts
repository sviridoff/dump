import {
  Code,
  result,
  ResultFail,
  ResultOK,
} from '@daisugi/kintsugi';

import { PostgreSQLClient } from '../clients/PostgreSQLClient';
import { ServiceError } from '../types/ServiceError';
import { mutErrorPrefixMessage } from '../libs/mutErrorPrefixMessage';

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

  async get(
    username: string,
  ): Promise<ResultOK<User> | ResultFail<ServiceError>> {
    const resDBUser = await this.postgreSQLClient.query(
      (knex) => {
        return knex
          .where({ username })
          .select('*')
          .from<DBUser>('user');
      },
    );

    if (resDBUser.isFailure) {
      return mutErrorPrefixMessage(
        resDBUser,
        'UserStore.get',
      );
    }

    const dbUser = resDBUser.value;

    if (!dbUser.length) {
      return result.fail({
        code: Code.NotFound,
        message: `UserStore.get User not found ${username}.`,
      });
    }

    const user = toUser(dbUser[0]);

    return result.ok(user);
  }
}
