import {Component} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';

/**
 * Home view for the shared presentation context.
 */
@Component({
  selector: 'app-home',
  imports: [TranslatePipe],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
