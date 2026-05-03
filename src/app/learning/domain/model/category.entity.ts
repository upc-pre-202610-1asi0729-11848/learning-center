import {BaseEntity} from '../../../shared/domain/model/base-entity';

/**
 * Represents a learning category within the Learning domain.
 *
 * @remarks
 * In Domain-Driven Design, a Category is an entity in the Learning bounded context
 * that organizes and classifies courses. Each category has a unique identity that
 * persists throughout its lifecycle.
 *
 * This entity models the core concept of a category as understood within the
 * learning domain, with minimal behavior focused on state management.
 *
 * @example
 * ```typescript
 * const softwareCategory = new Category({
 *   id: 1,
 *   name: 'Software Development'
 * });
 *
 * console.log(softwareCategory.name); // 'Software Development'
 * ```
 */
export class Category implements BaseEntity {
  /**
   * The unique identifier for this category.
   * @defaultValue 0
   */
  private _id: number;

  /**
   * The display name of the category.
   * @defaultValue ''
   */
  private _name: string;

  /**
   * Creates a new Category entity.
   *
   * @param props - Initialization properties
   * @param props.id - The unique identifier for the category
   * @param props.name - The display name for the category
   *
   * @remarks
   * Constructor initializes the category with the provided values. The entity
   * requires both an ID and a name to be created.
   */
  constructor(props: {id: number, name: string}) {
    this._id = props.id;
    this._name = props.name;
  }

  /**
   * Gets the unique identifier of this category.
   *
   * @returns The category's unique ID
   */
  get id(): number {
    return this._id;
  }

  /**
   * Sets the unique identifier for this category.
   *
   * @param value - The new ID value
   *
   * @remarks
   * Typically, ID changes should be avoided in domain entities as identity is immutable.
   * This setter is provided for compatibility but should be used cautiously.
   */
  set id(value: number) {
    this._id = value;
  }

  /**
   * Gets the display name of this category.
   *
   * @returns The category's name
   */
  get name(): string {
    return this._name;
  }

  /**
   * Sets the display name for this category.
   *
   * @param value - The new name value
   *
   * @remarks
   * Category names can be updated to reflect changes in the learning domain
   * (e.g., renaming a skill category or updating terminology).
   */
  set name(value: string) {
    this._name = value;
  }


}
