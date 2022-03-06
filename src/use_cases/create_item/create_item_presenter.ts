import { Item } from '../../stores/item_store/item.js';
import { User } from '../../stores/user_store/user.js';

export class CreateItemPresenter {
  user: User;
  item: {
    id: string;
    slug: string;
    title: string;
    isPrivate: boolean;
    visibility: 'public' | 'private';
  };
  constructor(item: Item, user: User) {
    this.user = user;
    this.item = {
      ...item,
      visibility: item.isPrivate ? 'private' : 'public',
    };
  }
}
