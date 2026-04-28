import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {Category} from '../domain/model/category.entity';
import {CategoriesResponse, CategoryResource} from './categories-response';

export class CategoryAssembler implements BaseAssembler<Category, CategoryResource, CategoriesResponse>{
  toEntitiesFromResponse(response: CategoriesResponse): Category[] {
    return response.categories.map(resource => this.toEntityFromResource(resource as CategoryResource));
  }

  toEntityFromResource(resource: CategoryResource): Category {
    return new Category({ id: resource.id, name: resource.name});
  }

  toResourceFromEntity(entity: Category): CategoryResource {
    return { id: entity.id, name: entity.name } as CategoryResource;
  }

}
