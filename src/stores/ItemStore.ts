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
  slug: string;
  name: string;
  isPrivate: boolean;
  items: {
    id: string;
    slug: string;
    name: string;
    isPrivate: boolean;
  }[];
}

interface DBItem {
  id: string;
  name: string;
  slug: string;
  user_id: string;
  item_ids: string[] | null;
  is_private: boolean;
  created_at: string;
  updated_at: string;
}

function toItem(
  dbMainItem: DBItem,
  dbChildItems: DBItem[],
): Item {
  return {
    id: dbMainItem.id,
    slug: dbMainItem.slug,
    name: dbMainItem.name,
    isPrivate: dbMainItem.is_private,
    items: dbChildItems.map((dbChildItem) => ({
      id: dbChildItem.id,
      slug: dbChildItem.slug,
      name: dbChildItem.name,
      isPrivate: dbChildItem.is_private,
    })),
  };
}

export class ItemStore {
  constructor(private postgreSQLClient: PostgreSQLClient) {}

  async get(
    userId: string,
    itemSlug: string,
  ): Promise<ResultOK<Item> | ResultFail<ServiceError>> {
    try {
      // Get main item.
      const dbMainItem = await this.postgreSQLClient
        .get()
        .where({ slug: itemSlug, user_id: userId })
        .select('*')
        .from<DBItem>('item');

      if (!dbMainItem.length) {
        return result.fail({
          code: Code.NotFound,
          message: `ItemStore.get Main item not found ${userId} ${itemSlug}.`,
        });
      }

      const dbChildItemIds = this.postgreSQLClient
        .get()
        .where({ parent_item_id: dbMainItem[0].id })
        .select('child_item_id')
        .from<string>('item_item');

      const dbChildItems = await this.postgreSQLClient
        .get()
        .whereIn('id', dbChildItemIds)
        .select('*')
        .from<DBItem>('item');

      const item = toItem(dbMainItem[0], dbChildItems);

      return result.ok(item);
    } catch (error: any) {
      return result.fail({
        code: Code.UnexpectedError,
        message: `ItemStore.get ${error.message}.`,
      });
    }
  }
}
