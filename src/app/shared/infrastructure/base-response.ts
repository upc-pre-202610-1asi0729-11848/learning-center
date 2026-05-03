/**
 * Base resource interface representing the contract for infrastructure data models.
 *
 * @remarks
 * In DDD, a Resource is an infrastructure-level representation of domain entities
 * used in API communication. It includes serializable data without domain logic.
 * Resources are the bridge between the domain layer and external systems.
 *
 * This interface defines the minimal contract that all resources must implement.
 */
export interface BaseResource {
  /**
   * Unique identifier for the resource.
   * Maps to the entity's ID in the domain layer.
   */
  id: number;
}

/**
 * Base response interface representing the contract for API response envelopes.
 *
 * @remarks
 * In REST APIs following DDD patterns, responses wrap resources in an envelope.
 * This base interface serves as the contract for all response types, allowing
 * for consistent response handling across the infrastructure layer.
 *
 * Implementations may extend this interface to include metadata, status information,
 * or additional context specific to their use case.
 */
export interface BaseResponse {}
