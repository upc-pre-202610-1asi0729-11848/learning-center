import {BaseEntity} from '../../../shared/domain/model/base-entity';

/**
 * Represents an authenticated user account in the IAM bounded context.
 *
 * @remarks
 * In Domain-Driven Design, User is an entity in the IAM (Identity and Access Management)
 * domain that represents an authenticated account. Each User has a unique identity that
 * persists throughout its lifecycle.
 *
 * This entity models the core concept of a user account with:
 * - Unique identification (ID)
 * - Authentication identity (username)
 * - State management for account information
 *
 * The User entity is separate from authentication tokens and sessions, which are
 * managed at the application or infrastructure layer.
 *
 * @example
 * ```typescript
 * const user = new User({
 *   id: 42,
 *   username: 'john.doe'
 * });
 *
 * console.log(user.username); // 'john.doe'
 * user.username = 'jane.doe'; // Can be updated
 * ```
 */
export class User implements BaseEntity {
  /**
   * The unique identifier for this user account.
   * @defaultValue 0
   */
  private _id: number;

  /**
   * The unique username for this account.
   * This is typically an email address or user handle used for authentication.
   * @defaultValue ''
   */
  private _username: string;

  /**
   * Creates a new User entity.
   *
   * @param props - Initialization properties
   * @param props.id - The unique identifier assigned by the system
   * @param props.username - The unique username/email for the account
   *
   * @remarks
   * Initializes a user entity with the provided values. Both ID and username
   * are required for a valid user entity to exist.
   */
  constructor(props:{id: number, username: string}) {
    this._id = props.id;
    this._username = props.username;
  }

  /**
   * Gets the unique identifier of this user.
   *
   * @returns The user's unique ID
   */
  get id(): number {
    return this._id;
  }

  /**
   * Sets the unique identifier for this user.
   *
   * @param value The new ID value
   *
   * @remarks
   * Typically, ID changes should be avoided in domain entities as identity is immutable.
   * This setter is provided for compatibility but should be used cautiously.
   */
  set id(value: number) {
    this._id = value;
  }

  /**
   * Gets the username of this user.
   *
   * @returns The user's username/email
   */
  get username(): string {
    return this._username;
  }

  /**
   * Sets the username for this user.
   *
   * @param value The new username value
   *
   * @remarks
   * User accounts may update their username/email as part of account management.
   * In a robust system, this change should be validated and may require verification.
   */
  set username(value: string) {
    this._username = value;
  }
}
