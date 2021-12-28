const { randomUUID } = require('crypto');

exports.seed = function (knex) {
  // Deletes ALL existing entries.
  return knex('item')
    .del()
    .then(function () {
      const ids = Array.from({ length: 5 }, () =>
        randomUUID(),
      );

      // Inserts seed entries.
      return knex('item').insert([
        {
          id: '397570ce-9c62-42cd-8336-26bdd972446e',
          name: 'Item 1',
          slug: 'item-1',
          user_id: '3dd292d6-f415-4939-bb67-41abd0e901a0',
          item_ids: [ids[1], ids[2], ids[3], ids[4]],
        },
        {
          id: ids[1],
          user_id: '3dd292d6-f415-4939-bb67-41abd0e901a0',
          name: 'Item 2',
          slug: 'item-2',
        },
        {
          id: ids[2],
          user_id: '3dd292d6-f415-4939-bb67-41abd0e901a0',
          name: 'Item 3',
          slug: 'item-3',
        },
        {
          id: ids[3],
          user_id: '3dd292d6-f415-4939-bb67-41abd0e901a0',
          name: 'Item 4',
          slug: 'item-4',
        },
        {
          id: ids[4],
          user_id: '3dd292d6-f415-4939-bb67-41abd0e901a0',
          name: 'Item 5',
          slug: 'item-5',
        },
      ]);
    });
};
