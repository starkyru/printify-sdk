import { ShopScopedResource } from '../shop-scoped-resource.js';
import { assertSafeStringId } from '../validation.js';
import type {
  PrintifyOrder,
  CreateOrderRequest,
  OrderListParams,
  PaginatedResponse,
} from '../types/index.js';
import type { ShippingRequest, ShippingRate } from '../types/shipping.js';

export class OrdersResource extends ShopScopedResource {
  private buildQueryString(params?: OrderListParams): string {
    if (!params) return '';
    const parts: string[] = [];
    if (params.page !== undefined) {
      if (!Number.isInteger(params.page) || params.page < 1) {
        throw new Error('page must be a positive integer');
      }
      parts.push(`page=${params.page}`);
    }
    if (params.limit !== undefined) {
      if (!Number.isInteger(params.limit) || params.limit < 1) {
        throw new Error('limit must be a positive integer');
      }
      parts.push(`limit=${params.limit}`);
    }
    if (params.status !== undefined)
      parts.push(`status=${encodeURIComponent(params.status)}`);
    return parts.length > 0 ? `?${parts.join('&')}` : '';
  }

  /**
   * List orders for a shop.
   */
  async list(
    shopId?: string,
    params?: OrderListParams,
  ): Promise<PaginatedResponse<PrintifyOrder>> {
    const id = this.resolveShopId(shopId);
    assertSafeStringId(id, 'shopId');
    const qs = this.buildQueryString(params);
    return this.httpGet<PaginatedResponse<PrintifyOrder>>(
      `/shops/${id}/orders.json${qs}`,
    );
  }

  /**
   * Get a single order by ID.
   */
  async get(orderId: string, shopId?: string): Promise<PrintifyOrder> {
    const id = this.resolveShopId(shopId);
    assertSafeStringId(id, 'shopId');
    assertSafeStringId(orderId, 'orderId');
    return this.httpGet<PrintifyOrder>(
      `/shops/${id}/orders/${orderId}.json`,
    );
  }

  /**
   * Create a new order.
   */
  async create(
    data: CreateOrderRequest,
    shopId?: string,
  ): Promise<PrintifyOrder> {
    const id = this.resolveShopId(shopId);
    assertSafeStringId(id, 'shopId');
    return this.httpPost<PrintifyOrder>(`/shops/${id}/orders.json`, data);
  }

  /**
   * Send an order to production.
   */
  async sendToProduction(
    orderId: string,
    shopId?: string,
  ): Promise<PrintifyOrder> {
    const id = this.resolveShopId(shopId);
    assertSafeStringId(id, 'shopId');
    assertSafeStringId(orderId, 'orderId');
    return this.httpPost<PrintifyOrder>(
      `/shops/${id}/orders/${orderId}/send_to_production.json`,
    );
  }

  /**
   * Calculate shipping costs for a potential order.
   */
  async calculateShipping(
    data: ShippingRequest,
    shopId?: string,
  ): Promise<ShippingRate[]> {
    const id = this.resolveShopId(shopId);
    assertSafeStringId(id, 'shopId');
    return this.httpPost<ShippingRate[]>(
      `/shops/${id}/orders/shipping.json`,
      data,
    );
  }

  /**
   * Cancel an order.
   */
  async cancel(orderId: string, shopId?: string): Promise<void> {
    const id = this.resolveShopId(shopId);
    assertSafeStringId(id, 'shopId');
    assertSafeStringId(orderId, 'orderId');
    await this.httpPost(
      `/shops/${id}/orders/${orderId}/cancel.json`,
    );
  }
}
