import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NotificationCountResult} from './notification';
import { ConfigService } from 'src/app/_services/config/config.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  public notificationUrl:any;
  constructor(private http: HttpClient,private configService: ConfigService, private toastr: ToastrService) { 
    let configData = configService.getConfig();
    this.notificationUrl=configData.snsNotificationBaseUrl+'SnsNotification';
  }

  getNotificationCount(): Observable<NotificationCountResult> {
    const url = `${this.notificationUrl}/notificationcount`;
    return this.http.get<NotificationCountResult>(url)
      .pipe(
        map((response: any) => {
          return this.responseData(response);
        }),
        catchError(this.handleError)
      );
  }

  getNotificationMessage(NotificationParams:any) {
    const url = `${this.notificationUrl}/notificationResult`;
    return this.http.get<any>(url,{ params: NotificationParams })
    .pipe(map((response: any) => {
      return this.responseData(response);
    }),
    catchError(this.handleError)
    );
  }

  deleteNotifications(): Observable<{}> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.notificationUrl}/deletenotifications`;
    return this.http.delete(url, { headers: headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  archiveNotifications(archiveNotificationParam:any){
    var requestParam = new HttpParams();
    requestParam = requestParam.append('notificationId', archiveNotificationParam.notificationId);
    requestParam = requestParam.append('isAllSelected', archiveNotificationParam.isAllSelected);
    requestParam = requestParam.append('isArchiving', archiveNotificationParam.isArchiving);
    return this.http.post(this.notificationUrl + '/archiveNotification?','{}',{params: requestParam })
    .pipe(map((response: any) => {
      return response
    })
    ,catchError(this.handleError)
    );
  }

  getNotificationByIdAndUpdate(notificationId:any){
    var requestParam = new HttpParams();
    requestParam = requestParam.append('notificationId', notificationId);
    return this.http.get<any>(this.notificationUrl + '/getNotificationByIdAndUpdate?',{params: requestParam })
    .pipe(map((response: any) => {
      return this.responseData(response)
    })
    ,catchError(this.handleError)
    );
  }

  private handleError(err:any) {
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }

  responseData(response: any) {
    if (response) {
      return response.data
    }
    else {
      this.toastr.error(response.Message)
    }
  }
}
