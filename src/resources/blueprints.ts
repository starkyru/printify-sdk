import { BaseResource } from '../base-resource.js';
import type {
  Blueprint,
  PrintProvider,
  VariantsResponse,
} from '../types/index.js';

export class BlueprintsResource extends BaseResource {
  /**
   * List all available blueprints.
   */
  async list(): Promise<Blueprint[]> {
    return this.httpGet<Blueprint[]>('/catalog/blueprints.json');
  }

  /**
   * Get a single blueprint by ID.
   */
  async get(blueprintId: number): Promise<Blueprint> {
    return this.httpGet<Blueprint>(`/catalog/blueprints/${blueprintId}.json`);
  }

  /**
   * Get all print providers for a blueprint.
   */
  async getPrintProviders(blueprintId: number): Promise<PrintProvider[]> {
    return this.httpGet<PrintProvider[]>(
      `/catalog/blueprints/${blueprintId}/print_providers.json`,
    );
  }

  /**
   * Get variants for a specific blueprint and print provider combination.
   */
  async getVariants(
    blueprintId: number,
    printProviderId: number,
  ): Promise<VariantsResponse> {
    return this.httpGet<VariantsResponse>(
      `/catalog/blueprints/${blueprintId}/print_providers/${printProviderId}/variants.json`,
    );
  }
}
