
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ConfigService } from '../config/config.service';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class CorrespondenceService {
  configData = this.configService.getConfig();
  baseUrl = this.configData.sassSubmissionBaseUrl;

  filter: any = [];
  constructor(private http: HttpClient, private configService: ConfigService, private toastr: ToastrService) { }

       /*  
......................................................................................................
* This is the getLookupdata function

* @param fileType is file type name

* getLookupdata is used to get look up data
.......................................................................................................
*/
  getBrandStatusLookupdata(filetype: string) {
    var data = new HttpParams()
      .append('type', filetype)
    return this.http.get<any>(this.baseUrl + 'Correspondence/GetCorrespondenceDropdowndata', { params: data }).pipe(map((response: any) => {
      if (response.Statuscode == 200) {
        return response.data;
      }
    }
    ));
  }
         /*  
......................................................................................................
* This is the getLookupdata function

* @param fileType is file type name

* getLookupdata is used to get look up data
.......................................................................................................
*/
getTypeEnvLookupdata(type: string) {
  var data = new HttpParams()
    .append('type', type)
  return this.http.get<any>(this.baseUrl + 'Correspondence/GetCorrespondenceDropdownTypeEnv', { params: data }).pipe(map((res: any) => {
    if (res.Statuscode == 200) {
      return res.data;
    }
  }
  ));
}
      /*  
......................................................................................................
* This is the getCorrespondanceData function

* @param data is required data for API call

* getCorrespondanceData is used to get data
.......................................................................................................
*/
  getCorrespondanceData(data: any) {
    return this.http.get<any>(this.baseUrl + 'Correspondence/GetCorrespondenceData', { params: data })
      .pipe(map((response: any) => {
        return this.responseData(response);
      }))

  }
    /*  
......................................................................................................
* This is the deleteFile function

* @param data is required data for API call

* deleteFile is used to get delete selected file
.......................................................................................................
*/
  deleteFile(data: any) {
    return this.http.post<any>(this.baseUrl + 'DataSubmission/DeletSubmissionFile', data)
      .pipe(map((responseData: any) => {
        return this.responseData(responseData);
      }
      ));
  }
   /*  
......................................................................................................
* This is the filePromote function

* @param data is required data for API call

* filePromote is used to promote selected file
.......................................................................................................
*/
  filePromote(data: any) {
    var param = new HttpParams().append('file_id', data)
    return this.http.post<any>(this.baseUrl + 'DataSubmission/PromoteSubmissionFile', '', { params: param })
      .pipe(map((response: any) => {
        return this.responseData(response);
      }
      ));
  }
  /*  
......................................................................................................
* This is the generateSnapshot function

* @param file_id is selected file id

* @param fileRegionId is selected file region id

* generateSnapshot is used to generate sanpshot
.......................................................................................................
*/

  generateSnapshot(file_id: any, fileRegionId: any) {
    var params = new HttpParams()
      .append('file_id', file_id)
      .append('fileRegionId', fileRegionId)
    return this.http.post<any>(this.baseUrl + 'DataSubmission/GenerateSnapshot', '', { params: params }).pipe(map((response: any) => {
      return this.responseData(response);
    }
    ));
  }
  /*  
......................................................................................................
* This is the responseData function

* responseData is used to handle API Response
.......................................................................................................
*/
  responseData(response: any) {
    if (response) {
      return response
    }
    else {
      this.toastr.error(response.Message)
    }
  }
  /*  
......................................................................................................
* This is the submitSarsFiles function

* @param file_id is selected file id

* submitSarsFiles is used to submit sars file
.......................................................................................................
*/
  submitSarsFiles(file_id: any) {
    var params = new HttpParams()
      .append('file_id', file_id)
    return this.http.post<any>(this.baseUrl + 'DataSubmission/SubmitSARSFile', '', { params: params }).pipe(map((response: any) => {
      return this.responseData(response);
    }
    ));
  }
 /*  
......................................................................................................
* This is the  getSarsSubmissionErrorData function

* @param file_id is selected file id

*  getSarsSubmissionErrorData is used to submit sars file
.......................................................................................................
*/
  getSarsSubmissionErrorData(file_id: any, page_no: any, size: any) {
    var params = new HttpParams()
      .append('file_id', file_id)
      .append('page', page_no)
      .append('size', size)
    return this.http.get<any>(this.baseUrl + 'DataSubmission/GetSarsSubmissionErrorData', { params: params })
      .pipe(map((response: any) => {
        return this.responseData(response);
      }
      ));
  }
/*  
......................................................................................................
* This is the  deletErrorFile function

* deletErrorFile is used to submit sars file
.......................................................................................................
*/
  deletErrorFile(data: any,fileType:any) {
    return this.http.post(this.baseUrl + 'DataSubmission/DeletSubmissionErrorFile', data)
    .pipe(map((responseData: any) => {
      return this.responseData(responseData);
    }
    ));
  }

}
