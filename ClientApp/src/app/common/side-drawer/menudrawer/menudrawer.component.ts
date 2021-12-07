import { Component, Input, HostBinding } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SideNavItems } from "src/app/_models/sideNavItems";
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { User } from '../../../_models/user';
import { MsalUserService } from '../../../_services/identity/msaluser.service';

@Component({
  selector: 'app-menudrawer',
  templateUrl: './menudrawer.component.html',
  styleUrls: ['./menudrawer.component.css'],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({ transform: 'rotate(270deg)' })),
      state('expanded', style({ transform: 'rotate(0deg)' })),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ])
  ]
})
export class MenudrawerComponent {

  // @ViewChild('drawer') public drawer: MatSidenav;
  expanded: boolean = false;
  @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
  @Input() item: SideNavItems;
  @Input() depth: number;
  @Input() drawer: any;
  user: User;
  constructor( private msalService: MsalUserService, private toastr: ToastrService, public router: Router) {
    if (this.depth === undefined) {
      this.depth = 0;
    }
  }
/*  
.......................................................................................................
* This is the onItemSelected function

* onItemSelected() is used to perform action after selection
.......................................................................................................
*/
  onItemSelected(item: SideNavItems) {   
    if (!item.ChiledMenu || !item.ChiledMenu.length) {
      this.drawer.toggle();
      this.router.navigate([item.route]);          
    }
    
    if (item.ChiledMenu && item.ChiledMenu.length) {
      this.expanded = !this.expanded;
    }
  }

/*  
.......................................................................................................
* This is the Logout function

* Logout() is used to logout session
.......................................................................................................
*/
  Logout() {
    this.msalService.logout()
  }
}
