import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { ConfigService } from '../config/config.service';
@Injectable({
  providedIn: 'root'
})
export class NotificationconfigurationService { 
  configData = this.configService.getConfig();  
  baseUrl=this.configData.adminBaseUrl;
  constructor(private http: HttpClient, private toastr: ToastrService,private configService:ConfigService) { }
 
/*  
......................................................................................................
* This is the getUserData function

* @param data is 

* getUserData is used to get users
.......................................................................................................
*/
  getUserData(data:any) {
    return this.http.post(this.baseUrl + 'NotificationConfig/GetUsers',data).pipe(map((response: any) => {
      if (response.Statuscode == 200) {
        return response
      }
      else {
        this.toastr.error(response.Message)
      }
    }
    ));
  }

   
/*  
......................................................................................................
* This is the saveNotificationChanges function

* @param data is changed data from notification page 

* saveNotificationChanges is used to save data
.......................................................................................................
*/
  saveNotificationChanges(data:any) {
    return this.http.post(this.baseUrl + 'NotificationConfig/SaveChanges',data).pipe(map((response: any) => {
      if (response.Statuscode == 200) {
        this.toastr.success(response.Message)
      }     
    }
    ));
  }

  /*  
......................................................................................................
* This is the addUserOrRole function

* @param data is user and roles from notification page 

* addUserOrRole is used to add user and assign role
.......................................................................................................
*/
  addUserOrRole(data:any) {
    return this.http.post(this.baseUrl + 'NotificationConfig/AddRoleOrUser',data).pipe(map((response: any) => {
      return this.responseData(response)
    }
    ));
  }

   /*  
......................................................................................................
* This is the getTemplate function

* @param data is event type and event selected  from notification page 

* getTemplate is used to get a notification templates 
.......................................................................................................
*/
  getTemplate(data:any) {
    return this.http.post(this.baseUrl + 'NotificationConfig/GetTemplate',data).pipe(map((response: any) => {
      return this.responseData(response)
    }
    ));
  }

     /*  
......................................................................................................
* This is the saveTemplate function

* @param data is event type and event selected and template from notification page 

* saveTemplate is used to save a notification templates 
.......................................................................................................
*/
  saveTemplate(data:any) {
    return this.http.post(this.baseUrl + 'NotificationConfig/SaveTemplate',data).pipe(map((response: any) => {
      return this.responseData(response)
    }
    ));
  }

  /*  
......................................................................................................
* This is the getUserData function

* @param data is 

* getUserData is used to get users
.......................................................................................................
*/
  getUsers() {
    return this.http.get(this.baseUrl + 'NotificationConfig/GetUsers').pipe(map((response: any) => {
      return this.responseData(response)
    }
    ));
  }

  /*  
......................................................................................................
* This is the getEventAssociatedTaxData function

* @param data is tax data

* getEventAssociatedTaxData is used to get event for specific Tax module
.......................................................................................................
*/
  getEventAssociatedTaxData() {
    return this.http.get(this.baseUrl + 'NotificationConfig/GetEventAssociatedTaxData').pipe(map((response: any) => {
      return response;
    }
    ));
  }

    /*  
......................................................................................................
* This is the getEventAssociatedTaxData function

* getEventAssociatedTaxData is used to get event for specific Tax module
.......................................................................................................
*/
  getEvents(data:any) {
    return this.http.post(this.baseUrl + 'NotificationConfig/GetEventsByTaxIds',data).pipe(map((response: any) => {
      return this.responseData(response)
    }
    ));
  }
  responseData(response: any) {
    if (response) {
      return response
    }
    else {
      this.toastr.error(response.Message)
    }
  }
}
