import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as pbi from 'powerbi-client'; 
import { ConfigService } from '../config/config.service';

@Injectable({
  providedIn: 'root'
})
export class PowerbiReportService {
  baseUrl:any;
  env:any;
  constructor(private http: HttpClient, public router: Router,private configService:ConfigService) { 
    let configData=configService.getConfig()
        this.env=configData.env;
        if(this.env.toUpperCase()=="LOCAL")
        {
          this.env="dev";
        }
        this.baseUrl=configData.reportingBaseUrl;
  }

  showReport(reportId: any, Filter:any, reportContainer:any) { 
    this.GetPowerBiReportData(reportId).subscribe(response=>{
      let powerBiObject=response.data;
      let embedUrl = powerBiObject.powerBIReportData.report_url;
      let embedReportId = powerBiObject.powerBIReportData.power_bi_report_id;
      let accessToken=powerBiObject.reportEmbedConfig.EmbedToken;
      let config: any= {  
          type: 'report',  
          accessToken:accessToken,  
          embedUrl: embedUrl,
          tokenType: pbi.models.TokenType.Embed,  
          id: embedReportId,  
          settings: {
            filterPaneEnabled: true,
            navContentPaneEnabled: true
            },
            filters:[{
              $schema: "http://powerbi.com/product/schema",
              filterType:1,
              target: {
                table: "FileDetails", // filter table
                column: "File_id " // filter column
              },
              operator: "In",
              values: [664]   // value that you need to filter
  
            }]
      };  
        
      let powerbi = new pbi.service.Service(pbi.factories.hpmFactory, pbi.factories.wpmpFactory, pbi.factories.routerFactory);  
      let report = powerbi.embed(reportContainer, config);  
      report.off("loaded");  
      report.on("loaded", () => {  
         console.clear()
      });  
      report.on("error", () => {  
        console.clear()
      }); 
    });
     
  } 

  GetPowerBiReportData(reportId: any) {
    
    var reportingParams = new HttpParams();
    reportingParams = reportingParams.append('power_bi_report_id', reportId);
    reportingParams = reportingParams.append('env', this.env);
    return this.http.get<any>(this.baseUrl + 'PowerBIReportLog/GetPowerBIMasterReportData', { params: reportingParams }).pipe(map((response: any) => {
      if (response.Statuscode == 200) {
        return response;
      }
    }))
  }
}
