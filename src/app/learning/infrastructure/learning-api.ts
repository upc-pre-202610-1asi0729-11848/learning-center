import {BaseApi} from '../../shared/infrastructure/base-api';
import {CategoriesApiEndpoint} from './categories-api-endpoint';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Category} from '../domain/model/category.entity';
import {CoursesApiEndpoint} from "./courses-api-endpoint";
import {Course} from "../domain/model/couse.entity";
import {Observable} from "rxjs";

/**
 * Infrastructure service facade for Learning external API operations.
 *
 * @remarks
 * In Domain-Driven Design, this service acts as the infrastructure layer facade
 * coordinating access to Learning API resources through HTTP endpoints.
 * It orchestrates interactions between the application layer (entities/aggregates)
 * and the infrastructure layer (API endpoints).
 *
 * The LearningApi abstracts away HTTP details and endpoint management,
 * providing a clean interface for application services and use cases
 * that need to perform CRUD operations on categories and courses.
 *
 * @example
 * ```typescript
 * constructor(private learningApi: LearningApi) {}
 *
 * loadCategories() {
 *   this.learningApi.getCategories().subscribe(categories => {
 *     // Handle categories
 *   });
 * }
 * ```
 */
@Injectable({ providedIn: 'root'})
export class LearningApi extends BaseApi {
  /**
   * Endpoint client for category operations.
   * @private
   */
  private readonly categoriesEndpoint: CategoriesApiEndpoint;

  /**
   * Endpoint client for course operations.
   * @private
   */
  private readonly coursesEndpoint: CoursesApiEndpoint;

  /**
   * Creates an instance of LearningApi.
   *
   * @param http - Angular HttpClient for making HTTP requests
   *
   * @remarks
   * Initializes the API with endpoint clients for categories and courses.
   * Each endpoint client handles the HTTP communication and resource assembly
   * for its respective domain aggregate.
   */
  constructor(http: HttpClient) {
    super();
    this.categoriesEndpoint = new CategoriesApiEndpoint(http);
    this.coursesEndpoint = new CoursesApiEndpoint(http);
  }

  /**
   * Retrieves all categories from the remote API.
   *
   * @returns Observable stream emitting an array of Category domain entities
   *
   * @remarks
   * Fetches all available categories in the learning domain.
   * The returned categories are fully hydrated domain entities.
   */
  getCategories() {
    return this.categoriesEndpoint.getAll();
  }

  /**
   * Retrieves a single category by its ID.
   *
   * @param id - The unique identifier of the category to retrieve
   * @returns Observable stream emitting the requested Category entity
   *
   * @remarks
   * Fetches a specific category from the remote API.
   */
  getCategoryById(id: number) {
    return this.categoriesEndpoint.getById(id);
  }

  /**
   * Creates a new category in the remote system.
   *
   * @param category - The Category domain entity to create
   * @returns Observable stream emitting the created Category with its assigned ID
   *
   * @remarks
   * Persists a new category to the remote API. The returned category will have
   * the ID assigned by the server.
   */
  createCategory(category: Category) {
    return this.categoriesEndpoint.create(category);
  }

  /**
   * Updates an existing category.
   *
   * @param category - The Category domain entity with updated values
   * @param id - The unique identifier of the category to update
   * @returns Observable stream emitting the updated Category entity
   *
   * @remarks
   * Updates an existing category in the remote system with the provided values.
   */
  updateCategory(category: Category, id: number) {
    return this.categoriesEndpoint.update(category, id);
  }

  /**
   * Deletes a category by its ID.
   *
   * @param id - The unique identifier of the category to delete
   * @returns Observable stream that completes when deletion is confirmed
   *
   * @remarks
   * Removes a category from the remote system. This operation may cascade
   * to related courses depending on server-side constraints.
   */
  deleteCategory(id: number) {
    return this.categoriesEndpoint.delete(id);
  }

  /**
   * Retrieves all courses from the remote API.
   *
   * @returns Observable stream emitting an array of Course domain aggregates
   *
   * @remarks
   * Fetches all available courses in the learning domain.
   * The returned courses have their category IDs set but may not have
   * the full Category entities loaded. Category associations should be
   * resolved by the application layer.
   */
  getCourses(): Observable<Course[]> {
    return this.coursesEndpoint.getAll();
  }

  /**
   * Retrieves a single course by its ID.
   *
   * @param id - The unique identifier of the course to retrieve
   * @returns Observable stream emitting the requested Course aggregate
   *
   * @remarks
   * Fetches a specific course from the remote API.
   */
  getCourse(id: number): Observable<Course> {
    return this.coursesEndpoint.getById(id);
  }

  /**
   * Creates a new course in the remote system.
   *
   * @param course - The Course domain aggregate to create
   * @returns Observable stream emitting the created Course with its assigned ID
   *
   * @remarks
   * Persists a new course to the remote API. The returned course will have
   * the ID assigned by the server.
   */
  createCourse(course: Course): Observable<Course> {
    return this.coursesEndpoint.create(course);
  }

  /**
   * Updates an existing course.
   *
   * @param course - The Course domain aggregate with updated values
   * @returns Observable stream emitting the updated Course aggregate
   *
   * @remarks
   * Updates an existing course in the remote system with the provided values.
   * Uses the course's ID to determine which record to update.
   */
  updateCourse(course: Course): Observable<Course> {
    return this.coursesEndpoint.update(course, course.id);
  }

  /**
   * Deletes a course by its ID.
   *
   * @param id - The unique identifier of the course to delete
   * @returns Observable stream that completes when deletion is confirmed
   *
   * @remarks
   * Removes a course from the remote system.
   */
  deleteCourse(id: number): Observable<void> {
    return this.coursesEndpoint.delete(id);
  }


}
