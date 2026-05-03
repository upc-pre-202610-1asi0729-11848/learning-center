import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {IamStore} from '../application/iam.store';

/**
 * HTTP interceptor that automatically adds IAM authentication credentials to outgoing requests.
 *
 * @remarks
 * In Angular, an interceptor is a service that can intercept HTTP requests and responses.
 * This interceptor implements the HttpInterceptorFn function type and:
 * - Reads the authentication token from the IamStore
 * - Adds the token to the Authorization header of outgoing requests (when authenticated)
 * - Uses the standard Bearer token authentication scheme
 * - Passes unmodified requests when no token is available (guest/public endpoints)
 *
 * This interceptor should be registered in the application configuration:
 * ```typescript
 * // app.config.ts
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideHttpClient(
 *       withInterceptors([iamInterceptor])
 *     ),
 *     // other providers
 *   ]
 * };
 * ```
 *
 * @param request - The outgoing HTTP request to be intercepted
 * @param next - The next handler in the interceptor chain
 * @returns The HTTP request handler chain, with the token added to headers if available
 *
 * @example
 * ```typescript
 * // When making requests, the interceptor automatically adds the token:
 * // GET /api/protected-resource
 * // Headers:
 * //   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 * ```
 */
export const iamInterceptor: HttpInterceptorFn = (request, next) => {
  const store = inject(IamStore);

  /**
   * Retrieve the authentication token from the IAM store.
   * The token is computed from localStorage when the user is signed in.
   */
  const token = store.currentToken();

  /**
   * Add the authentication token to the Authorization header if it exists.
   * If no token is available (user not signed in), the request is sent
   * without the header, allowing it to reach public/guest endpoints.
   *
   * Requests are cloned to avoid mutating the original request object,
   * which is important for potential retries or other interceptor chains.
   */
  const handledRequest = token
    ? request.clone({headers: request.headers.set('Authorization', `Bearer ${token}`)})
    : request;

  console.log(token);

  /**
   * Pass the (potentially modified) request to the next handler in the chain.
   * This continues the HTTP request/response processing pipeline.
   */
  return next(handledRequest);
};
