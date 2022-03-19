import { Result } from '../../libs/result.js';

export interface SRCItem {
  id: string;
  title: string;
  slug: string;
  user_id: string;
  is_private: boolean;
  created_at: string;
  updated_at: string;
}

export class Item {
  constructor(
    public id: string,
    public slug: string,
    public title: string,
    public isPrivate: boolean,
  ) {}

  static fromSRC(srcItem: SRCItem) {
    return new Item(
      srcItem.id,
      srcItem.slug,
      srcItem.title,
      srcItem.is_private,
    );
  }

  static resFromSRC(srcItem: SRCItem) {
    return Result.success(Item.fromSRC(srcItem));
  }

  static resFromSRCList(srcItems: SRCItem[]) {
    return Result.success(srcItems.map(Item.fromSRC));
  }
}
