import { ManifestItem } from '@daisugi/kado';

// Clients.
import { PostgreSQLClient } from './clients/PostgreSQLClient.js';

// Stores.
import { ItemStore } from './stores/ItemStore.js';
import { UserStore } from './stores/UserStore.js';

// Show item.
import { ItemController } from './use-cases/show-item/ItemController.js';
import { mapItemRoutes } from './use-cases/show-item/mapItemRoutes.js';

export const diToken = {
  // Clients.
  PostgreSQLClient: Symbol('PostgreSQLClient'),
  postgreSQLHost: Symbol('postgreSQLHost'),
  postgreSQLPort: Symbol('postgreSQLPort'),
  postgreSQLUser: Symbol('postgreSQLUser'),
  postgreSQLPassword: Symbol('postgreSQLPassword'),
  postgreSQLDatabaseName: Symbol('postgreSQLDatabaseName'),
  // Stores.
  ItemStore: Symbol('ItemStore'),
  UserStore: Symbol('UserStore'),
  // Show item.
  ItemController: Symbol('ItemController'),
  mapItemRoutes: Symbol('mapItemRoutes'),
};

export const diRoutesManifestTokens = [
  diToken.mapItemRoutes,
];

export function buildDIManifest(
  envs: Record<string, unknown>,
): ManifestItem[] {
  return [
    // Clients.
    {
      token: diToken.postgreSQLHost,
      useValue: envs.POSTGRE_SQL_HOST,
    },
    {
      token: diToken.postgreSQLPort,
      useValue: envs.POSTGRE_SQL_PORT,
    },
    {
      token: diToken.postgreSQLUser,
      useValue: envs.POSTGRE_SQL_USER,
    },
    {
      token: diToken.postgreSQLPassword,
      useValue: envs.POSTGRE_SQL_PASSWORD,
    },
    {
      token: diToken.postgreSQLDatabaseName,
      useValue: envs.POSTGRE_SQL_DATABASE_NAME,
    },
    {
      token: diToken.PostgreSQLClient,
      useClass: PostgreSQLClient,
      params: [
        diToken.postgreSQLHost,
        diToken.postgreSQLPort,
        diToken.postgreSQLUser,
        diToken.postgreSQLPassword,
        diToken.postgreSQLDatabaseName,
      ],
    },
    // Stores.
    {
      token: diToken.ItemStore,
      useClass: ItemStore,
      params: [diToken.PostgreSQLClient],
    },
    {
      token: diToken.UserStore,
      useClass: UserStore,
      params: [diToken.PostgreSQLClient],
    },
    // Show item.
    {
      token: diToken.ItemController,
      useClass: ItemController,
      params: [diToken.ItemStore, diToken.UserStore],
    },
    {
      token: diToken.mapItemRoutes,
      useFactory: mapItemRoutes,
      params: [diToken.ItemController],
    },
  ];
}
