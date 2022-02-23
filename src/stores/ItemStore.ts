import { randomUUID } from 'node:crypto';
import { Knex as KnexType } from 'knex';

import { PostgreSQLClient } from '../clients/PostgreSQLClient.js';
import { toSlug } from '../libs/toSlug.js';
import { contextualizeError } from '../libs/contextualizeError.js';
import { Result } from '../libs/Result.js';
import { notFound } from '../libs/Error.js';

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

  async getBySlug(userId: string, itemSlug: string) {
    const resDBItems = await this.postgreSQLClient.query<
      DBItem[]
    >((knex: KnexType) => {
      return knex
        .where({ slug: itemSlug, user_id: userId })
        .select('*')
        .from('item');
    });

    if (resDBItems.isFailure) {
      return contextualizeError(
        resDBItems,
        'ItemStore.getBySlug',
      );
    }

    const dbItem = resDBItems.getValue()[0];

    if (!dbItem) {
      return notFound(
        `ItemStore.getBySlug Item not found ${userId} ${itemSlug}.`,
      );
    }

    return Result.success(toItem(dbItem));
  }

  async getById(userId: string, itemId: string) {
    const resDBItems = await this.postgreSQLClient.query<
      DBItem[]
    >((knex: KnexType) => {
      return knex
        .where({ id: itemId, user_id: userId })
        .select('*')
        .from('item');
    });

    if (resDBItems.isFailure) {
      return contextualizeError(
        resDBItems,
        'ItemStore.getById',
      );
    }

    const dbItem = resDBItems.getValue()[0];

    if (!dbItem) {
      return notFound(
        `ItemStore.getById Item not found ${userId} ${itemId}.`,
      );
    }

    return Result.success(toItem(dbItem));
  }

  async deleteBySlug(userId: string, itemSlug: string) {
    const resDB = await this.postgreSQLClient.query<number>(
      (knex: KnexType) => {
        return knex
          .where({ slug: itemSlug, user_id: userId })
          .del()
          .from('item');
      },
    );

    if (resDB.isFailure) {
      return contextualizeError(
        resDB,
        'ItemStore.deleteBySlug',
      );
    }

    if (!resDB.getValue()) {
      return notFound(
        `ItemStore.deleteBySlug Item not found ${userId} ${itemSlug}.`,
      );
    }

    return Result.success(null);
  }

  async getChild(parentItemId: string) {
    const resDBChildItems =
      await this.postgreSQLClient.query<DBItem[]>(
        (knex: KnexType) => {
          const dbChildItemIds = knex
            .where({ parent_item_id: parentItemId })
            .select('child_item_id')
            .from<string>('item_item');

          return knex
            .whereIn('id', dbChildItemIds)
            .select('*')
            .from('item');
        },
      );

    if (resDBChildItems.isFailure) {
      return contextualizeError(
        resDBChildItems,
        'ItemStore.getChild',
      );
    }

    const dbChildItems = resDBChildItems.getValue();

    return Result.success(toItems(dbChildItems));
  }

  async create(
    userId: string,
    parentItemId: string,
    childItemTitle: string,
    childItemIsPrivate: boolean,
  ) {
    const childItemId = randomUUID();

    const resResponse = await this.postgreSQLClient.query(
      (knex: KnexType) => {
        return knex.transaction(
          async (transaction: KnexType.Transaction) => {
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
          },
        );
      },
    );

    if (resResponse.isFailure) {
      return contextualizeError(
        resResponse,
        'ItemStore.create',
      );
    }

    return Result.success(resResponse.getValue());
  }

  async edit(
    itemId: string,
    newItemTitle: string,
    newItemSlug: string,
    newItemIsPrivate: boolean,
  ) {
    const resResponse = await this.postgreSQLClient.query(
      (knex: KnexType) => {
        return knex
          .update({
            title: newItemTitle,
            slug: newItemSlug,
            is_private: newItemIsPrivate,
          })
          .where({ id: itemId })
          .into('item');
      },
    );

    if (resResponse.isFailure) {
      return contextualizeError(
        resResponse,
        'ItemStore.edit',
      );
    }

    return Result.success(resResponse.getValue());
  }

  /*
  async move(itemSlug: string, toItemSlug: string) {
    const resResponse = await this.postgreSQLClient.query(
      (knex: KnexType) => {
        return knex.transaction(async (transaction) => {
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
      },
    );

    if (resResponse.isFailure) {
      return contextualizeError(
        resResponse,
        'ItemStore.edit',
      );
    }

    return Result.success(resResponse.getValue());
  }
  */

  async getExcept(userId: string, itemSlug: string) {
    const resDBItems = await this.postgreSQLClient.query<
      DBItem[]
    >((knex: KnexType) => {
      return knex
        .where('user_id', userId)
        .whereNot('slug', itemSlug)
        .select('*')
        .from('item');
    });

    if (resDBItems.isFailure) {
      return contextualizeError(
        resDBItems,
        'ItemStore.list',
      );
    }

    const dbItems = resDBItems.getValue();

    return Result.success(toItems(dbItems));
  }
}
