import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatButton} from '@angular/material/button';
import {TranslatePipe} from '@ngx-translate/core';

/**
 * Displays fallback content for unknown routes.
 */
@Component({
  selector: 'app-page-not-found',
  imports: [MatButton, TranslatePipe],
  templateUrl: './page-not-found.html',
  styleUrl: './page-not-found.css'
})
export class PageNotFound implements OnInit {
  /**
   * The invalid path that led to this page.
   */
  protected invalidPath:  string  = '';

  /**
   * Activated route instance.
   */
  private route: ActivatedRoute   = inject(ActivatedRoute);

  /**
   * Router instance.
   */
  private router: Router          = inject(Router);

  /**
   * Initializes the component and sets the invalid path from the route.
   */
  ngOnInit() {
    this.invalidPath = this.route.snapshot.url.map(url => url.path).join('/');
  }

  /**
   * Navigates to the home page.
   */
  protected navigateToHome() {
    this.router.navigate(['home']).then();
  }

}
