import {Component} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';

/**
 * About view for the shared presentation context.
 */
@Component({
  selector: 'app-about',
  imports: [
    TranslatePipe
  ],
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class About {

}
