import {SignInResource, SignInResponse} from './sign-in-response';
import {SignInCommand} from '../domain/model/sign-in.command';
import {SignInRequest} from './sign-in.request';

/**
 * Maps IAM sign-in commands and endpoint payloads.
 */
export class SignInAssembler {
  /**
   * Converts the endpoint response into an application-level resource.
   * @param response - Raw response returned by the sign-in endpoint.
   * @returns Mapped sign-in resource.
   */
  toResourceFromResponse(response: SignInResponse): SignInResource {
    return {
      id: response.id,
      username: response.username,
      token: response.token,
    } as SignInResource;
  }

  /**
   * Converts a sign-in command into the request payload expected by the API.
   * @param command - Domain command with credentials.
   * @returns Mapped request payload.
   */
  toRequestFromCommand(command: SignInCommand): SignInRequest {
    return {
      username: command.username,
      password: command.password,
    } as SignInRequest;
  }
}
