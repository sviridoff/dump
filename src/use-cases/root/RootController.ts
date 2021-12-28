import { result } from '@daisugi/kintsugi';

import {
  Controller,
  Request,
} from '../../types/Controller.js';
import { PostgreSQLClient } from '../../clients/PostgreSQLClient.js';

export class RootController implements Controller {
  constructor(private postgreSQLClient: PostgreSQLClient) {}

  async handler(_: Request) {
    const response = await this.postgreSQLClient
      .get()
      .select('*')
      .from('item');

    console.log('MMMMMM', response);

    return result.ok({
      templatePath: 'use-cases/root/templates/root.ejs',
      templateData: {
        text: 'text',
      },
    });
  }
}
