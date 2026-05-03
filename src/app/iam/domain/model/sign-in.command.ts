/**
 * Domain command encapsulating sign-in credentials.
 *
 * @remarks
 * In Domain-Driven Design, a Command represents an intent to perform an action
 * in the domain. SignInCommand captures the user's intent to authenticate with
 * the system using their credentials.
 *
 * This command:
 * - Holds immutable credential values for a sign-in operation
 * - Serves as input to the authentication use case
 * - Is transformed by the infrastructure layer for API communication
 *
 * @example
 * ```typescript
 * const command = new SignInCommand({
 *   username: 'john.doe',
 *   password: 'secret123'
 * });
 * this.iamStore.signIn(command, this.router);
 * ```
 */
export class SignInCommand {
  /**
   * The username for sign-in.
   * This is typically an email address or user handle.
   *
   * @returns The username credential
   */
  get username(): string {
    return this._username;
  }

  /**
   * Sets the username for sign-in.
   *
   * @param value The username value
   */
  set username(value: string) {
    this._username = value;
  }

  /**
   * The password for sign-in.
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
   * Sets the password for sign-in.
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
   * Creates a new SignInCommand instance.
   *
   * @param props - Credential values for sign-in
   * @param props.username - The user's username or email
   * @param props.password - The user's password
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
