import {BaseEntity} from '../domain/model/base-entity';
import {BaseResource, BaseResponse} from './base-response';
import {BaseAssembler} from './base-assembler';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map, Observable, throwError} from 'rxjs';

/**
 * Abstract base class for API endpoint clients implementing CRUD operations.
 *
 * @remarks
 * In Domain-Driven Design infrastructure layer, this class encapsulates HTTP
 * communication for a specific resource type. It coordinates with assemblers
 * to convert between domain entities and infrastructure resources.
 *
 * Each concrete endpoint implementation represents a specific API route and
 * manages all HTTP operations (GET, POST, PUT, DELETE) for that resource.
 *
 * @typeParam TEntity - The domain entity type this endpoint manages
 * @typeParam TResource - The infrastructure resource type for API communication
 * @typeParam TResponse - The API response envelope type
 * @typeParam TAssembler - The assembler type for entity-resource conversion
 *
 * @example
 * ```typescript
 * export class UserApiEndpoint extends BaseApiEndpoint<User, UserResource, UsersResponse, UserAssembler> {
 *   constructor(http: HttpClient) {
 *     super(http, 'https://api.example.com/users', new UserAssembler());
 *   }
 * }
 * ```
 */
export abstract class BaseApiEndpoint<
  TEntity extends BaseEntity,
  TResource extends BaseResource,
  TResponse extends BaseResponse,
  TAssembler extends BaseAssembler<TEntity, TResource, TResponse>
> {
  /**
   * Creates an instance of BaseApiEndpoint.
   *
   * @param http - Angular HttpClient for making HTTP requests
   * @param endpointUrl - The base URL for this endpoint
   * @param assembler - The assembler for entity-resource conversion
   */
  protected constructor(
    protected http: HttpClient,
    protected endpointUrl: string,
    protected assembler: TAssembler
  ) {}

  /**
   * Retrieves all entities from the endpoint.
   *
   * @returns Observable stream emitting an array of domain entities
   *
   * @remarks
   * This method handles both array-based and envelope-based responses:
   * - If the endpoint returns an array directly, each element is converted to an entity
   * - If the endpoint returns an envelope response, the assembler extracts the collection
   *
   * Errors are caught and transformed into domain-specific error messages.
   */
  getAll(): Observable<TEntity[]> {
    return this.http.get<TResponse | TResource[]>(this.endpointUrl).pipe(
      map(response => {
       console.log(response);
       if (Array.isArray(response))
        return response.map(resource => this.assembler.toEntityFromResource(resource));
       return this.assembler.toEntitiesFromResponse(response as TResponse);
      }),
      catchError(this.handleError('Failed to fetch entities'))
    );
  }

  /**
   * Handles HTTP errors and transforms them into domain-specific error messages.
   *
   * @param operation - Human-readable name of the failed operation
   * @returns Function that transforms HttpErrorResponse into an error observable
   *
   * @remarks
   * This method provides consistent error handling across all HTTP operations:
   * - 404 errors are identified as "Resource not found"
   * - Client errors (ErrorEvent) include the original error message
   * - Server errors include the HTTP status code
   *
   * The error message format is: "${operation}: ${details}"
   */
  protected handleError(operation: string) {
    return (error: HttpErrorResponse): Observable<never> => {
      let errorMessage = operation;
      if (error.status === 404) {
        errorMessage = `${operation}: Resource not found`;
      } else if (error.error instanceof ErrorEvent) {
        errorMessage = `${operation}: ${error.error.message}`;
      } else {
        errorMessage = `${operation}: ${error.status || 'Unexpected error'}`;
      }
      return throwError(() => new Error(errorMessage));
    }
  }

  /**
   * Retrieves a single entity by its ID.
   *
   * @param id - The unique identifier of the entity to retrieve
   * @returns Observable stream emitting the requested domain entity
   *
   * @throws Error if the entity is not found (404) or request fails
   *
   * @remarks
   * Constructs the URL as: `${endpointUrl}/${id}`
   */
  getById(id: number): Observable<TEntity> {
    return this.http.get<TResource>(`${this.endpointUrl}/${id}`).pipe(
      map(resource => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError(`Failed to fetch entity with id ${id}`))
    );
  }

  /**
   * Creates a new entity in the remote system.
   *
   * @param entity - The domain entity to create
   * @returns Observable stream emitting the created entity with its assigned ID
   *
   * @remarks
   * The process is:
   * 1. Convert the entity to a resource using the assembler
   * 2. POST the resource to the endpoint
   * 3. Convert the response back to a domain entity
   * 4. Return the persisted entity with its ID assigned by the server
   */
  create(entity: TEntity): Observable<TEntity> {
    const resource = this.assembler.toResourceFromEntity(entity);
    return this.http.post<TResource>(this.endpointUrl, resource).pipe(
      map(created => this.assembler.toEntityFromResource(created)),
      catchError(this.handleError('Failed to create entity'))
    );
  }

  /**
   * Updates an existing entity in the remote system.
   *
   * @param entity - The domain entity with updated values
   * @param id - The unique identifier of the entity to update
   * @returns Observable stream emitting the updated domain entity
   *
   * @remarks
   * The process is:
   * 1. Convert the entity to a resource using the assembler
   * 2. PUT the resource to the endpoint at `${endpointUrl}/${id}`
   * 3. Convert the response back to a domain entity
   * 4. Return the updated entity as confirmed by the server
   */
  update(entity: TEntity, id: number): Observable<TEntity> {
    const resource = this.assembler.toResourceFromEntity(entity);
    return this.http.put<TResource>(`${this.endpointUrl}/${id}`, resource).pipe(
      map(updated => this.assembler.toEntityFromResource(updated)),
      catchError(this.handleError(`Failed to update entity with id ${id}`))
    );
  }

  /**
   * Deletes an entity from the remote system.
   *
   * @param id - The unique identifier of the entity to delete
   * @returns Observable stream that completes when deletion is confirmed
   *
   * @remarks
   * Sends a DELETE request to `${endpointUrl}/${id}`.
   * The observable emits void upon successful deletion.
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpointUrl}/${id}`).pipe(
      catchError(this.handleError(`Failed to delete entity with id ${id}`))
    );
  }
}
