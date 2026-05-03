import {Component, inject} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {LearningStore} from '../../../application/learning.store';
import {Category} from "../../../domain/model/category.entity";
import {MatError, MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {TranslatePipe} from "@ngx-translate/core";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-category-form',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    TranslatePipe,
    MatError,
    MatInput,
    MatButton
  ],
  templateUrl: './category-form.html',
  styleUrl: './category-form.css',
})
export class CategoryForm {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(LearningStore);
  /**
   * Form group for the category form.
   */
  form = this.fb.group({
    name: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] })
  });

  /**
   * Indicates if the form is in edit mode.
   */
  isEdit = false;

  /**
   * The ID of the category being edited, or null for new categories.
   */
  categoryId: number | null = null;

  /**
   * Creates an instance of CategoryForm and initializes the form based on route parameters.
   */
  constructor() {
    this.route.params.subscribe(params => {
      this.categoryId = params['id'] ? +params['id'] : null;
      this.isEdit = !!this.categoryId;
      if (this.isEdit && this.categoryId) {
        let id = this.categoryId;
        const category = this.store.getCategoryById(id)();
        if (category) {
          this.form.patchValue({ name: category.name });
        }
      }
    });
  }

  /**
   * Submits the form to create or update the category.
   */
  submit() {
    if (this.form.invalid) return;

    const category: Category = new Category({
      id: this.categoryId ?? 0,
      name: this.form.value.name!
    });

    if (this.isEdit) {
      this.store.updateCategory(category);
    } else {
      this.store.addCategory(category);
    }

    this.router.navigate(['learning/categories']).then();
  }
}
