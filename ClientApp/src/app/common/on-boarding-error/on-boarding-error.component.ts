import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: 'app-on-boarding-error',
  templateUrl: './on-boarding-error.component.html',
  styleUrls: ['./on-boarding-error.component.css']
})
export class OnBoardingErrorComponent {
  constructor(public router: Router) { }
  /*  
.......................................................................................................
* This is the retry function

* retry() is used to retry login
.......................................................................................................
*/
  retry() {
    let url = window.location.origin == 'http://localhost:4200' ? window.location.origin : window.location.origin + '/ctsweb/';
    window.location.href = url
  }
}
