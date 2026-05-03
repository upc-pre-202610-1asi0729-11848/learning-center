import {BaseApi} from '../../shared/infrastructure/base-api';
import {CategoriesApiEndpoint} from './categories-api-endpoint';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Category} from '../domain/model/category.entity';
import {CoursesApiEndpoint} from "./courses-api-endpoint";
import {Course} from "../domain/model/couse.entity";
import {Observable} from "rxjs";

@Injectable({ providedIn: 'root'})
export class LearningApi extends BaseApi {
  private readonly categoriesEndpoint: CategoriesApiEndpoint;
  private readonly coursesEndpoint:     CoursesApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.categoriesEndpoint = new CategoriesApiEndpoint(http);
    this.coursesEndpoint =    new CoursesApiEndpoint(http);
  }

  getCategories() {
    return this.categoriesEndpoint.getAll();
  }

  getCategoryById(id: number) {
    return this.categoriesEndpoint.getById(id);
  }

  createCategory(category: Category) {
    return this.categoriesEndpoint.create(category);
  }

  updateCategory(category: Category, id: number) {
    return this.categoriesEndpoint.update(category, id);
  }

  deleteCategory(id: number) {
    return this.categoriesEndpoint.delete(id);
  }

  /**
   * Retrieves all courses.
   * @returns Stream with the course collection.
   */
  getCourses(): Observable<Course[]> {
    return this.coursesEndpoint.getAll();
  }

  /**
   * Retrieves a single course by ID.
   * @param id - The ID of the course.
   * @returns An Observable of the Course object.
   */
  getCourse(id: number): Observable<Course> {
    return this.coursesEndpoint.getById(id);
  }

  /**
   * Creates a new course.
   * @param course - The course to create.
   * @returns An Observable of the created Course object.
   */
  createCourse(course: Course): Observable<Course> {
    return this.coursesEndpoint.create(course);
  }

  /**
   * Updates an existing course.
   * @param course - The course to update.
   * @returns An Observable of the updated Course object.
   */
  updateCourse(course: Course): Observable<Course> {
    return this.coursesEndpoint.update(course, course.id);
  }

  /**
   * Deletes a course by ID.
   * @param id - The ID of the course to delete.
   * @returns An Observable of void.
   */
  deleteCourse(id: number): Observable<void> {
    return this.coursesEndpoint.delete(id);
  }


}
