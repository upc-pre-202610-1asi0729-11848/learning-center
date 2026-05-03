import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a category for API communication.
 *
 * @remarks
 * In DDD, this is an infrastructure-level resource contract that represents
 * the category as it appears in HTTP communication, without domain logic.
 * Resources are distinct from domain entities, serving as the bridge between
 * the domain layer and external systems.
 */
export interface CategoryResource extends BaseResource {
  /**
   * The unique identifier for the category resource.
   */
  id: number;
  /**
   * The display name of the category.
   */
  name: string;
}

/**
 * Response envelope for category collection queries.
 *
 * @remarks
 * This interface defines the structure of API responses that return multiple categories.
 * The envelope pattern allows for consistent metadata handling across all collection endpoints.
 */
export interface CategoriesResponse extends BaseResponse {
  /**
   * Array of category resources included in the response.
   * Contains zero or more CategoryResource objects.
   */
  categories: CategoryResource[];
}
