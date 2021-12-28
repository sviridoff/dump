exports.seed = function (knex) {
  // Deletes ALL existing entries.
  return knex('user')
    .del()
    .then(function () {
      // Inserts seed entries.
      return knex('user').insert([
        {
          id: '3dd292d6-f415-4939-bb67-41abd0e901a0',
          name: 'sviridoff',
          item_id: '397570ce-9c62-42cd-8336-26bdd972446e',
        },
      ]);
    });
};
