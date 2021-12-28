import { result, ResultOK } from '@daisugi/kintsugi';

import {
  ServiceController,
  ServiceReply,
  ServiceRequest,
} from '../../types/ServiceController';
import { ItemStore } from '../../stores/ItemStore';

export class ItemController implements ServiceController {
  constructor(private itemStore: ItemStore) {}

  async handler(
    request: ServiceRequest,
  ): Promise<ResultOK<ServiceReply>> {
    const { username, itemSlug } = request.params;

    const resItem = await this.itemStore.getItem(
      username,
      itemSlug,
    );

    return result.ok({
      templatePath:
        'use-cases/show-item/templates/item.ejs',
      templateData: {
        item: resItem.value,
      },
    });
  }
}
