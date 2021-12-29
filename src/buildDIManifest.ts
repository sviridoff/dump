import { ManifestItem } from '@daisugi/kado';

// Clients.
import { PostgreSQLClient } from './clients/PostgreSQLClient.js';

// Stores.
import { ItemStore } from './stores/ItemStore.js';
import { UserStore } from './stores/UserStore.js';

// Show item.
import { ShowItemController } from './use-cases/show-item/ShowItemController.js';
import { mapShowItemRoutes } from './use-cases/show-item/mapShowItemRoutes.js';

// New item.
import { NewItemController } from './use-cases/new-item/NewItemController.js';
import { mapNewItemRoutes } from './use-cases/new-item/mapNewItemRoutes.js';

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
  ShowItemController: Symbol('ShowItemController'),
  mapShowItemRoutes: Symbol('mapShowItemRoutes'),
  // New item.
  NewItemController: Symbol('NewItemController'),
  mapNewItemRoutes: Symbol('mapNewItemRoutes'),
};

export const diRoutesManifestTokens = [
  diToken.mapShowItemRoutes,
  diToken.mapNewItemRoutes,
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
      token: diToken.ShowItemController,
      useClass: ShowItemController,
      params: [diToken.ItemStore, diToken.UserStore],
    },
    {
      token: diToken.mapShowItemRoutes,
      useFactory: mapShowItemRoutes,
      params: [diToken.ShowItemController],
    },
    // New item.
    {
      token: diToken.NewItemController,
      useClass: NewItemController,
      params: [diToken.ItemStore, diToken.UserStore],
    },
    {
      token: diToken.mapNewItemRoutes,
      useFactory: mapNewItemRoutes,
      params: [diToken.NewItemController],
    },
  ];
}
