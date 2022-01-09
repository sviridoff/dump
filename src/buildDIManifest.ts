import { ManifestItem } from '@daisugi/kado';

// Clients.
import { PostgreSQLClient } from './clients/PostgreSQLClient.js';

// Stores.
import { ItemStore } from './stores/ItemStore.js';
import { UserStore } from './stores/UserStore.js';

// Show item.
import { ShowItemController } from './use-cases/show-item/ShowItemController.js';
import { mapShowItemRoutes } from './use-cases/show-item/mapShowItemRoutes.js';

// Create item.
import { CreateItemController } from './use-cases/create-item/CreateItemController.js';
import { mapCreateItemRoutes } from './use-cases/create-item/mapCreateItemRoutes.js';

// Edit item.
import { EditItemController } from './use-cases/edit-item/EditItemController.js';
import { mapEditItemRoutes } from './use-cases/edit-item/mapEditItemRoutes.js';

// Delete item.
import { DeleteItemController } from './use-cases/delete-item/DeleteItemController.js';
import { mapDeleteItemRoutes } from './use-cases/delete-item/mapDeleteItemRoutes.js';

// Move item.
import { MoveItemController } from './use-cases/move-item/MoveItemController.js';
import { mapMoveItemRoutes } from './use-cases/move-item/mapMoveItemRoutes.js';

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
  // Create item.
  CreateItemController: Symbol('CreateItemController'),
  mapCreateItemRoutes: Symbol('mapCreateItemRoutes'),
  // Edit item.
  EditItemController: Symbol('EditItemController'),
  mapEditItemRoutes: Symbol('mapEditItemRoutes'),
  // Delete item.
  DeleteItemController: Symbol('DeleteItemController'),
  mapDeleteItemRoutes: Symbol('mapDeleteItemRoutes'),
  // Move item.
  MoveItemController: Symbol('MoveItemController'),
  mapMoveItemRoutes: Symbol('mapMoveItemRoutes'),
};

export const diRoutesManifestTokens = [
  diToken.mapShowItemRoutes,
  diToken.mapCreateItemRoutes,
  diToken.mapEditItemRoutes,
  diToken.mapDeleteItemRoutes,
  diToken.mapMoveItemRoutes,
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
    // Create item.
    {
      token: diToken.CreateItemController,
      useClass: CreateItemController,
      params: [diToken.ItemStore, diToken.UserStore],
    },
    {
      token: diToken.mapCreateItemRoutes,
      useFactory: mapCreateItemRoutes,
      params: [diToken.CreateItemController],
    },
    // Edit item.
    {
      token: diToken.EditItemController,
      useClass: EditItemController,
      params: [diToken.ItemStore, diToken.UserStore],
    },
    {
      token: diToken.mapEditItemRoutes,
      useFactory: mapEditItemRoutes,
      params: [diToken.EditItemController],
    },
    // Delete item.
    {
      token: diToken.DeleteItemController,
      useClass: DeleteItemController,
      params: [diToken.ItemStore, diToken.UserStore],
    },
    {
      token: diToken.mapDeleteItemRoutes,
      useFactory: mapDeleteItemRoutes,
      params: [diToken.DeleteItemController],
    },
    // Move item.
    {
      token: diToken.MoveItemController,
      useClass: MoveItemController,
      params: [diToken.ItemStore, diToken.UserStore],
    },
    {
      token: diToken.mapMoveItemRoutes,
      useFactory: mapMoveItemRoutes,
      params: [diToken.MoveItemController],
    },
  ];
}
