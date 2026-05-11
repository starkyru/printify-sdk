export interface Webhook {
  id: string;
  topic: WebhookTopic;
  url: string;
  shop_id: string;
  secret: string;
}

export type WebhookTopic =
  | 'order:created'
  | 'order:updated'
  | 'order:sent-to-production'
  | 'order:shipment:created'
  | 'order:shipment:delivered'
  | 'product:deleted'
  | 'product:publish:started';

export interface CreateWebhookRequest {
  topic: WebhookTopic;
  url: string;
  secret?: string;
}

export interface UpdateWebhookRequest {
  url?: string;
  secret?: string;
}

export interface WebhookEvent {
  id: string;
  type: WebhookTopic;
  created_at: string;
  resource: {
    id: string;
    type: string;
    data: Record<string, unknown>;
  };
}
