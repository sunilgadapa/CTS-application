import { Component, ViewChild, ElementRef} from "@angular/core";
import { MatDrawerContainer } from '@angular/material/sidenav';
import { SideNavItems } from "../../_models/sideNavItems";
import { AuthenticationService } from '../../_services/identity/authentication.service';
import { ToastrService } from 'ngx-toastr';
import * as pbi from 'powerbi-client'; 


@Component({
  selector: 'app-common-viewerrorreport',
  templateUrl: './viewerrorreport.component.html',
  styleUrls: ['./viewerrorreport.component.css']
})
export class ViewErrorReportComponent {

  constructor(private authenticationService:AuthenticationService, 
    private toastr:ToastrService,) { }
    @ViewChild('appDrawer') appDrawer: ElementRef;
    @ViewChild('contentToConvert') contentToConvert:ElementRef;
  drawer: MatDrawerContainer;
  reportContainer: any;
  navItems: SideNavItems[];
  @ViewChild('reportContainer') embeddedReport: ElementRef; 

 
  generatePDF() {
    let powerbi = new pbi.service.Service(pbi.factories.hpmFactory, pbi.factories.wpmpFactory, pbi.factories.routerFactory);  
    powerbi.get(this.reportContainer);
  }
 

  // Logout(){
  //   this.authenticationService.logout()
  //   this.toastr.success('Logged out successfully');
  // }
  // ngAfterViewInit() {
  //   this.reportContainer = this.embeddedReport.nativeElement;
  //   this.sideNavService.appDrawer = this.appDrawer;
  // }
  // getNavlistData() {
  //   this.sideNavService.getNavItems().subscribe(user => {     
  //     this.navItems = user.data.ParentMenu
  //   })
  // }

}
