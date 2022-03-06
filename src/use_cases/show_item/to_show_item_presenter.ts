import { Item } from '../../stores/item_store/item.js';
import { User } from '../../stores/user_store/user.js';

interface ShowItemPresenter {
  user: User;
  item: {
    id: string;
    slug: string;
    title: string;
    isPrivate: boolean;
    visibility: 'public' | 'private';
    items?: {
      id: string;
      slug: string;
      title: string;
      isPrivate: boolean;
      visibility: 'public' | 'private';
    }[];
  };
}

export function toShowItemPresenter(
  item: Item,
  itemChild: Item[],
  user: User,
): ShowItemPresenter {
  return {
    user,
    item: {
      ...item,
      visibility: item.isPrivate ? 'private' : 'public',
      items: itemChild.map((item) => ({
        ...item,
        visibility: item.isPrivate ? 'private' : 'public',
      })),
    },
  };
}
