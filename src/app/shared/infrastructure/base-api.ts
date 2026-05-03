/**
 * Abstract base class for API service implementations.
 *
 * @remarks
 * This class serves as the foundation for all infrastructure service layer APIs.
 * In DDD, an infrastructure API offers access to infrastructure services to
 * application layer.
 *
 * Subclasses should extend this class to define infrastructure-specific API operations
 * while leveraging shared infrastructure patterns and error handling strategies.
 *
 * @example
 * ```typescript
 * @Injectable({providedIn: 'root'})
 * export class UserApi extends BaseApi {
 *   // Implementation of user-specific API operations
 * }
 * ```
 */
export abstract class BaseApi {

}
