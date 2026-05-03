import {CanActivateFn, Router} from '@angular/router';
import {IamStore} from '../application/iam.store';
import {inject} from '@angular/core';

/**
 * Route guard protecting pages that require authentication.
 *
 * @remarks
 * In Angular, a guard is a service that controls whether a route can be activated.
 * This guard implements the CanActivateFn function type, which allows it to:
 * - Check if the user has an active authentication session
 * - Allow navigation if authenticated
 * - Redirect to sign-in page if not authenticated
 *
 * Use this guard on routes that should only be accessible to signed-in users:
 *
 * ```typescript
 * const routes: Routes = [
 *   { path: 'home', component: HomeComponent, canActivate: [iamGuard] },
 *   { path: 'profile', component: ProfileComponent, canActivate: [iamGuard] }
 * ];
 * ```
 *
 * @param route - The target route being activated
 * @param state - The current router state
 * @returns true if the user is authenticated (allow navigation), false otherwise
 *
 * @example
 * ```typescript
 * // In your routing configuration:
 * const routes: Routes = [
 *   {
 *     path: 'dashboard',
 *     component: DashboardComponent,
 *     canActivate: [iamGuard] // Protect this route
 *   },
 *   {
 *     path: 'iam',
 *     children: [
 *       { path: 'sign-in', component: SignInComponent },
 *       { path: 'sign-up', component: SignUpComponent }
 *     ]
 *   }
 * ];
 * ```
 */
export const iamGuard: CanActivateFn = (route, state) => {
  const store = inject(IamStore);
  const router = inject(Router);
  console.log(`trying to navigate to ${route.url} with state ${state.url}`);
  if (store.isSignedIn()) {
    // User is authenticated, allow navigation
    return true;
  } else {
    // User is not authenticated, redirect to sign-in page
    router.navigate(['/iam/sign-in']).then();
    return false;
  }
}
