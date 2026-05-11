import { describe, it, expect } from 'vitest';
import { PrintifyClient } from '../src/client.js';
import { ShopsResource } from '../src/resources/shops.js';
import { BlueprintsResource } from '../src/resources/blueprints.js';
import { ProductsResource } from '../src/resources/products.js';
import { OrdersResource } from '../src/resources/orders.js';
import { UploadsResource } from '../src/resources/uploads.js';
import { WebhooksResource } from '../src/resources/webhooks.js';

describe('PrintifyClient', () => {
  it('initializes all resource instances', () => {
    const client = new PrintifyClient({ accessToken: 'tok_test' });
    expect(client.shops).toBeInstanceOf(ShopsResource);
    expect(client.blueprints).toBeInstanceOf(BlueprintsResource);
    expect(client.products).toBeInstanceOf(ProductsResource);
    expect(client.orders).toBeInstanceOf(OrdersResource);
    expect(client.uploads).toBeInstanceOf(UploadsResource);
    expect(client.webhooks).toBeInstanceOf(WebhooksResource);
  });
});
