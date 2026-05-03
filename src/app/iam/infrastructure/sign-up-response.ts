import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

/**
 * Resource returned by the sign-up endpoint.
 */
export interface SignUpResource extends BaseResource {
  id: number;
  username: string;
}

/**
 * Response shape returned by the sign-up endpoint.
 */
export interface SignUpResponse extends BaseResponse, SignUpResource {}
