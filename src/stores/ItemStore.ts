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

function toItem(dbMainItem: DBItem) {
  return {
    id: dbMainItem.id,
    slug: dbMainItem.slug,
    title: dbMainItem.title,
    isPrivate: dbMainItem.is_private,
  };
}

function toItems(dbChildItems: DBItem[]): Item[] {
  return dbChildItems.map(toItem);
}

export class ItemStore {
  constructor(private postgreSQLClient: PostgreSQLClient) {}

  async getBySlug(
    userId: string,
    itemSlug: string,
  ): Promise<ResultOK<Item> | ResultFail<ServiceError>> {
    try {
      const dbItem = await this.postgreSQLClient
        .get()
        .where({ slug: itemSlug, user_id: userId })
        .select('*')
        .from<DBItem>('item');

      if (!dbItem.length) {
        return result.fail({
          code: Code.NotFound,
          message: `ItemStore.getBySlug Item not found ${userId} ${itemSlug}.`,
        });
      }

      return result.ok(toItem(dbItem[0]));
    } catch (error: any) {
      return result.fail({
        code: Code.UnexpectedError,
        message: `ItemStore.getBySlug ${error.message}.`,
      });
    }
  }

  async getById(
    userId: string,
    itemId: string,
  ): Promise<ResultOK<Item> | ResultFail<ServiceError>> {
    try {
      const dbItem = await this.postgreSQLClient
        .get()
        .where({ id: itemId, user_id: userId })
        .select('*')
        .from<DBItem>('item');

      if (!dbItem.length) {
        return result.fail({
          code: Code.NotFound,
          message: `ItemStore.getById Item not found ${userId} ${itemId}.`,
        });
      }

      return result.ok(toItem(dbItem[0]));
    } catch (error: any) {
      return result.fail({
        code: Code.UnexpectedError,
        message: `ItemStore.getById ${error.message}.`,
      });
    }
  }

  async deleteBySlug(
    userId: string,
    itemSlug: string,
  ): Promise<ResultOK<null> | ResultFail<ServiceError>> {
    try {
      const dbItem = await this.postgreSQLClient
        .get()
        .where({ slug: itemSlug, user_id: userId })
        .del()
        .from<DBItem>('item');

      if (!dbItem) {
        return result.fail({
          code: Code.NotFound,
          message: `ItemStore.deleteBySlug Item not found ${userId} ${itemSlug}.`,
        });
      }

      return result.ok(null);
    } catch (error: any) {
      return result.fail({
        code: Code.UnexpectedError,
        message: `ItemStore.deleteBySlug ${error.message}.`,
      });
    }
  }

  async getChild(
    parentItemId: string,
  ): Promise<ResultOK<Item[]> | ResultFail<ServiceError>> {
    try {
      const dbChildItemIds = this.postgreSQLClient
        .get()
        .where({ parent_item_id: parentItemId })
        .select('child_item_id')
        .from<string>('item_item');

      const dbChildItems = await this.postgreSQLClient
        .get()
        .whereIn('id', dbChildItemIds)
        .select('*')
        .from<DBItem>('item');

      return result.ok(toItems(dbChildItems));
    } catch (error: any) {
      return result.fail({
        code: Code.UnexpectedError,
        message: `ItemStore.getChild ${error.message}.`,
      });
    }
  }

  async create(
    userId: string,
    parentItemId: string,
    childItemTitle: string,
    childItemIsPrivate: boolean,
  ) {
    try {
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

  async edit(
    itemId: string,
    newItemTitle: string,
    newItemSlug: string,
    newItemIsPrivate: boolean,
  ) {
    try {
      const response = await this.postgreSQLClient
        .get()
        .update({
          title: newItemTitle,
          slug: newItemSlug,
          is_private: newItemIsPrivate,
        })
        .where({ id: itemId })
        .into('item');

      return result.ok(response);
    } catch (error: any) {
      return result.fail({
        code: Code.UnexpectedError,
        message: `ItemStore.edit ${error.message}.`,
      });
    }
  }
}
