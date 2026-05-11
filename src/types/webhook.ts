export interface Webhook {
  id: string;
  topic: WebhookTopic;
  url: string;
  shop_id: string;
  /** Signing secret — treat as a credential. Do not log or store in plaintext. */
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
  /** If omitted, Printify generates one. Use crypto.randomBytes(32).toString('hex') for a strong value. */
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
