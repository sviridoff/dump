const { randomUUID } = require('crypto');

exports.seed = function (knex) {
  // Deletes ALL existing entries.
  return knex('item')
    .del()
    .then(function () {
      const ids = Array.from({ length: 5 }, () => randomUUID());

      // Inserts seed entries.
      return knex('item').insert([
        {
          id: '397570ce-9c62-42cd-8336-26bdd972446e',
          name: 'Item 1',
          item_ids: [ids[1], ids[2], ids[3], ids[4]],
        },
        {
          id: ids[1],
          name: 'Item 2',
        },
        {
          id: ids[2],
          name: 'Item 3',
        },
        {
          id: ids[3],
          name: 'Item 4',
        },
        {
          id: ids[4],
          name: 'Item 5',
        },
      ]);
    });
};
