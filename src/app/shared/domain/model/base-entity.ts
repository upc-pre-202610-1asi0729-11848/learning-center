/**
 * Base entity interface representing the core contract for domain entities.
 *
 * @remarks
 * In Domain-Driven Design, an entity is an object that has a unique identity
 * that persists throughout its lifecycle. All domain entities implement this
 * interface to ensure they can be uniquely identified within the system.
 *
 * @example
 * ```typescript
 * class User implements BaseEntity {
 *   id: number;
 *   // ... other properties
 * }
 * ```
 */
export interface BaseEntity {
  /**
   * The unique identifier for this entity.
   *
   * @remarks
   * This ID is immutable and persists throughout the entity's lifecycle.
   * It uniquely identifies this entity within its bounded context.
   */
  id: number;
}
