import { Item } from '../../stores/ItemStore.js';
import { User } from '../../stores/UserStore.js';

interface EditItemPresenter {
  user: User;
  item: {
    id: string;
    slug: string;
    title: string;
    isPrivate: boolean;
    visibility: 'public' | 'private';
  };
}

export function toEditItemPresenter(
  item: Item,
  user: User,
): EditItemPresenter {
  return {
    user,
    item: {
      ...item,
      visibility: item.isPrivate ? 'private' : 'public',
    },
  };
}
