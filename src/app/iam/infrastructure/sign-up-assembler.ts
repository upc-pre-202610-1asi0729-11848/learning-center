import {SignUpRequest} from './sign-up.request';
import {SignUpCommand} from '../domain/model/sign-up.command';
import {SignUpResource, SignUpResponse} from './sign-up-response';

/**
 * Assembler for converting between SignUpCommand domain commands and infrastructure payloads.
 *
 * @remarks
 * In DDD, this assembler is responsible for transforming between:
 * - {@link SignUpCommand} - Domain command with registration intent
 * - {@link SignUpRequest} - Infrastructure request payload for API communication
 * - {@link SignUpResponse} - API response from successful registration
 * - {@link SignUpResource} - Infrastructure resource for application use
 *
 * This ensures the domain layer remains decoupled from infrastructure concerns
 * like HTTP request formats, API response envelopes, and serialization details.
 *
 * @example
 * ```typescript
 * const assembler = new SignUpAssembler();
 *
 * // From domain command to HTTP request
 * const request = assembler.toRequestFromCommand(command);
 *
 * // From API response to application resource
 * const resource = assembler.toResourceFromResponse(response);
 * ```
 */
export class SignUpAssembler {
  /**
   * Converts an API endpoint response into an application-level resource.
   *
   * @param response - Raw response object returned by the sign-up endpoint
   * @returns Mapped sign-up resource ready for application use
   *
   * @remarks
   * Extracts the necessary fields from the API response envelope and creates
   * a SignUpResource that contains the newly created user's ID and username.
   *
   * This transformation allows the application layer to work with consistent,
   * application-specific resource structures independent of API response formats.
   *
   * Note: Unlike sign-in, the sign-up response does not include an authentication
   * token. The user must complete the sign-in flow to establish a session.
   */
  toResourceFromResponse(response: SignUpResponse): SignUpResource {
    return {
      id: response.id,
      username: response.username,
    } as SignUpResource;
  }

  /**
   * Converts a domain sign-up command into the request payload for the API.
   *
   * @param command - Domain command with registration credentials
   * @returns HTTP request payload in the format expected by the sign-up endpoint
   *
   * @remarks
   * Maps domain credentials from the command to the infrastructure request format.
   * This acts as an anti-corruption layer, ensuring the API contract remains
   * independent of domain model changes.
   *
   * The HTTP request body only includes the credentials needed for account creation,
   * stripping any additional transient properties from the command.
   */
  toRequestFromCommand(command: SignUpCommand): SignUpRequest {
    return {
      username: command.username,
      password: command.password,
    } as SignUpRequest;
  }
}
