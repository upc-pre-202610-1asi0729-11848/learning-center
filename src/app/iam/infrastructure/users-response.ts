import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a user account for API communication.
 *
 * @remarks
 * In DDD, this is an infrastructure-level resource contract that represents
 * user account information as it appears in HTTP communication, without domain logic.
 * Resources serve as the bridge between the domain layer and external systems.
 *
 * This resource contains the core user identity information for queries
 * and listing operations.
 */
export interface UserResource extends BaseResource {
  /**
   * The unique identifier for the user account.
   */
  id: number;
  /**
   * The username of the user account.
   */
  username: string;
}

/**
 * Response envelope for user collection queries.
 *
 * @remarks
 * This interface defines the structure of API responses that return collections
 * of users. The envelope pattern allows for consistent metadata handling and
 * potential future additions like pagination or filtering metadata.
 *
 * @example
 * ```typescript
 * // API returns:
 * // {
 * //   users: [
 * //     { id: 1, username: "john.doe" },
 * //     { id: 2, username: "jane.doe" }
 * //   ]
 * // }
 * ```
 */
export interface UsersResponse extends BaseResponse {
  /**
   * Array of user resources included in the response.
   * Each UserResource represents a user account that can be converted into
   * a User domain entity.
   */
  users: UserResource[];
}
