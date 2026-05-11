import { ShopScopedResource } from '../shop-scoped-resource.js';
import { assertSafeStringId } from '../validation.js';
import type {
  Product,
  ProductImage,
  CreateProductRequest,
  UpdateProductRequest,
  PublishRequest,
  PaginatedResponse,
} from '../types/index.js';

export class ProductsResource extends ShopScopedResource {
  /**
   * List all products for a shop.
   */
  async list(shopId?: string): Promise<PaginatedResponse<Product>> {
    const id = this.resolveShopId(shopId);
    assertSafeStringId(id, 'shopId');
    return this.httpGet<PaginatedResponse<Product>>(
      `/shops/${id}/products.json`,
    );
  }

  /**
   * Get a single product by ID.
   */
  async get(productId: string, shopId?: string): Promise<Product> {
    const id = this.resolveShopId(shopId);
    assertSafeStringId(id, 'shopId');
    assertSafeStringId(productId, 'productId');
    return this.httpGet<Product>(`/shops/${id}/products/${productId}.json`);
  }

  /**
   * Create a new product.
   */
  async create(
    data: CreateProductRequest,
    shopId?: string,
  ): Promise<Product> {
    const id = this.resolveShopId(shopId);
    assertSafeStringId(id, 'shopId');
    return this.httpPost<Product>(`/shops/${id}/products.json`, data);
  }

  /**
   * Update an existing product.
   */
  async update(
    productId: string,
    data: UpdateProductRequest,
    shopId?: string,
  ): Promise<Product> {
    const id = this.resolveShopId(shopId);
    assertSafeStringId(id, 'shopId');
    assertSafeStringId(productId, 'productId');
    return this.httpPut<Product>(
      `/shops/${id}/products/${productId}.json`,
      data,
    );
  }

  /**
   * Delete a product.
   */
  async delete(productId: string, shopId?: string): Promise<void> {
    const id = this.resolveShopId(shopId);
    assertSafeStringId(id, 'shopId');
    assertSafeStringId(productId, 'productId');
    await this.httpDelete(`/shops/${id}/products/${productId}.json`);
  }

  /**
   * Publish a product to the connected sales channel.
   */
  async publish(
    productId: string,
    publishData: PublishRequest,
    shopId?: string,
  ): Promise<void> {
    const id = this.resolveShopId(shopId);
    assertSafeStringId(id, 'shopId');
    assertSafeStringId(productId, 'productId');
    await this.httpPost(
      `/shops/${id}/products/${productId}/publish.json`,
      publishData,
    );
  }

  /**
   * Get product mockup images.
   */
  async getImages(
    productId: string,
    shopId?: string,
  ): Promise<ProductImage[]> {
    const id = this.resolveShopId(shopId);
    assertSafeStringId(id, 'shopId');
    assertSafeStringId(productId, 'productId');
    return this.httpGet<ProductImage[]>(
      `/shops/${id}/products/${productId}/images.json`,
    );
  }
}
