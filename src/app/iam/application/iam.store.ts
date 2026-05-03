import {computed, Injectable, signal} from '@angular/core';
import {User} from '../domain/model/user.entity';
import {SignInCommand} from '../domain/model/sign-in.command';
import {Router} from '@angular/router';
import {IamApi} from '../infrastructure/iam-api';
import {SignUpCommand} from '../domain/model/sign-up.command';

/**
 * Holds IAM application state and orchestrates authentication flows.
 */
@Injectable({providedIn: 'root'})
export class IamStore {
  private readonly isSignedInSignal = signal<boolean>(false);
  private readonly currentUsernameSignal = signal<string | null>(null);
  private readonly currentUserIdSignal = signal<number | null>(null);
  private readonly usersSignal = signal<Array<User>>([]);

  /**
   * Readonly signal indicating if the user is signed in.
   */
  readonly isSignedIn = this.isSignedInSignal.asReadonly();

  /**
   * Signal indicating if users are being loaded.
   */
  readonly loadingUsers = signal<boolean>(false);

  /**
   * Readonly signal for the current username.
   */
  readonly currentUsername = this.currentUsernameSignal.asReadonly();

  /**
   * Readonly signal for the current user ID.
   */
  readonly currentUserId = this.currentUserIdSignal.asReadonly();

  /**
   * Computed signal for the current authentication token.
   */
  readonly currentToken = computed(() => this.isSignedIn() ? localStorage.getItem('token') : null);

  /**
   * Readonly signal for the list of users.
   */
  readonly users = this.usersSignal.asReadonly();

  /**
   * Readonly signal indicating if users are loading.
   */
  readonly isLoadingUsers = this.loadingUsers.asReadonly();

  /**
   * Creates an instance of IamStore.
   * @param iamApi The IAM API service.
   */
  constructor(private iamApi: IamApi) {
    this.isSignedInSignal.set(false);
    this.currentUsernameSignal.set(null);
    this.currentUserIdSignal.set(null);
  }

  /**
   * Executes sign-in and updates authentication state.
   * @param signInCommand - Credentials command.
   * @param router - Router used for post-auth navigation.
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
   * Executes sign-up and routes to the sign-in flow on success.
   * @param signUpCommand - Registration command.
   * @param router - Router used for post-sign-up navigation.
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
   * Clears local authentication state and redirects to sign-in.
   * @param router - Router used for sign-out navigation.
   */
  signOut(router: Router) {
    localStorage.removeItem('token');
    this.isSignedInSignal.set(false);
    this.currentUsernameSignal.set(null);
    this.currentUserIdSignal.set(null);
    router.navigate(['/iam/sign-in']).then();
  }

  /**
   * Starts loading users into store state.
   *
   * @remarks
   * The query implementation is pending.
   */
  loadUsers() {
    this.loadingUsers.set(true);
    // TODO: Implement user loading logic
  }
}
