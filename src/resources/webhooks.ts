import { BaseResource } from '../base-resource.js';
import type {
  Webhook,
  CreateWebhookRequest,
  UpdateWebhookRequest,
} from '../types/index.js';

export class WebhooksResource extends BaseResource {
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

  /**
   * List all webhooks for a shop.
   */
  async list(shopId?: string): Promise<Webhook[]> {
    const id = this.resolveShopId(shopId);
    return this.httpGet<Webhook[]>(`/shops/${id}/webhooks.json`);
  }

  /**
   * Create a new webhook.
   */
  async create(
    data: CreateWebhookRequest,
    shopId?: string,
  ): Promise<Webhook> {
    const id = this.resolveShopId(shopId);
    return this.httpPost<Webhook>(`/shops/${id}/webhooks.json`, data);
  }

  /**
   * Update an existing webhook.
   */
  async update(
    webhookId: string,
    data: UpdateWebhookRequest,
    shopId?: string,
  ): Promise<Webhook> {
    const id = this.resolveShopId(shopId);
    return this.httpPut<Webhook>(
      `/shops/${id}/webhooks/${webhookId}.json`,
      data,
    );
  }

  /**
   * Delete a webhook.
   */
  async delete(webhookId: string, shopId?: string): Promise<void> {
    const id = this.resolveShopId(shopId);
    await this.httpDelete(`/shops/${id}/webhooks/${webhookId}.json`);
  }
}
