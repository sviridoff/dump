import {
  Code,
  result,
  ResultFail,
  ResultOK,
} from '@daisugi/kintsugi';

import { PostgreSQLClient } from '../clients/PostgreSQLClient';
import { ServiceError } from '../types/ServiceError';

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
}

function toUser(dbUser: DBUser): User {
  return {
    id: dbUser.id,
    username: dbUser.username,
  };
}

export class UserStore {
  constructor(private postgreSQLClient: PostgreSQLClient) {}

  async get(
    username: string,
  ): Promise<ResultOK<User> | ResultFail<ServiceError>> {
    try {
      // Get user.
      const dbUser = await this.postgreSQLClient
        .get()
        .where({ username })
        .select('*')
        .from<DBUser>('user');

      if (!dbUser.length) {
        return result.fail({
          code: Code.NotFound,
          message: `UserStore.get User not found ${username}.`,
        });
      }

      const user = toUser(dbUser[0]);

      return result.ok(user);
    } catch (error: any) {
      return result.fail({
        code: Code.UnexpectedError,
        message: `UserStore.get ${error.message}.`,
      });
    }
  }
}
