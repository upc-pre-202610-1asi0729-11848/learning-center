import {environment} from '../../../environments/environment';
import {ErrorHandlingEnabledBaseType} from '../../shared/infrastructure/error-handling-enabled-base-type';
import {HttpClient} from '@angular/common/http';
import {catchError, map, Observable} from 'rxjs';
import {SignUpAssembler} from './sign-up-assembler';
import {SignUpResource, SignUpResponse} from './sign-up-response';
import {SignUpCommand} from '../domain/model/sign-up.command';

const signUpApiEndpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderSignUpEndpointPath}`;

/**
 * HTTP endpoint client for user sign-up (registration) operations.
 *
 * @remarks
 * This endpoint encapsulates all HTTP communication for the sign-up operation
 * in the IAM domain. It handles the user registration workflow by converting
 * domain commands to HTTP requests and responses to application resources.
 *
 * The endpoint:
 * - Accepts a SignUpCommand from the application layer
 * - Converts it to an HTTP request using the SignUpAssembler
 * - Sends the request to the remote sign-up endpoint
 * - Transforms the response back to a SignUpResource
 * - Handles HTTP errors with appropriate error messages
 *
 * Note: This endpoint does not provide authentication. After successful
 * registration, users must use the sign-in endpoint to obtain auth tokens.
 *
 * @example
 * ```typescript
 * const endpoint = new SignUpApiEndpoint(http, assembler);
 * const command = new SignUpCommand({ username: 'newuser@example.com', password: 'newpass' });
 * endpoint.signUp(command).subscribe(
 *   resource => console.log('Account created for:', resource.username),
 *   error => console.error('Registration failed:', error.message)
 * );
 * ```
 */
export class SignUpApiEndpoint extends ErrorHandlingEnabledBaseType {
  /**
   * Creates an instance of SignUpApiEndpoint.
   *
   * @param http - Angular HttpClient for making HTTP requests
   * @param assembler - The assembler for converting between commands, requests, and responses
   *
   * @remarks
   * Initializes the endpoint with the configured sign-up API URL from the
   * environment settings and the provided assembler for data transformation.
   */
  constructor(private http: HttpClient, private assembler: SignUpAssembler) {
    super();
  }

  /**
   * Registers a new user in the remote IAM endpoint.
   *
   * @param signUpCommand - Domain command containing new user credentials
   * @returns Observable stream emitting the created user resource
   *
   * @remarks
   * The sign-up process:
   * 1. Converts the SignUpCommand to a SignUpRequest using the assembler
   * 2. Sends an HTTP POST request to the sign-up endpoint with the request payload
   * 3. On success, converts the SignUpResponse to a SignUpResource for application use
   * 4. On failure, transforms the HTTP error into a meaningful error message
   *
   * The returned SignUpResource contains:
   * - id: The newly created user's unique identifier
   * - username: The newly created user's username
   *
   * The response does NOT include an authentication token. The user must
   * complete the sign-in operation to establish an authenticated session.
   *
   * @example
   * ```typescript
   * const command = new SignUpCommand({
   *   username: 'newuser@example.com',
   *   password: 'securepass123'
   * });
   * endpoint.signUp(command).subscribe({
   *   next: (resource) => {
   *     console.log('Account created with ID:', resource.id);
   *     // Redirect to sign-in page
   *   },
   *   error: (error) => console.error(error.message) // e.g., "Failed to sign-up: 422"
   * });
   * ```
   */
  signUp(signUpCommand: SignUpCommand): Observable<SignUpResource> {
    const signUpRequest = this.assembler.toRequestFromCommand(signUpCommand);
    return this.http.post<SignUpResponse>(signUpApiEndpointUrl, signUpRequest).pipe(
      map(response => this.assembler.toResourceFromResponse(response)),
      catchError(this.handleError('Failed to sign-up'))
    );
  }


}
