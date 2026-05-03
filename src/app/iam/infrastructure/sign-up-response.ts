import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a newly registered user returned by sign-up endpoint.
 *
 * @remarks
 * In DDD, this is an infrastructure-level resource contract that represents
 * the newly created user as it appears in HTTP communication, without domain logic.
 * Resources serve as the bridge between the domain layer and external systems.
 *
 * Unlike SignInResource, this does not include an authentication token.
 * The user must complete the sign-in flow to obtain an authentication session.
 */
export interface SignUpResource extends BaseResource {
  /**
   * The unique identifier assigned to the new user account.
   */
  id: number;
  /**
   * The username of the newly registered user account.
   */
  username: string;
}

/**
 * Response envelope returned by the sign-up endpoint.
 *
 * @remarks
 * This interface defines the structure of the API response from a successful
 * sign-up (user registration) operation. It provides the new user's ID and
 * username for confirmation, allowing the client to inform the user of
 * successful registration.
 *
 * After sign-up, the user must use the sign-in endpoint to authenticate
 * and obtain an authentication token.
 *
 * @example
 * ```typescript
 * // API returns:
 * // {
 * //   id: 43,
 * //   username: "jane.doe"
 * // }
 * ```
 */
export interface SignUpResponse extends BaseResponse, SignUpResource {}
