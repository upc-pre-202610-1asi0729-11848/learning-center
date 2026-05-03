import {Component, inject} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {LearningStore} from '../../../application/learning.store';
import {Course} from '../../../domain/model/couse.entity';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatInput} from '@angular/material/input';
import {TranslatePipe} from '@ngx-translate/core';

/**
 * Creates and edits course entities.
 */
@Component({
  selector: 'app-course-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatInput,
    TranslatePipe
  ],
  templateUrl: './course-form.html',
  styleUrl: './course-form.css'
})
export class CourseForm {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(LearningStore);

  /**
   * Form-group for the course form.
   */
  form = this.fb.group({
    title: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    categoryId: new FormControl<number | null>(null)
  });

  /**
   * Signal for the list of categories.
   */
  categories = this.store.categories;

  /**
   * Indicates if the form is in edit mode.
   */
  isEdit = false;

  /**
   * The ID of the course being edited, or null for new courses.
   */
  courseId: number | null = null;

  /**
   * Creates an instance of CourseForm and initializes the form based on route parameters.
   */
  constructor() {
    this.route.params.subscribe(params => {
      this.courseId = params['id'] ? +params['id'] : null;
      this.isEdit = !!this.courseId;
      if (this.isEdit && this.courseId) {
        let id = this.courseId;
        const course = this.store.getCourseById(id)();
        if (course) {
          this.form.patchValue({
            title: course.title,
            description: course.description,
            categoryId: course.categoryId
          });
        }
      }
    });
  }

  /**
   * Submits the form to create or update the course.
   */
  submit() {
    if (this.form.invalid) return;
    const course: Course = new Course({
      id: this.courseId ?? 0,
      title: this.form.value.title!,
      description: this.form.value.description!,
      categoryId: this.form.value.categoryId ?? 0
    });

    if (this.isEdit) {
      this.store.updateCourse(course);
    } else {
      this.store.addCourse(course);
    }

    this.router.navigate(['learning/courses']).then();
  }
}
