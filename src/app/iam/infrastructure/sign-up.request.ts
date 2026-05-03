/**
 * HTTP request payload for sign-up (user registration) operations.
 *
 * @remarks
 * In DDD, this is an infrastructure-level request contract that defines the structure
 * of data sent to the sign-up API endpoint. It represents the wire format for
 * registration requests and is kept separate from domain commands to avoid
 * coupling the API contract to domain model changes.
 *
 * This interface is typically used internally by assemblers to transform from
 * domain commands to HTTP request payloads.
 *
 * @example
 * ```typescript
 * // HTTP POST /api/iam/sign-up
 * // Body:
 * {
 *   "username": "newuser@example.com",
 *   "password": "securepass123"
 * }
 * ```
 */
export interface SignUpRequest {
  /**
   * The username or email address for the new user account.
   * This must be unique within the system.
   */
  username: string;

  /**
   * The raw password for the new user account.
   *
   * @remarks
   * This is the plaintext password as provided by the user during registration.
   * The API endpoint is responsible for secure password handling:
   * - Validating password requirements (length, complexity, etc.)
   * - Hashing and salting before storage
   * - Secure transmission via HTTPS
   * - Logging restrictions to prevent exposure in audit trails
   */
  password: string;
}
