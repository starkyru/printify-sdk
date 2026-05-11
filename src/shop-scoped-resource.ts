import { BaseResource } from './base-resource.js';

export abstract class ShopScopedResource extends BaseResource {
  constructor(
    baseUrl: string,
    accessToken: string,
    protected readonly defaultShopId?: string,
    timeoutMs?: number,
  ) {
    super(baseUrl, accessToken, timeoutMs);
  }

  protected resolveShopId(shopId?: string): string {
    const id = shopId ?? this.defaultShopId;
    if (!id) {
      throw new Error(
        'shopId is required. Provide it per-call or set a default on PrintifyClient.',
      );
    }
    return id;
  }
}
