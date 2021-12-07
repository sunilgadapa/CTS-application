import { HttpClient, HttpEvent, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core'
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ConfigService } from '../config/config.service';
import { SAVER, Saver } from '../common/saver.providers';
import { download, Download } from '../common/download'
import 'rxjs/add/operator/catch';
import { MatDialog } from '@angular/material/dialog';

const CACHE_SIZE = 1;
@Injectable({
  providedIn: 'root'
})
export class ManualUploadService {
  configData = this.configService.getConfig();
  baseUrl = this.configData.manualDataloadBaseUrl;

  filter: any = [];
  constructor(public dialog: MatDialog, private http: HttpClient, private toastr: ToastrService, private configService: ConfigService, @Inject(SAVER) private save: Saver) { }

         /*  
......................................................................................................
* This is the GetManualLoadData function

* @param data is data to fetch manual data

* GetManualLoadData is used to get look up data
.......................................................................................................
*/
  GetManualLoadData(data: any) {
    return this.http.post(this.baseUrl + 'ManualDataLoad/GetDatLoad', data).pipe(map((response: any) => {
      return this.responseData(response)
    }))

  }
        /*  
......................................................................................................
* This is the responseData function

* @param response is API response

* responseData is used to handle response
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
* This is the ProcessFile function

* @param file_id is file id

* @param file_name is file name

* ProcessFile is used to process file
.......................................................................................................
*/
  ProcessFile(file_id: any, file_name: string) {
    var lookup = new HttpParams().append('file_id', file_id).append('file_name', file_name);
    return this.http.post<any>(this.baseUrl + 'ManualDataLoad/ProcessFile', '', { params: lookup }).pipe(map((response: any) => {
      return this.responseData(response);
    }))

  }

       /*  
......................................................................................................
* This is the getLookupdata function

* @param fileType is file type name

* getLookupdata is used to get look up data
.......................................................................................................
*/
  getLookupdata(filetype: string) {
    var data = new HttpParams().set('type', filetype)
    return this.http.get(this.baseUrl + 'ManualDataLoad/GetDropdowndata', { params: data }).pipe(map((response: any) => {
      if (response.Statuscode == 200) {
        return response.data;
      }
    }
    ));
  }
      /*  
......................................................................................................
* This is the deleteFile function

* @param data is file meta data

* deleteFile is used to delete file
.......................................................................................................
*/
  deleteFile(data: any) {
    return this.http.post(this.baseUrl + 'ManualDataLoad/DeleteFile', data).pipe(map((response: any) => {
      return this.responseData(response)
    }
    ));
  }

    /*  
......................................................................................................
* This is the downloadFile function

* @param file_id is file id

* @param file_name is file name

* downloadFile is used to download file
.......................................................................................................
*/
  public downloadFile(file_id: any, file_name: string): Observable<HttpEvent<Blob>> {
    return this.http.request(new HttpRequest(
      'GET',
      `${this.baseUrl + 'ManualDataLoad/DownloadFile'}?file_id=${file_id}&&file_name=${file_name}`,
      null,
      {
        reportProgress: true,
        responseType: 'blob'
      }));
  }
  /*  
......................................................................................................
* This is the download function

* @param file_id is file id

* @param file_name is file name

* download is used to download file
.......................................................................................................
*/
  download(file_id: any, file_name?: any): Observable<Download> {
    return this.http.get(`${this.baseUrl + 'ManualDataLoad/DownloadFile'}?file_id=${file_id}&&file_name=${file_name}`, {
      reportProgress: true,
      observe: 'events',
      responseType: 'blob'
    }).pipe(download(blob => {
      this.save(blob, file_name);
    }))
  }
 /*  
......................................................................................................
* This is the errorHandler function

* errorHandleris used to handle error
.......................................................................................................
*/
  errorHandler(error: any): void {
    this.toastr.error("Something went wrong!");
    this.dialog.closeAll();
  }

 /*  
......................................................................................................
* This is the uploadFile function

* @param file_type_id is file id

* @param tax_Period is tax period

* @param fileis file

* uploadFile is used to upload file
.......................................................................................................
*/

  public uploadFile(file_type_id: any, tax_Period: any, file: File): Observable<HttpEvent<void>> {
    let formData = new FormData();
    formData.append('file_type', file_type_id);
    formData.append('tax_period', tax_Period);
    formData.append('upload', file);

    return this.http.request(new HttpRequest(
      'POST',
      this.baseUrl + 'ManualDataLoad/UploadFile',
      formData,
      {
        reportProgress: true
      }));
  }
 /*  
......................................................................................................
* This is the getFileById function

* @param file_id is file id

* getFileById is used to get file by id
.......................................................................................................
*/
  getFileById(file_id: any) {
    var lookup = new HttpParams().append('file_id', file_id);
    return this.http.get(this.baseUrl + 'ManualDataLoad/GetFileDataById', { params: lookup }).pipe(map((response: any) => {
      return this.responseData(response)
    }))
  }
 /*  
......................................................................................................
* This is the getFileErrorsById function

* @param file_id is file id

* @param documment_type_id is document id

* getFileErrorsById is used to get file errors by id
.......................................................................................................
*/
  getFileErrorsById(file_id: any, documment_type_id: any, page_no: any, size: any) {
    var lookup = new HttpParams().append('file_id', file_id)
      .append('documment_type_id', documment_type_id)
      .append('page_no', page_no)
      .append('size', size);
    return this.http.get(this.baseUrl + 'ManualDataLoad/GetDataLoadError', { params: lookup }).pipe(map((response: any) => {
     return  this.responseData(response)
    }))
  }
/*  
......................................................................................................
* This is the getFileErrorHeadersByI function

* @param file_id is file id

* @param documment_type_id is document id

* getFileErrorHeadersByI is used to get file headers by id
.......................................................................................................
*/
  getFileErrorHeadersById(file_id: any, documment_type_id: any, page_no: any, size: any) {
    var lookup = new HttpParams().append('file_id', file_id)
      .append('documment_type_id', documment_type_id)
      .append('page_no', page_no)
      .append('size', size);
    return this.http.get(this.baseUrl + 'ManualDataLoad/GetDataLoadErrorHeader', { params: lookup }).pipe(map((response: any) => {
      return this.responseData(response)
    }))
  }
/*  
......................................................................................................
* This is the  getFieErrorDescription function

* @param file_id is file id

* @param documment_type_id is document id

*  getFieErrorDescription is used to get file description
.......................................................................................................
*/
  getFieErrorDescription(file_id: any, documment_type_id: any, page_no: any, size: any) {
    var lookup = new HttpParams().append('file_id', file_id)
      .append('document_type_id', documment_type_id)
      .append('page_no', page_no)
      .append('size', size);
    return this.http.get(this.baseUrl + 'ManualDataLoad/GetErrorDescription', { params: lookup }).pipe(map((response: any) => {
      return this.responseData(response)
    }))
  }
/*  
......................................................................................................
* This is the saveErrors function

* @param file_id is file id

* @param documment_type_id is document id

*  saveErrors is used to save error
.......................................................................................................
*/
  saveErrors(documment_type_id: any, data: any, fileId: number) {
    if (documment_type_id == 4) {
      return this.savePrefCorrespodence(data, fileId);
    }
    else if (documment_type_id == 1) {
      return this.saveClientThirdparty(data, fileId);
    }
    else if (documment_type_id == 6) {
      return this.saveSampleCertificate(data, fileId);
    }
    else if (documment_type_id == 2) {
      return this.saveAdvisor(data, fileId);
    }
    else if (documment_type_id == 3) {
      return this.saveGcsResponse(data, fileId);
    }
    else {
      return this.http.post<any>(this.baseUrl + 'ManualDataLoad/GCSManualDATAUpload', data)
    }
  }
/*  
......................................................................................................
* This is the saveAdvisor function

* @param file_id is file id

* saveAdvisor is used to save response
.......................................................................................................
*/
  private saveAdvisor(data: any, fileId: number) {
    var advisorFileFormData: any = new FormData();
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < Object.values(data[i]).length; j++) {
        advisorFileFormData.append('AdvData[' + i + '].file_id', fileId);
        advisorFileFormData.append('AdvData[' + i + '].' + Object.keys(data[i])[j] + '', Object.values(data[i])[j]);
      }
    }
    return this.http.post<any>(this.baseUrl + 'ManualDataLoad/UpdateAdvisorFileData', advisorFileFormData).pipe(map((response: any) => {
      if (response) {
        return response;
      }
    }));
  }
/*  
......................................................................................................
* This is the saveSampleCertificate function

* @param file_id is file id

* saveSampleCertificate is used to save response
.......................................................................................................
*/
  private saveSampleCertificate(data: any, fileId: number) {
    var sampleCertFormData: any = new FormData();
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < Object.values(data[i]).length; j++) {
        sampleCertFormData.append('CerData[' + i + '].file_id', fileId);
        sampleCertFormData.append('CerData[' + i + '].' + Object.keys(data[i])[j] + '', Object.values(data[i])[j]);
      }
    }
    return this.http.post<any>(this.baseUrl + 'ManualDataLoad/UpdateSampleCerFileData', sampleCertFormData).pipe(map((response: any) => {

      return response;

    }));
  }
/*  
......................................................................................................
* This is the saveClientThirdparty function

* @param file_id is file id

* saveClientThirdparty is used to save response
.......................................................................................................
*/
  private saveClientThirdparty(data: any, fileId: number) {
    var thirdPartyFormData: any = new FormData();
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < Object.values(data[i]).length; j++) {
        thirdPartyFormData.append('CError[' + i + '].file_id', fileId);
        thirdPartyFormData.append('CError[' + i + '].' + Object.keys(data[i])[j] + '', Object.values(data[i])[j]);
      }
    }
    return this.http.post<any>(this.baseUrl + 'ManualDataLoad/UpdateCThiredPartyFileData', thirdPartyFormData).pipe(map((response: any) => {

      return response;

    }));
  }
 /*  
......................................................................................................
* This is the savePrefCorrespodence function

* @param file_id is file id

* savePrefCorrespodence is used to save response
.......................................................................................................
*/
  private savePrefCorrespodence(data: any, fileId: number) {
    var PrefferedCorrespondenceForm: any = new FormData();
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < Object.values(data[i]).length; j++) {
        PrefferedCorrespondenceForm.append('Pdata[' + i + '].file_id', fileId);
        PrefferedCorrespondenceForm.append('Pdata[' + i + '].' + Object.keys(data[i])[j] + '', Object.values(data[i])[j]);
      }
    }
    return this.http.post<any>(this.baseUrl + 'ManualDataLoad/UpdatePreferFileData', PrefferedCorrespondenceForm).pipe(map((response: any) => {
      return response;
    }));
  }
  /*  
......................................................................................................
* This is the saveGcsResponse function

* @param file_id is file id

*  saveGcsResponse is used to save response
.......................................................................................................
*/
  private saveGcsResponse(data: any, fileId: number) {
    var GcsResponseForm: any = new FormData();
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < Object.values(data[i]).length; j++) {
        GcsResponseForm.append('Gdata[' + i + '].file_id', fileId);
        GcsResponseForm.append('Gdata[' + i + '].' + Object.keys(data[i])[j] + '', Object.values(data[i])[j]);
      }
    }
    return this.http.post<any>(this.baseUrl + 'ManualDataLoad/UpdateGCSFileData', GcsResponseForm).pipe(map((response: any) => {
      return response;
    }));
  }
  /*  
......................................................................................................
* This is the deleteErrors function

* @param file_id is file id

* @param documment_type_id is document id

*  deleteErrors is used to delete error
.......................................................................................................
*/
  deleteErrors(documment_type_id: any, Ids: any) {
    const data = { 'Ids': Ids, 'file_type': documment_type_id };
    return this.http.post<any>(this.baseUrl + 'ManualDataLoad/DeleteErrorRow', data).pipe(map((response: any) => {
      if (response) {
        return response
      }
    }))
  }

}
