import { ShopScopedResource } from '../shop-scoped-resource.js';
import { assertSafeStringId } from '../validation.js';
import type {
  Webhook,
  CreateWebhookRequest,
  UpdateWebhookRequest,
} from '../types/index.js';

export class WebhooksResource extends ShopScopedResource {
  /**
   * List all webhooks for a shop.
   */
  async list(shopId?: string): Promise<Webhook[]> {
    const id = this.resolveShopId(shopId);
    assertSafeStringId(id, 'shopId');
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
    assertSafeStringId(id, 'shopId');
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
    assertSafeStringId(id, 'shopId');
    assertSafeStringId(webhookId, 'webhookId');
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
    assertSafeStringId(id, 'shopId');
    assertSafeStringId(webhookId, 'webhookId');
    await this.httpDelete(`/shops/${id}/webhooks/${webhookId}.json`);
  }
}
