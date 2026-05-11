export type { Shop } from './shop.js';

export type {
  Blueprint,
  PrintProvider,
  Variant,
  Placeholder,
  VariantsResponse,
} from './blueprint.js';

export type {
  Product,
  ProductVariant,
  ProductOption,
  ProductOptionValue,
  ProductImage,
  PrintArea,
  PrintAreaPlaceholder,
  PrintAreaImage,
  CreateProductRequest,
  UpdateProductRequest,
  PublishRequest,
} from './product.js';

export type {
  PrintifyOrder,
  OrderAddress,
  OrderLineItem,
  Shipment,
  CreateOrderRequest,
  OrderListParams,
} from './order.js';

export type { ShippingRequest, ShippingRate } from './shipping.js';

export type {
  Webhook,
  WebhookTopic,
  CreateWebhookRequest,
  UpdateWebhookRequest,
  WebhookEvent,
} from './webhook.js';

export type {
  UploadImageByUrlRequest,
  UploadImageByBase64Request,
  UploadImageRequest,
  UploadedImage,
} from './upload.js';

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}
