import {computed, Injectable, signal} from '@angular/core';
import {User} from '../domain/model/user.entity';
import {SignInCommand} from '../domain/model/sign-in.command';
import {Router} from '@angular/router';
import {IamApi} from '../infrastructure/iam-api';
import {SignUpCommand} from '../domain/model/sign-up.command';

/**
 * Application service managing IAM domain state and authentication orchestration.
 *
 * @remarks
 * In Domain-Driven Design, this is an application service that:
 * - Manages the state of the authenticated user session
 * - Coordinates authentication flows (sign-in, sign-up, sign-out)
 * - Integrates with the infrastructure layer (IamApi)
 * - Handles navigation after authentication state changes
 *
 * The store maintains user session state through Angular signals:
 * - Authentication status (signed in or not)
 * - Current user information (username, ID)
 * - Authentication token in browser storage
 * - Collection of all users in the system
 * - Loading and error states
 *
 * State is exposed through computed and readonly signals for reactive Angular
 * components and templates using Angular's signal-based reactivity.
 *
 * @example
 * ```typescript
 * constructor(private iamStore: IamStore, private router: Router) {}
 *
 * signIn() {
 *   const command = new SignInCommand({ username: 'user@example.com', password: 'secret' });
 *   this.iamStore.signIn(command, this.router);
 * }
 * ```
 */
@Injectable({providedIn: 'root'})
export class IamStore {
  /**
   * Signal tracking the authentication status of the current session.
   * @private
   */
  private readonly isSignedInSignal = signal<boolean>(false);

  /**
   * Signal storing the username of the authenticated user.
   * @private
   */
  private readonly currentUsernameSignal = signal<string | null>(null);

  /**
   * Signal storing the ID of the authenticated user.
   * @private
   */
  private readonly currentUserIdSignal = signal<number | null>(null);

  /**
   * Signal containing all users in the system (for queries/search).
   * @private
   */
  private readonly usersSignal = signal<Array<User>>([]);

  /**
   * Readonly signal indicating if the user is currently signed in.
   * True when an active authentication session exists, false otherwise.
   */
  readonly isSignedIn = this.isSignedInSignal.asReadonly();

  /**
   * Signal indicating whether user data is currently being loaded.
   * Used for UI loading indicators during user queries.
   */
  readonly loadingUsers = signal<boolean>(false);

  /**
   * Readonly signal for the username of the currently authenticated user.
   * Contains null when no user is signed in.
   */
  readonly currentUsername = this.currentUsernameSignal.asReadonly();

  /**
   * Readonly signal for the ID of the currently authenticated user.
   * Contains null when no user is signed in.
   */
  readonly currentUserId = this.currentUserIdSignal.asReadonly();

  /**
   * Computed signal that provides the current authentication token.
   *
   * @remarks
   * Reactively reads the authentication token from localStorage when signed in.
   * Returns null when not signed in. The token is computed based on the
   * isSignedIn signal, so it automatically updates when authentication state changes.
   *
   * In a real application, consider using secure storage instead of localStorage
   * for sensitive authentication tokens.
   */
  readonly currentToken = computed(() => this.isSignedIn() ? localStorage.getItem('token') : null);

  /**
   * Readonly signal for the list of users retrieved by user queries.
   * Contains an empty array until users are explicitly loaded via {@link loadUsers}.
   */
  readonly users = this.usersSignal.asReadonly();

  /**
   * Readonly signal indicating if users are currently being loaded.
   * True during user query operations, false otherwise.
   */
  readonly isLoadingUsers = this.loadingUsers.asReadonly();

  /**
   * Creates an instance of IamStore.
   *
   * @param iamApi - The infrastructure API service for IAM operations
   *
   * @remarks
   * Initializes the store with default state (not signed in, no current user).
   * The store does not automatically auth-check or load user data on initialization.
   */
  constructor(private iamApi: IamApi) {
    this.isSignedInSignal.set(false);
    this.currentUsernameSignal.set(null);
    this.currentUserIdSignal.set(null);
  }

  /**
   * Executes the sign-in flow and updates authentication state.
   *
   * @param signInCommand - Domain command containing user credentials
   * @param router - Angular Router for post-authentication navigation
   *
   * @remarks
   * Coordinates the sign-in process:
   * 1. Sends the sign-in command to the API
   * 2. On success:
   *    - Stores the authentication token in localStorage
   *    - Updates state signals (isSignedIn, username, userID)
   *    - Navigates to the home page
   * 3. On failure:
   *    - Clears authentication state
   *    - Logs the error
   *    - Redirects back to the sign-in page
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
  signIn(signInCommand: SignInCommand, router: Router) {
    console.log(signInCommand);
    this.iamApi.signIn(signInCommand).subscribe({
      next: (signInResource) => {
        localStorage.setItem('token', signInResource.token);
        this.isSignedInSignal.set(true);
        this.currentUsernameSignal.set(signInResource.username);
        this.currentUserIdSignal.set(signInResource.id);
        router.navigate(['/home']).then();
      },
      error: (err) => {
        console.error('Sign-in failed:', err);
        this.isSignedInSignal.set(false);
        this.currentUsernameSignal.set(null);
        this.currentUserIdSignal.set(null);
        router.navigate(['/iam/sign-in']).then();
      }
    });
  }

  /**
   * Executes the sign-up flow (user registration).
   *
   * @param signUpCommand - Domain command containing new user credentials
   * @param router - Angular Router for post-registration navigation
   *
   * @remarks
   * Coordinates the sign-up process:
   * 1. Sends the sign-up command to the API
   * 2. On success:
   *    - Redirects to the sign-in page for the user to log in
   * 3. On failure:
   *    - Clears any potential authentication state
   *    - Logs the error
   *    - Redirects back to the sign-up page
   *
   * Note: Sign-up does not automatically sign in the user. They must
   * complete the sign-in flow with their new credentials.
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
  signUp(signUpCommand: SignUpCommand, router: Router) {
    this.iamApi.signUp(signUpCommand).subscribe({
      next: (signUpResource) => {
        console.log('Sign-up successful:', signUpResource);
        router.navigate(['/iam/sign-in']).then();
      },
      error: (err) => {
        console.error('Sign-up failed:', err);
        this.isSignedInSignal.set(false);
        this.currentUsernameSignal.set(null);
        this.currentUserIdSignal.set(null);
        router.navigate(['/iam/sign-up']).then();
      }
    });
  }

  /**
   * Executes the sign-out flow and clears authentication state.
   *
   * @param router - Angular Router for post-sign-out navigation
   *
   * @remarks
   * Clears all authentication state:
   * 1. Removes the authentication token from localStorage
   * 2. Sets isSignedIn to false
   * 3. Clears current user information (username, ID)
   * 4. Redirects to the sign-in page
   *
   * @example
   * ```typescript
   * this.iamStore.signOut(this.router);
   * ```
   */
  signOut(router: Router) {
    localStorage.removeItem('token');
    this.isSignedInSignal.set(false);
    this.currentUsernameSignal.set(null);
    this.currentUserIdSignal.set(null);
    router.navigate(['/iam/sign-in']).then();
  }

  /**
   * Initiates loading of all users into the store state.
   *
   * @remarks
   * Sets the loading flag and prepares to load users from the API.
   * The actual implementation (API call) is pending and should be completed
   * in a future update.
   *
   * This method is useful for user lists, search, and administration features
   * that need access to all users in the system.
   *
   * @todo Implement the actual user loading logic with API calls
   */
  loadUsers() {
    this.loadingUsers.set(true);
    // TODO: Implement user loading logic
  }
}
