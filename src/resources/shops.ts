import { BaseResource } from '../base-resource.js';
import type { Shop } from '../types/index.js';

export class ShopsResource extends BaseResource {
  /**
   * List all shops connected to the account.
   */
  async list(): Promise<Shop[]> {
    return this.httpGet<Shop[]>('/shops.json');
  }
}
