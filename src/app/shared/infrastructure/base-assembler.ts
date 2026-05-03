import {BaseEntity} from '../domain/model/base-entity';
import {BaseResource, BaseResponse} from './base-response';

/**
 * Assembler interface for converting between domain and infrastructure layers.
 *
 * @remarks
 * In Domain-Driven Design, an Assembler is responsible for converting between
 * domain entities and infrastructure resources (data models used in communication).
 * This pattern ensures the domain layer remains decoupled from external representations.
 *
 * The assembler handles three main transformations:
 * - Entity to Resource: For serialization in API responses
 * - Resource to Entity: For deserialization from API responses
 * - Response to Entities: For batch operations that return collections
 *
 * @typeParam TEntity - The domain entity type
 * @typeParam TResource - The infrastructure resource type
 * @typeParam TResponse - The API response envelope type
 *
 * @example
 * ```typescript
 * class UserAssembler implements BaseAssembler<User, UserResource, UserResponse> {
 *   toEntityFromResource(resource: UserResource): User { ... }
 *   toResourceFromEntity(entity: User): UserResource { ... }
 *   toEntitiesFromResponse(response: UserResponse): User[] { ... }
 * }
 * ```
 */
export interface BaseAssembler<TEntity extends BaseEntity, TResource extends BaseResource, TResponse extends BaseResponse> {
  /**
   * Converts an infrastructure resource into a domain entity.
   *
   * @param resource - The infrastructure resource to convert
   * @returns The constructed domain entity
   *
   * @remarks
   * This method is used when deserializing API responses into domain objects.
   * It performs the necessary data transformation and validation to ensure
   * the entity is in a valid domain state.
   */
  toEntityFromResource(resource: TResource): TEntity;

  /**
   * Converts a domain entity into an infrastructure resource.
   *
   * @param entity - The domain entity to convert
   * @returns The resource representation for API communication
   *
   * @remarks
   * This method is used when serializing domain entities for API requests.
   * It extracts only the necessary data for infrastructure communication,
   * excluding domain logic.
   */
  toResourceFromEntity(entity: TEntity): TResource;

  /**
   * Converts an API response envelope into an array of domain entities.
   *
   * @param response - The API response containing resource data
   * @returns An array of domain entities extracted from the response
   *
   * @remarks
   * This method handles batch operations, converting a response that may
   * contain multiple resources into an array of domain entities.
   */
  toEntitiesFromResponse(response: TResponse): TEntity[];
}
