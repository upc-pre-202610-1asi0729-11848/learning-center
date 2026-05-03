import {CanActivateFn, Router} from '@angular/router';
import {IamStore} from '../application/iam.store';
import {inject} from '@angular/core';

/**
 * Blocks protected routes when no authenticated IAM session exists.
 */
export const iamGuard: CanActivateFn = (route, state) => {
  const store = inject(IamStore);
  const router = inject(Router);
  console.log(`trying to navigate to ${route.url} with state ${state.url}`);
  if (store.isSignedIn()) return true;
    else {
      router.navigate(['/iam/sign-in']).then();
      return false;
    }
}
