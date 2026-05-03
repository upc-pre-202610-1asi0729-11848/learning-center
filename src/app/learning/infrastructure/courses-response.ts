import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a course for API communication.
 *
 * @remarks
 * In DDD, this is an infrastructure-level resource contract that represents
 * the course as it appears in HTTP communication, without domain logic.
 * Resources serve as the bridge between the domain layer (Course entity)
 * and external systems, ensuring proper separation of concerns.
 *
 * This resource includes the category association, but without the full
 * Category entity, just its ID reference for foreign key relationships.
 */
export interface CourseResource extends BaseResource {
  /**
   * Unique identifier for the course resource.
   */
  id: number;
  /**
   * Title of the course.
   */
  title: string;
  /**
   * Description of the course.
   */
  description: string;

  /**
   * Identifier for the category this course belongs to.
   * This is a foreign key reference to the Category aggregate.
   */
  categoryId: number;
}

/**
 * Response envelope for course collection queries.
 *
 * @remarks
 * This interface defines the structure of API responses that return multiple courses.
 * The envelope pattern allows for consistent metadata handling and potential future
 * additions like pagination or sorting metadata.
 *
 * @example
 * ```typescript
 * // API returns:
 * // {
 * //   courses: [
 * //     { id: 1, title: 'TypeScript', description: '...', categoryId: 5 },
 * //     { id: 2, title: 'Angular', description: '...', categoryId: 5 }
 * //   ]
 * // }
 * ```
 */
export interface CoursesResponse extends BaseResponse {
  /**
   * Array of course resources included in the response.
   * Contains zero or more CourseResource objects, each representing a course
   * that can be converted into a Course domain entity.
   */
  courses: CourseResource[];
}
