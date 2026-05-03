import {CourseResource, CoursesResponse} from './courses-response';
import {Course} from '../domain/model/couse.entity';
import {BaseAssembler} from '../../shared/infrastructure/base-assembler';

/**
 * Maps course entities to and from API resources.
 */
export class CourseAssembler implements BaseAssembler<Course, CourseResource, CoursesResponse> {
  /**
   * Converts a CoursesResponse to an array of Course entities.
   * @param response - The API response containing courses.
   * @returns An array of Course entities.
   */
  toEntitiesFromResponse(response: CoursesResponse): Course[] {
    console.log(response);
    return response.courses.map(resource => this.toEntityFromResource(resource as CourseResource));
  }

  /**
   * Converts a CourseResource to a Course entity.
   * @param resource - The resource to convert.
   * @returns The converted Course entity.
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
   * Converts a Course entity to a CourseResource.
   * @param entity - The entity to convert.
   * @returns The converted CourseResource.
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
