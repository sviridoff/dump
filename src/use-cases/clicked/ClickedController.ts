import { result } from '@daisugi/kintsugi';

import {
  Controller,
  Request,
} from '../../types/Controller.js';

export class ClickedController implements Controller {
  async handler(_: Request) {
    return result.ok({
      templatePath:
        'use-cases/clicked/templates/clicked.ejs',
      templateData: {},
    });
  }
}
