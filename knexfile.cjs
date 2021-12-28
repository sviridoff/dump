const path = require('path');

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: 'postgres',
      port: 5432,
      user: 'postgres',
      password: 'newPassword',
      database: 'svirisama',
    },
    migrations: {
      directory: path.resolve(__dirname, '/db/migrations'),
    },
    seeds: {
      directory: path.resolve(
        __dirname,
        '/db/seeds/development',
      ),
    },
  },
};
