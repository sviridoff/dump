import {
  Code,
  result,
  ResultFail,
  ResultOK,
} from '@daisugi/kintsugi';

import { PostgreSQLClient } from '../clients/PostgreSQLClient';
import { ServiceError } from '../types/ServiceError';

export interface Item {
  id: string;
  name: string;
  items: {
    id: string;
    name: string;
  }[];
}

interface DBItem {
  id: string;
  name: string;
  slug: string;
  user_id: string;
  item_ids: string[];
  is_private: boolean;
  created_at: string;
  updated_at: string;
}

interface DBUser {
  id: string;
  name: string;
  item_id: string;
  created_at: string;
  updated_at: string;
}

function toItem(
  dbMainItem: DBItem,
  dbChildItems: DBItem[],
): Item {
  return {
    id: dbMainItem.id,
    name: dbMainItem.name,
    items: dbChildItems.map((dbChildItem) => ({
      id: dbChildItem.id,
      name: dbChildItem.name,
    })),
  };
}

export class ItemStore {
  constructor(private postgreSQLClient: PostgreSQLClient) {}

  async getItem(
    // @ts-ignore
    username: string,
    // @ts-ignore
    itemSlug: string,
  ): Promise<ResultOK<Item> | ResultFail<ServiceError>> {
    try {
      // Get user.
      const dbUser: DBUser[] = await this.postgreSQLClient
        .get()
        .where({ name: username })
        .select('id')
        .from('user');

      if (!dbUser.length) {
        return result.fail({
          code: Code.NotFound,
          message: `ItemStore.getItem User not found ${username}.`,
        });
      }

      const userId = dbUser[0].id;

      // Get main item.
      const dbMainItem: DBItem[] =
        await this.postgreSQLClient
          .get()
          .where({ slug: itemSlug, user_id: userId })
          .select('*')
          .from('item');

      if (!dbMainItem.length) {
        return result.fail({
          code: Code.NotFound,
          message: `ItemStore.getItem Main item not found ${userId} ${itemSlug}.`,
        });
      }

      const childItemIds = dbMainItem[0].item_ids;

      const dbChildItems: DBItem[] =
        await this.postgreSQLClient
          .get()
          .whereIn('id', childItemIds)
          .select('*')
          .from('item');

      const item = toItem(dbMainItem[0], dbChildItems);

      return result.ok(item);
    } catch (error: any) {
      return result.fail({
        code: Code.UnexpectedError,
        message: `ItemStore.getItem ${error.message}.`,
      });
    }
  }
}
