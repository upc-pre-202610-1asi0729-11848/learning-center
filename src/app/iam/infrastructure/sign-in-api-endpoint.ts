import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {SignInAssembler} from './sign-in-assembler';
import {SignInCommand} from '../domain/model/sign-in.command';
import {catchError, map, Observable} from 'rxjs';
import {SignInResource, SignInResponse} from './sign-in-response';
import {ErrorHandlingEnabledBaseType} from '../../shared/infrastructure/error-handling-enabled-base-type';

const signInApiEndpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderSignInEndpointPath}`;

/**
 * HTTP endpoint client for user sign-in (authentication) operations.
 *
 * @remarks
 * This endpoint encapsulates all HTTP communication for the sign-in operation
 * in the IAM domain. It handles the authentication workflow by converting
 * domain commands to HTTP requests and responses to application resources.
 *
 * The endpoint:
 * - Accepts a SignInCommand from the application layer
 * - Converts it to an HTTP request using the SignInAssembler
 * - Sends the request to the remote sign-in endpoint
 * - Transforms the response back to a SignInResource
 * - Handles HTTP errors with appropriate error messages
 *
 * @example
 * ```typescript
 * const endpoint = new SignInApiEndpoint(http, assembler);
 * const command = new SignInCommand({ username: 'user@example.com', password: 'secret' });
 * endpoint.signIn(command).subscribe(
 *   resource => console.log('Authenticated as:', resource.username),
 *   error => console.error('Auth failed:', error.message)
 * );
 * ```
 */
export class SignInApiEndpoint extends ErrorHandlingEnabledBaseType {
  /**
   * Creates an instance of SignInApiEndpoint.
   *
   * @param http - Angular HttpClient for making HTTP requests
   * @param assembler - The assembler for converting between commands, requests, and responses
   *
   * @remarks
   * Initializes the endpoint with the configured sign-in API URL from the
   * environment settings and the provided assembler for data transformation.
   */
  constructor(private http: HttpClient, private assembler: SignInAssembler) {
    super();
  }

  /**
   * Authenticates a user with the remote IAM endpoint.
   *
   * @param signInCommand - Domain command containing user credentials (username and password)
   * @returns Observable stream emitting the authenticated user resource including access token
   *
   * @remarks
   * The sign-in process:
   * 1. Converts the SignInCommand to a SignInRequest using the assembler
   * 2. Sends an HTTP POST request to the sign-in endpoint with the request payload
   * 3. On success, converts the SignInResponse to a SignInResource for application use
   * 4. On failure, transforms the HTTP error into a meaningful error message
   *
   * The returned SignInResource contains:
   * - id: The authenticated user's unique identifier
   * - username: The authenticated user's username
   * - token: The authentication token (JWT or similar) for establishing authenticated sessions
   *
   * @example
   * ```typescript
   * const command = new SignInCommand({
   *   username: 'john.doe@example.com',
   *   password: 'securepass123'
   * });
   * endpoint.signIn(command).subscribe({
   *   next: (resource) => {
   *     console.log('Token:', resource.token);
   *     localStorage.setItem('authToken', resource.token);
   *   },
   *   error: (error) => console.error(error.message) // e.g., "Failed to sign-in: 401"
   * });
   * ```
   */
  signIn(signInCommand: SignInCommand): Observable<SignInResource> {
    const signInRequest = this.assembler.toRequestFromCommand(signInCommand);
    return this.http.post<SignInResponse>(signInApiEndpointUrl, signInRequest).pipe(
      map(response => this.assembler.toResourceFromResponse(response)),
      catchError(this.handleError('Failed to sign-in'))
    );
  }


}
