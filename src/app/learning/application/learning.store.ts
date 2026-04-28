import {Category} from '../domain/model/category.entity';
import {computed, Signal, signal} from '@angular/core';
import {LearningApi} from '../infrastructure/learning-api';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {retry} from 'rxjs';

export class LearningStore {
  private readonly categoriesSignal = signal<Category[]>([]);
  readonly categories = this.categoriesSignal.asReadonly();
  readonly categoriesCount = computed(() => this.categories().length);
  private readonly loadingSignal = signal<boolean>(false);
  readonly loading = this.loadingSignal.asReadonly();
  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  constructor(private learningApi: LearningApi) {

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
      error: error => {
        this.loadingSignal.set(false);
        this.errorSignal.set(error.message);
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
      error: error => {
        this.loadingSignal.set(false);
        this.errorSignal.set(error.message);
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
      error: error => {
        this.loadingSignal.set(false);
      }
    })
  }

  deleteCategory(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.learningApi.deleteCategory(id).pipe(retry(2)).subscribe({
      next: () => {
        this.categoriesSignal.update(categories => categories.filter(category => category.id !== id));
      }
    })
  }
}
