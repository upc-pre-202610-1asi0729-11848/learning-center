import {BaseApi} from '../../shared/infrastructure/base-api';
import {CategoriesApiEndpoint} from './categories-api-endpoint';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Category} from '../domain/model/category.entity';

@Injectable({ providedIn: 'root'})
export class LearningApi extends BaseApi {
  private readonly categoriesEndpoint: CategoriesApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.categoriesEndpoint = new CategoriesApiEndpoint(http);
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



}
