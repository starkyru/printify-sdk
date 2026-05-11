# printify-sdk

TypeScript SDK for the [Printify API](https://developers.printify.com/). Fully typed, zero dependencies, ESM-only.

## Install

```bash
npm install printify-sdk
```

Requires Node.js 18+.

## Quick Start

```typescript
import { PrintifyClient } from 'printify-sdk';

const client = new PrintifyClient({
  accessToken: 'YOUR_API_TOKEN',
  shopId: 'YOUR_SHOP_ID', // optional, can be passed per-call
});

// List shops
const shops = await client.shops.list();

// List products
const products = await client.products.list();

// Create a product
const product = await client.products.create({
  title: 'My T-Shirt',
  description: 'A great shirt',
  blueprint_id: 6,
  print_provider_id: 1,
  variants: [{ id: 17390, price: 2000, is_enabled: true }],
  print_areas: [
    {
      variant_ids: [17390],
      placeholders: [
        {
          position: 'front',
          images: [
            {
              id: 'image-id',
              name: 'design.png',
              type: 'image/png',
              height: 1000,
              width: 1000,
              x: 0.5,
              y: 0.5,
              scale: 1,
              angle: 0,
            },
          ],
        },
      ],
    },
  ],
});
```

## API

### `new PrintifyClient(options)`

| Option        | Type     | Required | Description                          |
| ------------- | -------- | -------- | ------------------------------------ |
| `accessToken` | `string` | Yes      | Printify API token                   |
| `shopId`      | `string` | No       | Default shop ID for shop-scoped calls |
| `baseUrl`     | `string` | No       | API base URL (defaults to `https://api.printify.com/v1`). Must be a valid URL. |
| `timeoutMs`   | `number` | No       | Request timeout in milliseconds (default: 30 000) |

### Shops

```typescript
client.shops.list(): Promise<Shop[]>
```

### Blueprints (Catalog)

```typescript
client.blueprints.list(): Promise<Blueprint[]>
client.blueprints.get(blueprintId): Promise<Blueprint>
client.blueprints.getPrintProviders(blueprintId): Promise<PrintProvider[]>
client.blueprints.getVariants(blueprintId, printProviderId): Promise<VariantsResponse>
```

### Products

All methods accept an optional `shopId` parameter to override the default.

```typescript
client.products.list(shopId?): Promise<PaginatedResponse<Product>>
client.products.get(productId, shopId?): Promise<Product>
client.products.create(data, shopId?): Promise<Product>
client.products.update(productId, data, shopId?): Promise<Product>
client.products.delete(productId, shopId?): Promise<void>
client.products.publish(productId, publishData, shopId?): Promise<void>
client.products.getImages(productId, shopId?): Promise<ProductImage[]>
```

### Orders

```typescript
client.orders.list(shopId?, params?): Promise<PaginatedResponse<PrintifyOrder>>
client.orders.get(orderId, shopId?): Promise<PrintifyOrder>
client.orders.create(data, shopId?): Promise<PrintifyOrder>
client.orders.sendToProduction(orderId, shopId?): Promise<PrintifyOrder>
client.orders.cancel(orderId, shopId?): Promise<void>
client.orders.calculateShipping(data, shopId?): Promise<ShippingRate[]>
```

### Uploads

```typescript
client.uploads.uploadImage(data): Promise<UploadedImage>
client.uploads.getImage(imageId): Promise<UploadedImage>
client.uploads.archiveImage(imageId): Promise<void>
```

### Webhooks

```typescript
client.webhooks.list(shopId?): Promise<Webhook[]>
client.webhooks.create(data, shopId?): Promise<Webhook>
client.webhooks.update(webhookId, data, shopId?): Promise<Webhook>
client.webhooks.delete(webhookId, shopId?): Promise<void>
```

### Input Validation

All resource IDs are validated before use — path traversal attempts (`../`, `/`, special characters) throw immediately. Upload URLs must use HTTPS. Order list `page`/`limit` must be positive integers.

## Error Handling

```typescript
import { PrintifyApiError, PrintifyRateLimitError } from 'printify-sdk';

try {
  await client.products.get('non-existent');
} catch (err) {
  if (err instanceof PrintifyRateLimitError) {
    // err.retryAfter — seconds to wait (or null)
    console.log(`Rate limited. Retry after ${err.retryAfter}s`);
  } else if (err instanceof PrintifyApiError) {
    // err.statusCode, err.message, err.errors
    console.log(`API error ${err.statusCode}: ${err.message}`);
  }
}
```

## Development

```bash
npm run lint        # eslint
npm run typecheck   # tsc --noEmit
npm run test        # vitest
npm run build       # compile to dist/
```

Pre-commit hooks (via husky) run lint, typecheck, and tests automatically.

## License

MIT
