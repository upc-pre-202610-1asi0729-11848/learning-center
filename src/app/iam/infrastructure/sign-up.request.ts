/**
 * Resource payload sent to the sign-up endpoint.
 */
export interface SignUpRequest{
  /** Username for the new account. */
  username: string;
  /** Raw password for the new account. */
  password: string;
}
