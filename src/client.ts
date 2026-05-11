import { ShopsResource } from './resources/shops.js';
import { BlueprintsResource } from './resources/blueprints.js';
import { ProductsResource } from './resources/products.js';
import { OrdersResource } from './resources/orders.js';
import { UploadsResource } from './resources/uploads.js';
import { WebhooksResource } from './resources/webhooks.js';

export interface PrintifyClientOptions {
  accessToken: string;
  shopId?: string;
  baseUrl?: string;
}

const DEFAULT_BASE_URL = 'https://api.printify.com/v1';

export class PrintifyClient {
  readonly shops: ShopsResource;
  readonly blueprints: BlueprintsResource;
  readonly products: ProductsResource;
  readonly orders: OrdersResource;
  readonly uploads: UploadsResource;
  readonly webhooks: WebhooksResource;

  constructor(opts: PrintifyClientOptions) {
    const baseUrl = opts.baseUrl ?? DEFAULT_BASE_URL;
    const { accessToken, shopId } = opts;

    this.shops = new ShopsResource(baseUrl, accessToken);
    this.blueprints = new BlueprintsResource(baseUrl, accessToken);
    this.products = new ProductsResource(baseUrl, accessToken, shopId);
    this.orders = new OrdersResource(baseUrl, accessToken, shopId);
    this.uploads = new UploadsResource(baseUrl, accessToken);
    this.webhooks = new WebhooksResource(baseUrl, accessToken, shopId);
  }
}
