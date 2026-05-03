import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

/**
 * Resource describing a user returned by IAM endpoints.
 */
export interface UserResource extends BaseResource {
  id: number;
  username: string;
}

/**
 * Response envelope for user collection queries.
 */
export interface UsersResponse extends BaseResponse {
  courses: UserResource[];
}
