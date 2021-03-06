import { randomUUID } from 'node:crypto';
import { Knex as KnexType } from 'knex';

import { PostgreSQLClient } from '../../clients/postgre_sql_client.js';
import { toSlug } from '../../libs/to_slug.js';
import { Result } from '../../libs/result.js';
import {
  notFound,
  contextualizeError,
} from '../../libs/error.js';
import { Item, SRCItem } from './item.js';

export class ItemStore {
  constructor(private postgreSQLClient: PostgreSQLClient) {}

  getBySlug(userId: string, itemSlug: string) {
    const request = this.postgreSQLClient.query<SRCItem[]>(
      (knex: KnexType) => {
        return knex
          .where({ slug: itemSlug, user_id: userId })
          .select('*')
          .from('item');
      },
    );
    return Result.fromPromise(request)
      .elseChain((error) => {
        return contextualizeError(
          error,
          'ItemStore.getBySlug',
        );
      })
      .chain((srcItemValue) => {
        const srcItem = srcItemValue[0];
        if (!srcItem) {
          return notFound(
            `ItemStore.getBySlug Item not found ${userId} ${itemSlug}.`,
          );
        }
        return Item.resFromSRC(srcItem);
      });
  }

  async getById(userId: string, itemId: string) {
    const resSRCItems = await this.postgreSQLClient.query<
      SRCItem[]
    >((knex: KnexType) => {
      return knex
        .where({ id: itemId, user_id: userId })
        .select('*')
        .from('item');
    });

    return resSRCItems
      .elseChain((error) => {
        return contextualizeError(
          error,
          'ItemStore.getById',
        );
      })
      .chain((srcItemValue) => {
        const srcItem = srcItemValue[0];
        if (!srcItem) {
          return notFound(
            `ItemStore.getBySlug Item not found ${userId} ${itemId}.`,
          );
        }
        return Item.resFromSRC(srcItem);
      });
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
        resDB.getError(),
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
      await this.postgreSQLClient.query<SRCItem[]>(
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
        resDBChildItems.getError(),
        'ItemStore.getChild',
      );
    }
    const dbChildItems = resDBChildItems.getValue();
    return Item.resFromSRCList(dbChildItems);
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
        resResponse.getError(),
        'ItemStore.create',
      );
    }
    return resResponse;
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
        resResponse.getError(),
        'ItemStore.edit',
      );
    }
    return resResponse;
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
    const resSRCItems = await this.postgreSQLClient.query<
      SRCItem[]
    >((knex: KnexType) => {
      return knex
        .where('user_id', userId)
        .whereNot('slug', itemSlug)
        .select('*')
        .from('item');
    });
    if (resSRCItems.isFailure) {
      return contextualizeError(
        resSRCItems.getError(),
        'ItemStore.list',
      );
    }
    const dbItems = resSRCItems.getValue();
    return Item.resFromSRCList(dbItems);
  }
}
