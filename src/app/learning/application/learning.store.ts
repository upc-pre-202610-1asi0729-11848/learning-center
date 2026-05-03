import {Category} from '../domain/model/category.entity';
import {computed, Signal, signal} from '@angular/core';
import {LearningApi} from '../infrastructure/learning-api';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {retry} from 'rxjs';
import {Course} from "../domain/model/couse.entity";

export class LearningStore {
  private readonly categoriesSignal = signal<Category[]>([]);
  private readonly coursesSignal = signal<Course[]>([]);
  readonly categories = this.categoriesSignal.asReadonly();
  readonly courses = this.coursesSignal.asReadonly();
  readonly categoriesCount = computed(() => this.categories().length);
  readonly courseCount = computed(() => this.courses().length);
  private readonly loadingSignal = signal<boolean>(false);
  readonly loading = this.loadingSignal.asReadonly();
  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  constructor(private learningApi: LearningApi) {

  }

  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Resource not found') ? `${fallback}: Not found` : error.message;
    }
    return fallback;
  }

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

  getCategoryById(id: number): Signal<Category | undefined> {
    return computed(() => id
      ? this.categories().find(category => category.id === id) : undefined)
  }

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

  getCourseById(id: number): Signal<Course | undefined> {
    return computed(() => id ? this.courses().find(c => c.id === id) : undefined);
  }

  /**
   * Adds a new course.
   * @param course - The course to add.
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
   * Updates an existing course.
   * @param updatedCourse - The course to update.
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
   * Deletes a course by ID.
   * @param id - The ID of the course to delete.
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

  private assignCategoriesToCourses(): void {
    this.coursesSignal.update(courses => courses.map(course => this.assignCategoryToCourse(course)));
  }

  private assignCategoryToCourse(course: Course): Course {
    const categoryId = course.categoryId ?? 0;
    course.category = categoryId ? this.getCategoryById(categoryId)() ?? null : null;
    return course;
  }
}
