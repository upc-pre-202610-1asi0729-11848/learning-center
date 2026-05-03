import {environment} from '../../../environments/environment';
import {ErrorHandlingEnabledBaseType} from '../../shared/infrastructure/error-handling-enabled-base-type';
import {HttpClient} from '@angular/common/http';
import {catchError, map, Observable} from 'rxjs';
import {SignUpAssembler} from './sign-up-assembler';
import {SignUpResource, SignUpResponse} from './sign-up-response';
import {SignUpCommand} from '../domain/model/sign-up.command';

const signUpApiEndpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderSignUpEndpointPath}`;

/**
 * Encapsulates IAM sign-up HTTP operations.
 */
export class SignUpApiEndpoint extends ErrorHandlingEnabledBaseType {
  /**
   * Creates an instance of SignUpApiEndpoint.
   * @param http The HttpClient for making HTTP requests.
   * @param assembler The assembler for converting between commands, requests, and responses.
   */
  constructor(private http: HttpClient, private assembler: SignUpAssembler) {
    super();
  }

  /**
   * Registers a new user in the remote IAM endpoint.
   * @param signUpCommand - Command containing sign-up credentials.
   * @returns Stream with the created user resource.
   */
  signUp(signUpCommand: SignUpCommand): Observable<SignUpResource> {
    const signUpRequest = this.assembler.toRequestFromCommand(signUpCommand);
    return this.http.post<SignUpResponse>(signUpApiEndpointUrl, signUpRequest).pipe(
      map(response => this.assembler.toResourceFromResponse(response)),
      catchError(this.handleError('Failed to sign-up'))
    );
  }


}
