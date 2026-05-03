import {SignInResource, SignInResponse} from './sign-in-response';
import {SignInCommand} from '../domain/model/sign-in.command';
import {SignInRequest} from './sign-in.request';

/**
 * Assembler for converting between SignInCommand domain commands and infrastructure payloads.
 *
 * @remarks
 * In DDD, this assembler is responsible for transforming between:
 * - {@link SignInCommand} - Domain command with authentication intent
 * - {@link SignInRequest} - Infrastructure request payload for API communication
 * - {@link SignInResponse} - API response from successful authentication
 * - {@link SignInResource} - Infrastructure resource for application use
 *
 * This ensures the domain layer remains decoupled from infrastructure concerns
 * like HTTP request formats, API response envelopes, and serialization details.
 *
 * @example
 * ```typescript
 * const assembler = new SignInAssembler();
 *
 * // From domain command to HTTP request
 * const request = assembler.toRequestFromCommand(command);
 *
 * // From API response to application resource
 * const resource = assembler.toResourceFromResponse(response);
 * ```
 */
export class SignInAssembler {
  /**
   * Converts an API endpoint response into an application-level resource.
   *
   * @param response - Raw response object returned by the sign-in endpoint
   * @returns Mapped sign-in resource ready for application use
   *
   * @remarks
   * Extracts the necessary fields from the API response envelope and creates
   * a SignInResource that contains the authenticated user information and
   * the authentication token for establishing the session.
   *
   * This transformation allows the application layer to work with consistent,
   * application-specific resource structures independent of API response formats.
   */
  toResourceFromResponse(response: SignInResponse): SignInResource {
    return {
      id: response.id,
      username: response.username,
      token: response.token,
    } as SignInResource;
  }

  /**
   * Converts a domain sign-in command into the request payload for the API.
   *
   * @param command - Domain command with user credentials
   * @returns HTTP request payload in the format expected by the sign-in endpoint
   *
   * @remarks
   * Maps domain credentials from the command to the infrastructure request format.
   * This acts as an anti-corruption layer, ensuring the API contract remains
   * independent of domain model changes.
   *
   * The HTTP request body only includes the credentials needed for authentication,
   * stripping any additional transient properties from the command.
   */
  toRequestFromCommand(command: SignInCommand): SignInRequest {
    return {
      username: command.username,
      password: command.password,
    } as SignInRequest;
  }
}
