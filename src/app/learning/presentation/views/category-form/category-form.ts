import {Component, inject} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {LearningStore} from '../../../application/learning.store';

@Component({
  selector: 'app-category-form',
  imports: [],
  templateUrl: './category-form.html',
  styleUrl: './category-form.css',
})
export class CategoryForm {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(LearningStore);
}
