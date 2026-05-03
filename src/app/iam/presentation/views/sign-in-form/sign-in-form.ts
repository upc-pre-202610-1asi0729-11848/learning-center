import {Component, inject} from '@angular/core';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {MatInput} from '@angular/material/input';
import {MatError, MatFormField} from '@angular/material/form-field';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {IamStore} from '../../../application/iam.store';
import {SignInCommand} from '../../../domain/model/sign-in.command';
import {BaseForm} from '../../../../shared/presentation/components/base-form/base-form';

/**
 * Collects credentials and triggers IAM sign-in.
 */
@Component({
  selector: 'app-sign-in-form',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatFormField,
    MatError,
    MatButton,
    MatInput,
    ReactiveFormsModule
  ],
  templateUrl: './sign-in-form.html',
  styleUrl: './sign-in-form.css'
})
export class SignInForm extends BaseForm {
  private router = inject(Router);
  private store = inject(IamStore);

  /**
   * Form-group for the sign-in form.
   */
  form = new FormGroup({
    username: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    password: new FormControl('', {nonNullable: true, validators: [Validators.required]})
  });

  /**
   * Performs the sign-in operation if the form is valid.
   */
  performSignIn() {
    if (this.form.invalid) return;
    const signInCommand = new SignInCommand({
      username: this.form.value.username!,
      password: this.form.value.password!
    });
    this.store.signIn(signInCommand, this.router);
  }
}
