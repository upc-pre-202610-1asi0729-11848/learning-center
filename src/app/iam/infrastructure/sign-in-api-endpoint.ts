import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {SignInAssembler} from './sign-in-assembler';
import {SignInCommand} from '../domain/model/sign-in.command';
import {catchError, map, Observable} from 'rxjs';
import {SignInResource, SignInResponse} from './sign-in-response';
import {ErrorHandlingEnabledBaseType} from '../../shared/infrastructure/error-handling-enabled-base-type';

const signInApiEndpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderSignInEndpointPath}`;

/**
 * Encapsulates IAM sign-in HTTP operations.
 */
export class SignInApiEndpoint extends ErrorHandlingEnabledBaseType {
  /**
   * Creates an instance of SignInApiEndpoint.
   * @param http The HttpClient for making HTTP requests.
   * @param assembler The assembler for converting between commands, requests, and responses.
   */
  constructor(private http: HttpClient, private assembler: SignInAssembler) {
    super();
  }

  /**
   * Authenticates a user with the remote IAM endpoint.
   * @param signInCommand - Command containing username and password.
   * @returns Stream with the authenticated user resource and access token.
   */
  signIn(signInCommand: SignInCommand): Observable<SignInResource> {
    const signInRequest = this.assembler.toRequestFromCommand(signInCommand);
    return this.http.post<SignInResponse>(signInApiEndpointUrl, signInRequest).pipe(
      map(response => this.assembler.toResourceFromResponse(response)),
      catchError(this.handleError('Failed to sign-in'))
    );
  }


}
