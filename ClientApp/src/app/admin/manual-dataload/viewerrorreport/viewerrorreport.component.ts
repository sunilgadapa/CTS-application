import { Component, ViewChild, ElementRef, AfterViewInit, Input} from "@angular/core";
import { MatDrawerContainer } from '@angular/material/sidenav';
import { SideNavItems } from "../../../_models/sideNavItems";
import { AuthenticationService } from '../../../_services/identity/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { PowerbiReportService } from "src/app/_services/admin/powerbi-report.service";

@Component({
  selector: 'app-viewerrorreport',
  templateUrl: './viewerrorreport.component.html',
  styleUrls: ['./viewerrorreport.component.css']
})
export class ViewerrorreportComponent implements AfterViewInit {
  @Input() receivedValue: string;
  constructor(private authenticationService:AuthenticationService, 
    private toastr:ToastrService,private _powerBireportservice: PowerbiReportService) { }
    @ViewChild('appDrawer') appDrawer: ElementRef;
    @ViewChild('contentToConvert') contentToConvert:ElementRef;
    drawer: MatDrawerContainer;
    powerbiObject:any;
    reportContainer: any;
    navItems: SideNavItems[];
    @ViewChild('reportContainer') embeddedReport: ElementRef; 
    report_url:any="";

  ngAfterViewInit():void{
    if(history.state.reportId!=null || history.state.reportId!=undefined)
    {
        localStorage.setItem("errorreportid",history.state.reportId);
        localStorage.setItem("reportfilter",history.state.filter);
    }
    let reportId=localStorage.getItem("errorreportid");
    let filter=localStorage.getItem("reportfilter");
    if(filter==null || filter==undefined)
    {
      filter="";
    }
    if(reportId!=undefined && reportId!=null)
    {
      this._powerBireportservice.GetPowerBiReportData(reportId).subscribe(Response=>{
        this.powerbiObject=Response.data;
        this.report_url=this.powerbiObject.powerBIReportData.report_url
        //for iframe url
        this.report_url=this.report_url+"&autoAuth=true&$filter="+filter;
        console.log(this.report_url);
      });
    }
  }
  //generatePDF() {
    //let powerbi = new pbi.service.Service(pbi.factories.hpmFactory, pbi.factories.wpmpFactory, pbi.factories.routerFactory);  
    // var report = powerbi.get(this.reportContainer);
  //}
 
}
