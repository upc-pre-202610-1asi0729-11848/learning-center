/**
 * Resource payload sent to the sign-in endpoint.
 */
export interface SignInRequest {
  /** Username used to authenticate the account. */
  username: string;
  /** Raw password value for the sign-in request. */
  password: string;
}
