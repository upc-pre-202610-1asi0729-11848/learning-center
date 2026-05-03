import {Category} from '../domain/model/category.entity';
import {computed, Injectable, Signal, signal} from '@angular/core';
import {LearningApi} from '../infrastructure/learning-api';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {retry} from 'rxjs';
import {Course} from "../domain/model/couse.entity";

/**
 * Application service managing learning domain state and orchestration.
 *
 * @remarks
 * In Domain-Driven Design, this is an application service (store) that:
 * - Manages the state of categories and courses in memory
 * - Coordinates interactions with the infrastructure layer (LearningApi)
 * - Provides reactive state queries via Angular signals
 * - Handles error propagation and loading states
 *
 * The store maintains two main aggregates:
 * - Categories: Collections that organize courses
 * - Courses: The primary learning resources
 *
 * State is exposed through computed signals for reactive Angular templates
 * and components using Angular's signal-based reactivity.
 *
 * @example
 * ```typescript
 * constructor(private learningStore: LearningStore) {}
 *
 * get categories() {
 *   return this.learningStore.categories;
 * }
 *
 * addCategory(category: Category) {
 *   this.learningStore.addCategory(category);
 * }
 * ```
 */
@Injectable({providedIn: 'root'})
export class LearningStore {
  /**
   * Signal containing all loaded categories.
   * @private
   */
  private readonly categoriesSignal = signal<Category[]>([]);

  /**
   * Signal containing all loaded courses.
   * @private
   */
  private readonly coursesSignal = signal<Course[]>([]);

  /**
   * Readonly signal for accessing all categories.
   * Emits an array of Category domain entities.
   */
  readonly categories = this.categoriesSignal.asReadonly();

  /**
   * Readonly signal for accessing all courses.
   * Emits an array of Course domain aggregates.
   */
  readonly courses = this.coursesSignal.asReadonly();

  /**
   * Computed signal for the total number of categories.
   * Automatically updates when categories change.
   */
  readonly categoriesCount = computed(() => this.categories().length);

  /**
   * Computed signal for the total number of courses.
   * Automatically updates when courses change.
   */
  readonly courseCount = computed(() => this.courses().length);

  /**
   * Signal indicating whether data is currently loading.
   * @private
   */
  private readonly loadingSignal = signal<boolean>(false);

  /**
   * Readonly signal for accessing the loading state.
   * True when any operation (load, create, update, delete) is in progress.
   */
  readonly loading = this.loadingSignal.asReadonly();

  /**
   * Signal containing the most recent error message, if any.
   * @private
   */
  private readonly errorSignal = signal<string | null>(null);

  /**
   * Readonly signal for accessing the current error state.
   * Contains an error message if the last operation failed, null otherwise.
   */
  readonly error = this.errorSignal.asReadonly();

  /**
   * Creates an instance of LearningStore.
   *
   * @param learningApi - The infrastructure API service for learning operations
   *
   * @remarks
   * Initializes the store and automatically loads both categories and courses
   * from the remote API upon construction.
   */
  constructor(private learningApi: LearningApi) {
    this.loadCategories();
    this.loadCourses();
  }

  /**
   * Formats error messages for display to users or logs.
   *
   * @param error - The error object to format
   * @param fallback - The fallback message if error format is unknown
   * @returns A human-readable error message
   *
   * @remarks
   * Extracts meaningful error messages from various error types.
   * Specifically detects "Resource not found" errors for improved feedback.
   *
   * @private
   */
  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Resource not found') ? `${fallback}: Not found` : error.message;
    }
    return fallback;
  }

  /**
   * Loads all categories from the remote API and updates store state.
   *
   * @remarks
   * Fetches categories from the infrastructure layer and updates the internal
   * signal. Sets loading state during the operation and clears any previous errors.
   *
   * This is called automatically on store initialization but can also be
   * invoked manually to refresh the category list.
   */
  loadCategories() {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.learningApi.getCategories().pipe(takeUntilDestroyed()).subscribe({
      next: categories => {
        this.categoriesSignal.set(categories);
        this.loadingSignal.set(false);
        this.errorSignal.set(null);
      },
      error: err => {
        this.loadingSignal.set(false);
        this.errorSignal.set(this.formatError(err, 'Failed to load categories'));
      }
    });
  }

  /**
   * Retrieves a single category by its ID.
   *
   * @param id - The unique identifier of the category to retrieve
   * @returns A computed signal that emits the matching Category or undefined
   *
   * @remarks
   * Returns a reactive signal that automatically updates when the categories
   * collection changes. This is useful for component-level queries that need
   * to react to category changes.
   *
   * @example
   * ```typescript
   * readonly category = this.learningStore.getCategoryById(5);
   * // In template: {{ category()?.name }}
   * ```
   */
  getCategoryById(id: number): Signal<Category | undefined> {
    return computed(() => id
      ? this.categories().find(category => category.id === id) : undefined)
  }

  /**
   * Adds a new category to the store and remote system.
   *
   * @param category - The Category domain entity to create
   *
   * @remarks
   * Creates a new category via the API and adds it to the in-memory store.
   * Uses exponential backoff retry strategy with 2 attempts on failure.
   * Sets loading state during operation and updates error state on failure.
   *
   * @example
   * ```typescript
   * const newCategory = new Category({ id: 0, name: 'Web Development' });
   * this.learningStore.addCategory(newCategory);
   * ```
   */
  addCategory(category: Category): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.learningApi.createCategory(category).pipe(retry(2)).subscribe({
      next: createdCategory => {
        this.categoriesSignal.update(categories => [...categories, createdCategory]);
        this.loadingSignal.set(false);
        this.errorSignal.set(null);
      },
      error: err => {
        this.loadingSignal.set(false);
        this.errorSignal.set(this.formatError(err, 'Failed to create category'));
      }
    });
  }

  /**
   * Updates an existing category in the store and remote system.
   *
   * @param updatedCategory - The Category domain entity with updated values
   *
   * @remarks
   * Updates a category via the API and replaces it in the in-memory store.
   * Uses exponential backoff retry strategy with 2 attempts on failure.
   * Sets loading state during operation and updates error state on failure.
   *
   * @example
   * ```typescript
   * category.name = 'Advanced Web Development';
   * this.learningStore.updateCategory(category);
   * ```
   */
  updateCategory(updatedCategory: Category): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.learningApi.updateCategory(updatedCategory, updatedCategory.id).pipe(retry(2)).subscribe({
      next: updatedCategory => {
        this.categoriesSignal.update(categories => categories.map(category => category.id === updatedCategory.id ? updatedCategory : category));
        this.loadingSignal.set(false);
        this.errorSignal.set(null);
      },
      error: err => {
        this.loadingSignal.set(false);
        this.errorSignal.set(this.formatError(err, 'Failed to update category'));
      }
    })
  }

  /**
   * Deletes a category from the store and remote system.
   *
   * @param id - The unique identifier of the category to delete
   *
   * @remarks
   * Deletes a category via the API and removes it from the in-memory store.
   * Uses exponential backoff retry strategy with 2 attempts on failure.
   * Sets loading state during operation and updates error state on failure.
   *
   * Note: Cascading delete behavior (e.g., related courses) depends on
   * server-side constraints and configuration.
   *
   * @example
   * ```typescript
   * this.learningStore.deleteCategory(5);
   * ```
   */
  deleteCategory(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.learningApi.deleteCategory(id).pipe(retry(2)).subscribe({
      next: () => {
        this.categoriesSignal.update(categories => categories.filter(category => category.id !== id));
        this.loadingSignal.set(false);
        this.errorSignal.set(null);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to delete category'));
        this.loadingSignal.set(false);
      }
    })
  }

  /**
   * Loads all courses from the remote API and updates store state.
   *
   * @remarks
   * Fetches courses from the infrastructure layer and updates the internal signal.
   * After loading, automatically executes {@link assignCategoriesToCourses}
   * to associate loaded courses with their category entities.
   *
   * Sets loading state during the operation and clears any previous errors.
   *
   * This is called automatically on store initialization but can also be
   * invoked manually to refresh the courses list.
   *
   * @private
   */
  private loadCourses(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.learningApi.getCourses().pipe(takeUntilDestroyed()).subscribe({
      next: courses => {
        console.log(courses);
        this.coursesSignal.set(courses);
        this.loadingSignal.set(false);
        this.errorSignal.set(null);
        this.assignCategoriesToCourses();


      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load courses'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Retrieves a single course by its ID.
   *
   * @param id - The unique identifier of the course to retrieve
   * @returns A computed signal that emits the matching Course or undefined
   *
   * @remarks
   * Returns a reactive signal that automatically updates when the courses
   * collection changes. This is useful for component-level queries that need
   * to react to course changes.
   *
   * @example
   * ```typescript
   * readonly course = this.learningStore.getCourseById(10);
   * // In template: {{ course()?.title }}
   * ```
   */
  getCourseById(id: number): Signal<Course | undefined> {
    return computed(() => id ? this.courses().find(c => c.id === id) : undefined);
  }

  /**
   * Adds a new course to the store and remote system.
   *
   * @param course - The Course domain aggregate to create
   *
   * @remarks
   * Creates a new course via the API and adds it to the in-memory store.
   * After creation, attempts to populate the course's Category reference
   * using {@link assignCategoryToCourse}.
   *
   * Uses exponential backoff retry strategy with 2 attempts on failure.
   * Sets loading state during operation and updates error state on failure.
   *
   * @example
   * ```typescript
   * const newCourse = new Course({
   *   id: 0,
   *   title: 'React Fundamentals',
   *   description: '...',
   *   categoryId: 3
   * });
   * this.learningStore.addCourse(newCourse);
   * ```
   */
  addCourse(course: Course): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.learningApi.createCourse(course).pipe(retry(2)).subscribe({
      next: createdCourse => {
        createdCourse = this.assignCategoryToCourse(course);
        this.coursesSignal.update(courses => [...courses, createdCourse]);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to create course'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Updates an existing course in the store and remote system.
   *
   * @param updatedCourse - The Course domain aggregate with updated values
   *
   * @remarks
   * Updates a course via the API and replaces it in the in-memory store.
   * After update, attempts to populate the course's Category reference
   * using {@link assignCategoryToCourse}.
   *
   * Uses exponential backoff retry strategy with 2 attempts on failure.
   * Sets loading state during operation and updates error state on failure.
   *
   * @example
   * ```typescript
   * course.title = 'Advanced React';
   * this.learningStore.updateCourse(course);
   * ```
   */
  updateCourse(updatedCourse: Course): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.learningApi.updateCourse(updatedCourse).pipe(retry(2)).subscribe({
      next: course => {
        course = this.assignCategoryToCourse(course);
        this.coursesSignal.update(courses =>
            courses.map(c => c.id === course.id ? course : c)
        );
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to update course'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Deletes a course from the store and remote system.
   *
   * @param id - The unique identifier of the course to delete
   *
   * @remarks
   * Deletes a course via the API and removes it from the in-memory store.
   * Uses exponential backoff retry strategy with 2 attempts on failure.
   * Sets loading state during operation and updates error state on failure.
   *
   * @example
   * ```typescript
   * this.learningStore.deleteCourse(10);
   * ```
   */
  deleteCourse(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.learningApi.deleteCourse(id).pipe(retry(2)).subscribe({
      next: () => {
        this.coursesSignal.update(courses => courses.filter(c => c.id !== id));
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to delete course'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Populates the Category entity references for all courses.
   *
   * @remarks
   * Iterates through all courses and populates their category property
   * by looking up the category entity from the categories signal.
   * This bridges the gap between the category ID and the full entity object.
   *
   * Useful after loading courses to ensure complete object graphs for easier
   * component usage.
   *
   * @private
   */
  private assignCategoriesToCourses(): void {
    this.coursesSignal.update(courses => courses.map(course => this.assignCategoryToCourse(course)));
  }

  /**
   * Populates the Category entity reference for a single course.
   *
   * @param course - The Course aggregate to populate
   * @returns The same course with its category property populated
   *
   * @remarks
   * Uses {@link getCategoryById} to locate the Category entity matching the
   * course's categoryId, then assigns it to the course's category property.
   *
   * If the category is not found, the category property is set to null.
   *
   * @private
   */
  private assignCategoryToCourse(course: Course): Course {
    const categoryId = course.categoryId ?? 0;
    course.category = categoryId ? this.getCategoryById(categoryId)() ?? null : null;
    return course;
  }
}
