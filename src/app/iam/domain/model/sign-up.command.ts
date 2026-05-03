/**
 * Domain command encapsulating user registration credentials.
 *
 * @remarks
 * In Domain-Driven Design, a Command represents an intent to perform an action
 * in the domain. SignUpCommand captures the user's intent to create a new account
 * with the system.
 *
 * This command:
 * - Holds immutable credential values for a registration operation
 * - Serves as input to the registration use case
 * - Is transformed by the infrastructure layer for API communication
 *
 * @example
 * ```typescript
 * const command = new SignUpCommand({
 *   username: 'john.doe',
 *   password: 'newpass123'
 * });
 * this.iamStore.signUp(command, this.router);
 * ```
 */
export class SignUpCommand {
  /**
   * The username for the new account.
   * This is typically an email address or user handle.
   *
   * @returns The username credential
   */
  get username(): string {
    return this._username;
  }

  /**
   * Sets the username for sign-up.
   *
   * @param value The username value
   */
  set username(value: string) {
    this._username = value;
  }

  /**
   * The password for the new account.
   * This is the raw, unhashed password provided by the user.
   *
   * @remarks
   * The password is stored in memory during command processing.
   * In a production system, ensure the password is not logged or
   * stored beyond its immediate use.
   *
   * @returns The password credential
   */
  get password(): string {
    return this._password;
  }

  /**
   * Sets the password for sign-up.
   *
   * @param value The password value
   */
  set password(value: string) {
    this._password = value;
  }

  /**
   * The username backing field.
   * @private
   */
  private _username: string;

  /**
   * The password backing field.
   * @private
   */
  private _password: string;

  /**
   * Creates a new SignUpCommand instance.
   *
   * @param props - Credential values for sign-up
   * @param props.username - The new user's username or email
   * @param props.password - The new user's password
   *
   * @remarks
   * Initializes the command with the provided credential values.
   * Both username and password are required for a valid command.
   */
  constructor(props: {username: string, password: string}) {
    this._username = props.username;
    this._password = props.password;
  }
}
