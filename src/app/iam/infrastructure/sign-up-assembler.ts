import {SignUpRequest} from './sign-up.request';
import {SignUpCommand} from '../domain/model/sign-up.command';
import {SignUpResource, SignUpResponse} from './sign-up-response';

/**
 * Maps IAM sign-up commands and endpoint payloads.
 */
export class SignUpAssembler {
  /**
   * Converts the endpoint response into an application-level resource.
   * @param response - Raw response returned by the sign-up endpoint.
   * @returns Mapped sign-up resource.
   */
  toResourceFromResponse(response: SignUpResponse): SignUpResource {
    return {
      id: response.id,
      username: response.username,
    } as SignUpResource;
  }

  /**
   * Converts a sign-up command into the request payload expected by the API.
   * @param command - Domain command with account credentials.
   * @returns Mapped request payload.
   */
  toRequestFromCommand(command: SignUpCommand): SignUpRequest {
    return {
      username: command.username,
      password: command.password,
    } as SignUpRequest;
  }
}
