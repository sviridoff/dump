import { result } from '@daisugi/kintsugi';

import {
  ServiceController,
  ServiceReply,
  ServiceRequest,
} from '../../types/ServiceController';
import { ItemStore } from '../../stores/ItemStore';

export class ItemController implements ServiceController {
  constructor(private itemStore: ItemStore) {}

  async handler(request: ServiceRequest): ServiceReply {
    const { username, itemSlug } = request.params;

    const resItem = await this.itemStore.getItem(
      username,
      itemSlug,
    );

    if (resItem.isFailure) {
      return resItem;
    }

    return result.ok({
      templatePath:
        'use-cases/show-item/templates/item.ejs',
      templateData: {
        item: resItem.value,
      },
    });
  }
}
