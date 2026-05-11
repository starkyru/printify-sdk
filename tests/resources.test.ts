import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ShopsResource } from '../src/resources/shops.js';
import { BlueprintsResource } from '../src/resources/blueprints.js';
import { ProductsResource } from '../src/resources/products.js';
import { OrdersResource } from '../src/resources/orders.js';
import { UploadsResource } from '../src/resources/uploads.js';
import { WebhooksResource } from '../src/resources/webhooks.js';

const BASE = 'https://api.printify.com/v1';
const TOKEN = 'tok_test';
const SHOP = 'shop_123';

function mockFetch(body: unknown = {}, status = 200) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    statusText: 'OK',
    headers: new Headers(),
    json: () => Promise.resolve(body),
  });
}

function calledPath(): string {
  return (fetch as ReturnType<typeof vi.fn>).mock.calls[0][0];
}

function calledMethod(): string {
  return (fetch as ReturnType<typeof vi.fn>).mock.calls[0][1].method;
}

afterEach(() => vi.restoreAllMocks());

describe('ShopsResource', () => {
  beforeEach(() => vi.stubGlobal('fetch', mockFetch([{ id: 1 }])));

  it('list() calls GET /shops.json', async () => {
    const shops = new ShopsResource(BASE, TOKEN);
    await shops.list();
    expect(calledPath()).toBe(`${BASE}/shops.json`);
    expect(calledMethod()).toBe('GET');
  });
});

describe('BlueprintsResource', () => {
  const bp = new BlueprintsResource(BASE, TOKEN);
  beforeEach(() => vi.stubGlobal('fetch', mockFetch([])));

  it('list()', async () => {
    await bp.list();
    expect(calledPath()).toBe(`${BASE}/catalog/blueprints.json`);
  });

  it('get()', async () => {
    vi.stubGlobal('fetch', mockFetch({ id: 5 }));
    await bp.get(5);
    expect(calledPath()).toBe(`${BASE}/catalog/blueprints/5.json`);
  });

  it('getPrintProviders()', async () => {
    await bp.getPrintProviders(5);
    expect(calledPath()).toBe(`${BASE}/catalog/blueprints/5/print_providers.json`);
  });

  it('getVariants()', async () => {
    await bp.getVariants(5, 10);
    expect(calledPath()).toBe(`${BASE}/catalog/blueprints/5/print_providers/10/variants.json`);
  });
});

describe('ProductsResource', () => {
  const products = new ProductsResource(BASE, TOKEN, SHOP);

  beforeEach(() => vi.stubGlobal('fetch', mockFetch({ data: [] })));

  it('throws without shopId', () => {
    const noShop = new ProductsResource(BASE, TOKEN);
    expect(noShop.list()).rejects.toThrow('shopId is required');
  });

  it('list()', async () => {
    await products.list();
    expect(calledPath()).toBe(`${BASE}/shops/${SHOP}/products.json`);
  });

  it('get()', async () => {
    await products.get('prod_1');
    expect(calledPath()).toBe(`${BASE}/shops/${SHOP}/products/prod_1.json`);
  });

  it('create()', async () => {
    await products.create({ title: 'T-Shirt' } as never);
    expect(calledMethod()).toBe('POST');
  });

  it('update()', async () => {
    await products.update('prod_1', { title: 'Updated' } as never);
    expect(calledMethod()).toBe('PUT');
  });

  it('delete()', async () => {
    vi.stubGlobal('fetch', mockFetch(null, 204));
    await products.delete('prod_1');
    expect(calledMethod()).toBe('DELETE');
  });

  it('publish()', async () => {
    vi.stubGlobal('fetch', mockFetch(null, 204));
    await products.publish('prod_1', { title: true, description: true, images: true, variants: true, tags: true });
    expect(calledPath()).toContain('/publish.json');
  });

  it('allows per-call shopId override', async () => {
    await products.list('other_shop');
    expect(calledPath()).toContain('/shops/other_shop/');
  });
});

describe('OrdersResource', () => {
  const orders = new OrdersResource(BASE, TOKEN, SHOP);

  beforeEach(() => vi.stubGlobal('fetch', mockFetch({ data: [] })));

  it('list() with params', async () => {
    await orders.list(undefined, { page: 2, limit: 10, status: 'pending' });
    expect(calledPath()).toContain('page=2');
    expect(calledPath()).toContain('limit=10');
    expect(calledPath()).toContain('status=pending');
  });

  it('get()', async () => {
    await orders.get('ord_1');
    expect(calledPath()).toContain('/orders/ord_1.json');
  });

  it('sendToProduction()', async () => {
    await orders.sendToProduction('ord_1');
    expect(calledPath()).toContain('/send_to_production.json');
    expect(calledMethod()).toBe('POST');
  });

  it('cancel()', async () => {
    vi.stubGlobal('fetch', mockFetch(null, 204));
    await orders.cancel('ord_1');
    expect(calledPath()).toContain('/cancel.json');
  });

  it('calculateShipping()', async () => {
    await orders.calculateShipping({ line_items: [] } as never);
    expect(calledPath()).toContain('/shipping.json');
  });
});

describe('UploadsResource', () => {
  const uploads = new UploadsResource(BASE, TOKEN);

  beforeEach(() => vi.stubGlobal('fetch', mockFetch({ id: 'img_1' })));

  it('uploadImage()', async () => {
    await uploads.uploadImage({ file_name: 'test.png', url: 'https://example.com/img.png' });
    expect(calledPath()).toBe(`${BASE}/uploads/images.json`);
    expect(calledMethod()).toBe('POST');
  });

  it('getImage()', async () => {
    await uploads.getImage('img_1');
    expect(calledPath()).toBe(`${BASE}/uploads/images/img_1.json`);
  });

  it('archiveImage()', async () => {
    await uploads.archiveImage('img_1');
    expect(calledPath()).toContain('/archive.json');
    expect(calledMethod()).toBe('POST');
  });
});

describe('WebhooksResource', () => {
  const webhooks = new WebhooksResource(BASE, TOKEN, SHOP);

  beforeEach(() => vi.stubGlobal('fetch', mockFetch([])));

  it('list()', async () => {
    await webhooks.list();
    expect(calledPath()).toBe(`${BASE}/shops/${SHOP}/webhooks.json`);
  });

  it('create()', async () => {
    vi.stubGlobal('fetch', mockFetch({ id: 'wh_1' }));
    await webhooks.create({ topic: 'order:created', url: 'https://example.com/hook' });
    expect(calledMethod()).toBe('POST');
  });

  it('update()', async () => {
    vi.stubGlobal('fetch', mockFetch({ id: 'wh_1' }));
    await webhooks.update('wh_1', { url: 'https://new.com/hook' });
    expect(calledMethod()).toBe('PUT');
  });

  it('delete()', async () => {
    vi.stubGlobal('fetch', mockFetch(null, 204));
    await webhooks.delete('wh_1');
    expect(calledMethod()).toBe('DELETE');
  });
});
