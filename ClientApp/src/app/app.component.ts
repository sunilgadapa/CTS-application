import { Component, HostListener } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  host: {
    '(document:click)': 'onClick($event)',
  },
})

export class AppComponent {
  title = 'CTS';
  constructor(private toastr: ToastrService) {
  }
  @HostListener("input")
  clicked() {
    this.toastr.clear();
  }

  onClick(event: any) {
    this.toastr.clear();
  }

}
