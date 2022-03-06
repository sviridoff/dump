import { Item } from '../../stores/item_store/item.js';
import { User } from '../../stores/user_store/user.js';

export class MoveItemPresenter {
  public user: User;
  public item: {
    id: string;
    slug: string;
    title: string;
    isPrivate: boolean;
    visibility: 'public' | 'private';
  };
  public items: {
    id: string;
    slug: string;
    title: string;
    isPrivate: boolean;
    visibility: 'public' | 'private';
  }[];
  constructor(item: Item, items: Item[], user: User) {
    this.user = user;
    this.item = {
      ...item,
      visibility: item.isPrivate ? 'private' : 'public',
    };
    this.items = items.map((item) => ({
      ...item,
      visibility: item.isPrivate ? 'private' : 'public',
    }));
  }
}
