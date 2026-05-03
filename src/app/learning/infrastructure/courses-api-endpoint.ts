import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {Course} from '../domain/model/couse.entity';
import {CourseResource, CoursesResponse} from './courses-response';
import {CourseAssembler} from './course-assembler';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

/**
 * HTTP endpoint client for course CRUD operations.
 *
 * @remarks
 * This endpoint encapsulates all HTTP communication for the Course aggregate
 * in the Learning domain. It extends {@link BaseApiEndpoint} to inherit
 * standard CRUD operation implementations with course-specific configuration.
 *
 * The endpoint handles:
 * - GET /courses - Retrieve all courses
 * - GET /courses/:id - Retrieve a specific course
 * - POST /courses - Create a new course
 * - PUT /courses/:id - Update an existing course
 * - DELETE /courses/:id - Delete a course
 *
 * Resource conversion is delegated to {@link CourseAssembler}.
 *
 * @example
 * ```typescript
 * const endpoint = new CoursesApiEndpoint(http);
 * endpoint.getAll().subscribe(courses => {
 *   // courses are fully hydrated Course domain aggregates
 * });
 * ```
 */
export class CoursesApiEndpoint extends BaseApiEndpoint<Course, CourseResource, CoursesResponse, CourseAssembler> {
  /**
   * Creates an instance of CoursesApiEndpoint.
   *
   * @param http - Angular HttpClient for making HTTP requests
   *
   * @remarks
   * Initializes the endpoint with the configured API base URL and the
   * courses endpoint path. The CourseAssembler is used to convert between
   * Course domain aggregates and CourseResource infrastructure objects.
   */
  constructor(http: HttpClient) {
    super(http, `${environment.platformProviderApiBaseUrl}${environment.platformProviderCoursesEndpointPath}`, new CourseAssembler());
  }
}
