import { Component, ViewChild,ElementRef,AfterViewInit, Input } from '@angular/core';

import { PowerbiReportService } from 'src/app/_services/admin/powerbi-report.service';
@Component({
  selector: 'app-powerbi',
  templateUrl: './powerbi.component.html',
  styleUrls: ['./powerbi.component.css']
})
export class PowerbiComponent implements AfterViewInit {

  constructor (private _powerBireportservice: PowerbiReportService) { 
    
  }
  public screenHeight:number;  
  public reportContainer: any;
  
  @ViewChild('reportContainer') embeddedReport: ElementRef; 
  @Input() receivedValue: string;
 
  ngAfterViewInit() {
    
    this.reportContainer = this.embeddedReport.nativeElement; 
    this.screenHeight = (window.screen.height); 
    let reportId=history.state.reportId;
    let filter="";
    this._powerBireportservice.showReport(reportId,filter,this.reportContainer);
  }
}
