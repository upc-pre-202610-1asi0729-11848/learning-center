/**
 * HTTP request payload for sign-in (authentication) operations.
 *
 * @remarks
 * In DDD, this is an infrastructure-level request contract that defines the structure
 * of data sent to the sign-in API endpoint. It represents the wire format for
 * authentication requests and is kept separate from domain commands to avoid
 * coupling the API contract to domain model changes.
 *
 * This interface is typically used internally by assemblers to transform from
 * domain commands to HTTP request payloads.
 *
 * @example
 * ```typescript
 * // HTTP POST /api/iam/sign-in
 * // Body:
 * {
 *   "username": "john.doe@example.com",
 *   "password": "securepass123"
 * }
 * ```
 */
export interface SignInRequest {
  /**
   * The username or email address used to authenticate the account.
   * This uniquely identifies the user within the system.
   */
  username: string;

  /**
   * The raw password value provided by the user for authentication.
   *
   * @remarks
   * This is the plaintext password as entered by the user.
   * The API endpoint is responsible for secure password handling:
   * - Hashing and salting for comparison with stored credentials
   * - Secure transmission via HTTPS
   * - Logging restrictions to prevent exposure in audit trails
   */
  password: string;
}
