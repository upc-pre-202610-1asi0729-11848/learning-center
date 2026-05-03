import {CourseResource, CoursesResponse} from './courses-response';
import {Course} from '../domain/model/couse.entity';
import {BaseAssembler} from '../../shared/infrastructure/base-assembler';

/**
 * Assembler for converting between Course domain aggregates and infrastructure resources.
 *
 * @remarks
 * In DDD, this assembler is responsible for transforming between:
 * - {@link Course} - Domain aggregate root with business logic
 * - {@link CourseResource} - Infrastructure resource for API communication
 * - {@link CoursesResponse} - Response envelope from batch operations
 *
 * This ensures the domain layer remains decoupled from infrastructure concerns
 * like API response formats, serialization details, and wire protocol specifics.
 *
 * Note: The assembler does not handle Category entity association.
 * That responsibility is delegated to the application layer (e.g., LearningStore),
 * maintaining separation between infrastructure and application concerns.
 *
 * @example
 * ```typescript
 * const assembler = new CourseAssembler();
 *
 * // From API response to domain entities
 * const courses = assembler.toEntitiesFromResponse(apiResponse);
 *
 * // From domain entity to API resource
 * const resource = assembler.toResourceFromEntity(course);
 * ```
 */
export class CourseAssembler implements BaseAssembler<Course, CourseResource, CoursesResponse> {
  /**
   * Converts a collection response into an array of domain entities.
   *
   * @param response - The API response containing course resources
   * @returns Array of Course domain aggregates
   *
   * @remarks
   * Extracts the courses array from the response envelope and converts
   * each resource into a domain Course entity. The resulting courses will have
   * category ID references but may not have the full Category entities loaded.
   */
  toEntitiesFromResponse(response: CoursesResponse): Course[] {
    console.log(response);
    return response.courses.map(resource => this.toEntityFromResource(resource as CourseResource));
  }

  /**
   * Converts an infrastructure resource into a domain aggregate.
   *
   * @param resource - The CourseResource to convert
   * @returns A new Course domain aggregate
   *
   * @remarks
   * Maps resource properties directly to aggregate properties. The resulting
   * course will have the category ID set but the Category entity reference
   * will be null. Category associations should be resolved by the application layer.
   */
  toEntityFromResource(resource: CourseResource): Course {
    return new Course({
      id: resource.id,
      title: resource.title,
      description: resource.description,
      categoryId: resource.categoryId
    });
  }

  /**
   * Converts a domain aggregate into an infrastructure resource.
   *
   * @param entity - The Course domain aggregate to convert
   * @returns A new CourseResource suitable for API communication
   *
   * @remarks
   * Extracts only the core course data for API serialization, excluding:
   * - Domain logic and invariants
   * - The Category entity reference (only categoryId is serialized)
   * - Transient or derived properties
   */
  toResourceFromEntity(entity: Course): CourseResource {
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      categoryId: entity.categoryId
    } as CourseResource;
  }
}
