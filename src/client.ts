import { ShopsResource } from './resources/shops.js';
import { BlueprintsResource } from './resources/blueprints.js';
import { ProductsResource } from './resources/products.js';
import { OrdersResource } from './resources/orders.js';
import { UploadsResource } from './resources/uploads.js';
import { WebhooksResource } from './resources/webhooks.js';

export interface PrintifyClientOptions {
  accessToken: string;
  shopId?: string;
  /** API base URL. Must be a valid URL. Defaults to the Printify v1 API. */
  baseUrl?: string;
  /** Request timeout in milliseconds. Defaults to 30 000 (30 s). */
  timeoutMs?: number;
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
    const { accessToken, shopId, timeoutMs } = opts;

    this.shops = new ShopsResource(baseUrl, accessToken, timeoutMs);
    this.blueprints = new BlueprintsResource(baseUrl, accessToken, timeoutMs);
    this.products = new ProductsResource(
      baseUrl,
      accessToken,
      shopId,
      timeoutMs,
    );
    this.orders = new OrdersResource(baseUrl, accessToken, shopId, timeoutMs);
    this.uploads = new UploadsResource(baseUrl, accessToken, timeoutMs);
    this.webhooks = new WebhooksResource(
      baseUrl,
      accessToken,
      shopId,
      timeoutMs,
    );
  }
}
