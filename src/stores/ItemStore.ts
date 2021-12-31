import {
  Code,
  result,
  ResultFail,
  ResultOK,
} from '@daisugi/kintsugi';
import { randomUUID } from 'node:crypto';

import { PostgreSQLClient } from '../clients/PostgreSQLClient.js';
import { ServiceError } from '../types/ServiceError.js';
import { toSlug } from '../libs/toSlug.js';

export interface Item {
  id: string;
  slug: string;
  title: string;
  isPrivate: boolean;
  items: {
    id: string;
    slug: string;
    title: string;
    isPrivate: boolean;
  }[];
}

interface DBItem {
  id: string;
  title: string;
  slug: string;
  user_id: string;
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
    title: dbMainItem.title,
    isPrivate: dbMainItem.is_private,
    items: dbChildItems.map((dbChildItem) => ({
      id: dbChildItem.id,
      slug: dbChildItem.slug,
      title: dbChildItem.title,
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

  async create(
    userId: string,
    itemSlug: string,
    childItemTitle: string,
    childItemIsPrivate: boolean,
  ) {
    try {
      const dbParentItem = await this.postgreSQLClient
        .get()
        .where({ slug: itemSlug, user_id: userId })
        .select('*')
        .from<DBItem>('item');

      if (!dbParentItem.length) {
        return result.fail({
          code: Code.NotFound,
          message: `ItemStore.create Parent item not found ${userId} ${itemSlug}.`,
        });
      }

      const parentItemId = dbParentItem[0].id;
      const childItemId = randomUUID();

      const response = await this.postgreSQLClient
        .get()
        .transaction(async (transaction) => {
          await transaction
            .insert({
              id: childItemId,
              title: childItemTitle,
              slug: toSlug(childItemTitle),
              user_id: userId,
              is_private: childItemIsPrivate,
            })
            .into('item');

          await transaction
            .insert({
              parent_item_id: parentItemId,
              child_item_id: childItemId,
            })
            .into('item_item');
        });

      return result.ok(response);
    } catch (error: any) {
      return result.fail({
        code: Code.UnexpectedError,
        message: `ItemStore.create ${error.message}.`,
      });
    }
  }
}
