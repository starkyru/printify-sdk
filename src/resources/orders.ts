import { BaseResource } from '../base-resource.js';
import type {
  PrintifyOrder,
  CreateOrderRequest,
  OrderListParams,
  PaginatedResponse,
} from '../types/index.js';
import type { ShippingRequest, ShippingRate } from '../types/shipping.js';

export class OrdersResource extends BaseResource {
  constructor(
    baseUrl: string,
    accessToken: string,
    private readonly defaultShopId?: string,
  ) {
    super(baseUrl, accessToken);
  }

  private resolveShopId(shopId?: string): string {
    const id = shopId ?? this.defaultShopId;
    if (!id) {
      throw new Error(
        'shopId is required. Provide it per-call or set a default on PrintifyClient.',
      );
    }
    return id;
  }

  private buildQueryString(params?: OrderListParams): string {
    if (!params) return '';
    const parts: string[] = [];
    if (params.page !== undefined) parts.push(`page=${params.page}`);
    if (params.limit !== undefined) parts.push(`limit=${params.limit}`);
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
    await this.httpPost(
      `/shops/${id}/orders/${orderId}/cancel.json`,
    );
  }
}
