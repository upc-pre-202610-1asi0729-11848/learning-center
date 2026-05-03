import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {Category} from '../domain/model/category.entity';
import {CategoriesResponse, CategoryResource} from './categories-response';
import {CategoryAssembler} from './category-assembler';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

const endpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderCategoriesEndpointPath}`;

/**
 * HTTP endpoint client for category CRUD operations.
 *
 * @remarks
 * This endpoint encapsulates all HTTP communication for the Category aggregate
 * in the Learning domain. It extends {@link BaseApiEndpoint} to inherit
 * standard CRUD operation implementations with category-specific configuration.
 *
 * The endpoint handles:
 * - GET /categories - Retrieve all categories
 * - GET /categories/:id - Retrieve a specific category
 * - POST /categories - Create a new category
 * - PUT /categories/:id - Update an existing category
 * - DELETE /categories/:id - Delete a category
 *
 * Resource conversion is delegated to {@link CategoryAssembler}.
 */
export class CategoriesApiEndpoint
  extends BaseApiEndpoint<Category, CategoryResource, CategoriesResponse, CategoryAssembler>{
  /**
   * Creates an instance of CategoriesApiEndpoint.
   *
   * @param http - Angular HttpClient for making HTTP requests
   *
   * @remarks
   * Initializes the endpoint with the configured API base URL and the
   * categories endpoint path. The CategoryAssembler is used to convert
   * between Category domain entities and CategoryResource infrastructure objects.
   */
  constructor(http: HttpClient) {
    super(http, endpointUrl, new CategoryAssembler());
  }
}
