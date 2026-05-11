export interface PrintifyOrder {
  id: string;
  address_to: OrderAddress;
  line_items: OrderLineItem[];
  metadata: { shop_order_id: string; shop_order_label: string };
  total_price: number;
  total_shipping: number;
  total_tax: number;
  status: string;
  shipping_method: number;
  is_printify_express: boolean;
  shipments: Shipment[];
  created_at: string;
  sent_to_production_at: string | null;
  fulfilled_at: string | null;
}

export interface OrderAddress {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country: string;
  region: string;
  address1: string;
  address2: string;
  city: string;
  zip: string;
}

export interface OrderLineItem {
  product_id: string;
  quantity: number;
  variant_id: number;
  print_provider_id: number;
  cost: number;
  shipping_cost: number;
  status: string;
  metadata: Record<string, unknown>;
}

export interface Shipment {
  carrier: string;
  number: string;
  url: string;
  delivered_at: string | null;
}

export interface CreateOrderRequest {
  external_id: string;
  label?: string;
  line_items: Array<{
    product_id: string;
    variant_id: number;
    quantity: number;
  }>;
  shipping_method: number;
  is_printify_express?: boolean;
  send_shipping_notification?: boolean;
  address_to: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    country: string;
    region: string;
    address1: string;
    address2?: string;
    city: string;
    zip: string;
  };
}

export type OrderStatus =
  | 'pending'
  | 'cancelled'
  | 'on-hold'
  | 'payment-not-received'
  | 'fulfilled'
  | 'sent-to-production'
  | 'partially-fulfilled';

export interface OrderListParams {
  page?: number;
  limit?: number;
  status?: OrderStatus;
}
