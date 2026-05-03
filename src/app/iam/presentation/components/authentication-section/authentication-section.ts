import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {IamStore} from '../../../application/iam.store';
import {MatButton} from '@angular/material/button';

/**
 * Renders IAM authentication actions for sign-in, sign-up, and sign-out.
 */
@Component({
  selector: 'app-authentication-section',
  imports: [
    MatButton
  ],
  templateUrl: './authentication-section.html',
  styleUrl: './authentication-section.css'
})
export class AuthenticationSection {
  private router = inject(Router);
  protected store = inject(IamStore);

  /**
   * Navigates to the sign-in page.
   */
  performSignIn(){
    this.router.navigate(['/iam/sign-in']).then();
  }

  /**
   * Navigates to the sign-up page.
   */
  performSignUp(){
    this.router.navigate(['/iam/sign-up']).then();
  }

  /**
   * Signs out the current user.
   */
  performSignOut(){
    this.store.signOut(this.router);
  }

}
