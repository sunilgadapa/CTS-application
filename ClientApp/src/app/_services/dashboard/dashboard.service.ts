
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ConfigService } from '../config/config.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  configData = this.configService.getConfig();
  baseUrl = this.configData.dashboardBaseUrl;  
  constructor(private http: HttpClient, private configService: ConfigService) { }


  /*  
  ......................................................................................................
  * This is the getDataLoadRecentErrors function
  * @param PageNumber is a page number
  * @param Size is a page size
  * getDataLoadRecentErrors is used to get the data load recent errors
  .......................................................................................................
  */
  getDataLoadRecentErrors(PageNumber: any, Size: any) {
    var params = new HttpParams().append('PageNumber', PageNumber).append('Size', Size);    
    return this.http.get<any>(this.baseUrl + 'Dashboard/GetDataLoadRecentErrors', { params: params }).pipe(map((response: any) => {
      if (response) return response;
    }
    ));
  }
}
