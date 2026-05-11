export interface Product {
  id: string;
  title: string;
  description: string;
  tags: string[];
  options: ProductOption[];
  variants: ProductVariant[];
  images: ProductImage[];
  created_at: string;
  updated_at: string;
  visible: boolean;
  is_locked: boolean;
  blueprint_id: number;
  user_id: number;
  shop_id: number;
  print_provider_id: number;
  print_areas: PrintArea[];
  sales_channel_properties: unknown[];
}

export interface ProductVariant {
  id: number;
  sku: string;
  cost: number;
  price: number;
  title: string;
  grams: number;
  is_enabled: boolean;
  is_default: boolean;
  is_available: boolean;
  options: number[];
  quantity: number;
}

export interface ProductOption {
  name: string;
  type: string;
  values: ProductOptionValue[];
}

export interface ProductOptionValue {
  id: number;
  title: string;
  colors?: string[];
}

export interface ProductImage {
  src: string;
  variant_ids: number[];
  position: string;
  is_default: boolean;
  is_selected_for_publishing: boolean;
}

export interface PrintArea {
  variant_ids: number[];
  placeholders: PrintAreaPlaceholder[];
}

export interface PrintAreaPlaceholder {
  position: string;
  images: PrintAreaImage[];
}

export interface PrintAreaImage {
  id: string;
  name: string;
  type: string;
  height: number;
  width: number;
  x: number;
  y: number;
  scale: number;
  angle: number;
}

export interface CreateProductRequest {
  title: string;
  description: string;
  blueprint_id: number;
  print_provider_id: number;
  variants: Array<{
    id: number;
    price: number;
    is_enabled: boolean;
  }>;
  print_areas: PrintArea[];
  tags?: string[];
}

export interface UpdateProductRequest {
  title?: string;
  description?: string;
  variants?: Array<{
    id: number;
    price: number;
    is_enabled: boolean;
  }>;
  tags?: string[];
}

export interface PublishRequest {
  title: boolean;
  description: boolean;
  images: boolean;
  variants: boolean;
  tags: boolean;
  keyFeatures: boolean;
  shipping_template: boolean;
}
