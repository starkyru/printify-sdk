export interface ShippingRequest {
  line_items: Array<{
    product_id: string;
    variant_id: number;
    quantity: number;
  }>;
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

export interface ShippingRate {
  standard: number;
  express: number;
  priority?: number;
  printify_express?: number;
  economy?: number;
}
