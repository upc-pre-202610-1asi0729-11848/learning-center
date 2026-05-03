import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {Category} from '../domain/model/category.entity';
import {CategoriesResponse, CategoryResource} from './categories-response';

/**
 * Assembler for converting between Category domain entities and infrastructure resources.
 *
 * @remarks
 * In DDD, this assembler is responsible for transforming between:
 * - {@link Category} - Domain entity with business logic
 * - {@link CategoryResource} - Infrastructure resource for API communication
 * - {@link CategoriesResponse} - Response envelope from batch operations
 *
 * This ensures the domain layer remains decoupled from infrastructure concerns
 * like API response formats and serialization details.
 *
 * @example
 * ```typescript
 * const assembler = new CategoryAssembler();
 *
 * // From API response to domain entities
 * const categories = assembler.toEntitiesFromResponse(apiResponse);
 *
 * // From domain entity to API resource
 * const resource = assembler.toResourceFromEntity(category);
 * ```
 */
export class CategoryAssembler implements BaseAssembler<Category, CategoryResource, CategoriesResponse>{
  /**
   * Converts a collection response into an array of domain entities.
   *
   * @param response - The API response containing category resources
   * @returns Array of Category domain entities
   *
   * @remarks
   * Extracts the categories array from the response envelope and converts
   * each resource into a domain Category entity.
   */
  toEntitiesFromResponse(response: CategoriesResponse): Category[] {
    return response.categories.map(resource => this.toEntityFromResource(resource as CategoryResource));
  }

  /**
   * Converts an infrastructure resource into a domain entity.
   *
   * @param resource - The CategoryResource to convert
   * @returns A new Category domain entity
   *
   * @remarks
   * Maps resource properties directly to entity properties, ensuring the
   * returned entity is ready for use in the domain layer.
   */
  toEntityFromResource(resource: CategoryResource): Category {
    return new Category({ id: resource.id, name: resource.name});
  }

  /**
   * Converts a domain entity into an infrastructure resource.
   *
   * @param entity - The Category domain entity to convert
   * @returns A new CategoryResource suitable for API communication
   *
   * @remarks
   * Extracts only the necessary data for API serialization, excluding any
   * domain logic or transient properties.
   */
  toResourceFromEntity(entity: Category): CategoryResource {
    return { id: entity.id, name: entity.name } as CategoryResource;
  }

}
