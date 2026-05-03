import {Category} from './category.entity';

/**
 * Represents a course aggregate in the learning domain model.
 *
 * @remarks
 * In Domain-Driven Design, Course is the aggregate root in the Learning bounded context.
 * It encapsulates course information and maintains a reference to its associated Category.
 *
 * The Course aggregate manages:
 * - Core course metadata (id, title, description)
 * - Category association via both ID and object reference
 * - Consistency of the course data
 *
 * @example
 * ```typescript
 * const course = new Course({
 *   id: 1,
 *   title: 'TypeScript Fundamentals',
 *   description: 'Learn TypeScript from the ground up',
 *   categoryId: 5
 * });
 * ```
 */
export class Course {
  /**
   * The category associated with the course.
   * @remarks
   * This is an object reference to the {@link Category} entity. It may be null if not set.
   */
  get category(): Category | null {
    return this._category;
  }

  /**
   * Sets the category associated with the course.
   *
   * @param value - The {@link Category} to associate with the course.
   */
  set category(value: Category | null) {
    this._category = value;
  }

  /**
   * Unique identifier for the course.
   * @defaultValue 0
   */
  private _id: number;

  /**
   * Title of the course.
   * @defaultValue ''
   */
  private _title: string;

  /**
   * Description of the course.
   * @defaultValue ''
   */
  private _description: string;

  /**
   * Identifier of the category associated with the course.
   * @defaultValue 0
   */
  private _categoryId: number;

  /**
   * The category object associated with the course, or null if not set.
   * @defaultValue null
   */
  private _category: Category | null;

  /**
   * Creates a new instance of the Course aggregate.
   *
   * @param course - Initialization object containing course properties
   * @param course.id - The unique identifier for the course
   * @param course.title - The title of the course
   * @param course.description - The description of the course
   * @param course.categoryId - The identifier of the category associated with the course
   * @param course.category - Optional Category entity object for eager loading
   *
   * @remarks
   * The constructor initializes the course with provided values. The category parameter
   * is optional and should be set separately if not provided during construction.
   */
  constructor(course: { id: number; title: string; description: string; categoryId: number; category?: Category | null }) {
    this._id = course.id;
    this._title = course.title;
    this._description = course.description;
    this._categoryId = course.categoryId;
    this._category = course.category ?? null;
  }

  /**
   * Gets the unique identifier for this course.
   *
   * @returns The course's unique ID
   */
  get id(): number {
    return this._id;
  }

  /**
   * Sets the unique identifier for this course.
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
   * Gets the title of this course.
   *
   * @returns The course's title
   */
  get title(): string {
    return this._title;
  }

  /**
   * Sets the title for this course.
   *
   * @param value - The new title value
   *
   * @remarks
   * Course titles can be updated to reflect curriculum changes or corrections.
   */
  set title(value: string) {
    this._title = value;
  }

  /**
   * Gets the description of this course.
   *
   * @returns The course's description
   */
  get description(): string {
    return this._description;
  }

  /**
   * Sets the description for this course.
   *
   * @param value - The new description value
   *
   * @remarks
   * Course descriptions can be updated to improve clarity or reflect curriculum changes.
   */
  set description(value: string) {
    this._description = value;
  }

  /**
   * Gets the category identifier associated with this course.
   *
   * @returns The ID of the associated category
   *
   * @remarks
   * This returns the category ID, not the Category entity itself.
   * Use the {@link category} property to access the full Category entity.
   */
  get categoryId(): number {
    return this._categoryId;
  }

  /**
   * Sets the category identifier for this course.
   *
   * @param value - The new category ID value
   *
   * @remarks
   * Changing the category ID allows the course to be recategorized.
   * After changing this value, the Category entity reference may need to be updated
   * via the {@link category} setter or through the application layer.
   */
  set categoryId(value: number) {
    this._categoryId = value;
  }
}
