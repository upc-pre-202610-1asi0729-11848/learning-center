import {Injectable} from '@angular/core';
import {BaseApi} from '../../shared/infrastructure/base-api';
import {SignUpApiEndpoint} from './sign-up-api-endpoint';
import {SignInApiEndpoint} from './sign-in-api-endpoint';
import {HttpClient} from '@angular/common/http';
import {SignUpAssembler} from './sign-up-assembler';
import {SignInAssembler} from './sign-in-assembler';
import {SignUpCommand} from '../domain/model/sign-up.command';
import {Observable} from 'rxjs';
import {SignUpResource} from './sign-up-response';
import {SignInCommand} from '../domain/model/sign-in.command';
import {SignInResource} from './sign-in-response';

/**
 * Application service facade for IAM domain API operations.
 *
 * @remarks
 * In Domain-Driven Design, this service acts as the application layer facade
 * coordinating access to IAM domain resources through HTTP endpoints.
 * It orchestrates interactions between the domain layer (commands/entities)
 * and the infrastructure layer (API endpoints).
 *
 * The IamApi abstracts away HTTP details and endpoint management,
 * providing a clean interface for application services and use cases
 * that need to perform authentication operations (sign-in, sign-up).
 *
 * Each operation is delegated to specialized endpoint clients:
 * - SignUpApiEndpoint: Handles user registration
 * - SignInApiEndpoint: Handles user authentication
 *
 * @example
 * ```typescript
 * constructor(private iamApi: IamApi, private iamStore: IamStore) {}
 *
 * signIn(username: string, password: string) {
 *   const command = new SignInCommand({ username, password });
 *   this.iamApi.signIn(command).subscribe(resource => {
 *     console.log('Authenticated as:', resource.username);
 *   });
 * }
 * ```
 */
@Injectable({providedIn: 'root'})
export class IamApi extends BaseApi {
  /**
   * Endpoint client for sign-up operations.
   * @private
   */
  private readonly signUpEndpoint: SignUpApiEndpoint;

  /**
   * Endpoint client for sign-in operations.
   * @private
   */
  private readonly signInEndpoint: SignInApiEndpoint;

  /**
   * Creates an instance of IamApi.
   *
   * @param http - Angular HttpClient for making HTTP requests
   *
   * @remarks
   * Initializes the API with endpoint clients for sign-up and sign-in operations.
   * Each endpoint client is configured with its respective assembler for
   * command-to-request and response-to-resource transformation.
   */
  constructor(http: HttpClient) {
    super();
    this.signUpEndpoint = new SignUpApiEndpoint(http, new SignUpAssembler());
    this.signInEndpoint = new SignInApiEndpoint(http, new SignInAssembler());
  }

  /**
   * Registers a new user account in the IAM system.
   *
   * @param signUpCommand - Domain command containing registration credentials
   * @returns Observable stream emitting the created user resource with assigned ID
   *
   * @remarks
   * Initiates the user registration process:
   * 1. Transforms the domain command into an API request payload
   * 2. Sends the HTTP POST request to the sign-up endpoint
   * 3. Transforms the response back into a domain-usable resource
   *
   * On success, returns the newly created user's ID and username.
   * The user must then use sign-in to obtain an authentication token.
   *
   * @example
   * ```typescript
   * const command = new SignUpCommand({
   *   username: 'john.doe@example.com',
   *   password: 'securepass123'
   * });
   * this.iamApi.signUp(command).subscribe(
   *   resource => console.log('User created:', resource.id),
   *   error => console.error('Registration failed:', error)
   * );
   * ```
   */
  signUp(signUpCommand: SignUpCommand): Observable<SignUpResource>  {
    return this.signUpEndpoint.signUp(signUpCommand);
  }

  /**
   * Authenticates a user with the IAM system.
   *
   * @param signInCommand - Domain command containing authentication credentials
   * @returns Observable stream emitting the authenticated user resource and access token
   *
   * @remarks
   * Initiates the authentication process:
   * 1. Transforms the domain command into an API request payload
   * 2. Sends the HTTP POST request to the sign-in endpoint
   * 3. Transforms the response back into a domain-usable resource
   *
   * On success, returns the authenticated user's information along with an
   * authentication token (typically JWT) that should be used for subsequent
   * authenticated requests to protected resources.
   *
   * @example
   * ```typescript
   * const command = new SignInCommand({
   *   username: 'john.doe@example.com',
   *   password: 'securepass123'
   * });
   * this.iamApi.signIn(command).subscribe(
   *   resource => console.log('Authenticated:', resource.username, 'Token:', resource.token),
   *   error => console.error('Authentication failed:', error)
   * );
   * ```
   */
  signIn(signInCommand: SignInCommand): Observable<SignInResource> {
    return this.signInEndpoint.signIn(signInCommand);
  }
}
