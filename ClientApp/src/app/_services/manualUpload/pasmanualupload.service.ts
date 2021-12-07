import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { ConfigService } from '../config/config.service';
@Injectable({
  providedIn: 'root'
})
export class PasmanualuploadService {
  configData = this.configService.getConfig();
  baseUrl = this.configData.manualDataloadBaseUrl;
  filter: any = [];
  constructor(private http: HttpClient, private toastr: ToastrService, private configService: ConfigService) {
  }
  /*  
  ......................................................................................................
  * This is the GetPasDataLoad function
  
  
  *  GetPasDataLoad is used to get pas data
  .......................................................................................................
  */
  GetPasDataLoad(data: any) {
    return this.http.post(this.baseUrl + 'PasManualDataLoad/GetPasDataLoad', data).pipe(map((response: any) => {
      if (response) {
        return response
      }
    }))
  }
  /*  
  ......................................................................................................
  * This is the  signOffFile function
  
  
  *  signOffFile is used to sign off file
  .......................................................................................................
  */
  signOffFile(data: any) {
    return this.http.post(this.baseUrl + 'PasManualDataLoad/Signoff', data).pipe(map((response: any) => {
      return response
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
* This is the getFileById function
 * @param file_id is file id
 * getFileById is used to get file by id
.......................................................................................................
*/
  getFileById(file_id: any) {
    var lookup = new HttpParams().append('file_id', file_id);
    return this.http.get(this.baseUrl + 'PasManualDataLoad/GetPasFileDataById', { params: lookup }).pipe(map((response: any) => {
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
    if (documment_type_id == 9 || documment_type_id == 10 || documment_type_id == 11) {
      return this.http.get(this.baseUrl + 'PasManualDataLoad/GetPasDataLoadError', { params: lookup }).pipe(map((response: any) => {
        return this.responseData(response)
      }))
    }
    else {
      return this.http.get(this.baseUrl + 'ManualDataLoad/GetDataLoadError', { params: lookup }).pipe(map((response: any) => {
        return this.responseData(response)
      }))
    }
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
    if (documment_type_id == 9 || documment_type_id == 10 || documment_type_id == 11) {
      return this.http.get(this.baseUrl + 'PasManualDataLoad/GetPasDataLoadErrorHeader', { params: lookup }).pipe(map((response: any) => {
        return this.responseData(response)
      }))
    }
    else {
      return this.http.get(this.baseUrl + 'ManualDataLoad/GetDataLoadErrorHeader', { params: lookup }).pipe(map((response: any) => {
        return this.responseData(response)
      }))
    }
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
    if (documment_type_id == 19) {
      return this.saveClientThirdparty(data, fileId);
    }
    else if (documment_type_id == 9) {
      return this.saveMemberFileData(data, fileId);
    }
    else if (documment_type_id == 10) {
      return this.saveFinanceFileData(data, fileId);
    }
    else {
      return this.saveAdvisorFileData(data, fileId);
    }
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
  * This is the saveMemberFileData function
  * @param file_id is file id
  * saveMemberFileData is used to save response
  .......................................................................................................
  */
  private saveMemberFileData(data: any, fileId: number) {
    var memberFileFormData: any = new FormData();
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < Object.values(data[i]).length; j++) {
        memberFileFormData.append('MemberData[' + i + '].file_id', fileId);
        memberFileFormData.append('MemberData[' + i + '].' + Object.keys(data[i])[j] + '', Object.values(data[i])[j]);
      }
    }
    return this.http.post<any>(this.baseUrl + 'PasManualDataLoad/UpdateMemberFileErrorData', memberFileFormData).pipe(map((response: any) => {
      return response;
    }));
  }
  /*  
  ......................................................................................................
  * This is the saveFinanceFileData function
  * @param file_id is file id
  * saveFinanceFileData is used to save response
  .......................................................................................................
  */
  private saveFinanceFileData(data: any, fileId: number) {
    var financeFileFormData: any = new FormData();
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < Object.values(data[i]).length; j++) {
        financeFileFormData.append('FinanceData[' + i + '].file_id', fileId);
        financeFileFormData.append('FinanceData[' + i + '].' + Object.keys(data[i])[j] + '', Object.values(data[i])[j]);
      }
    }
    return this.http.post<any>(this.baseUrl + 'PasManualDataLoad/UpdateFinanceFileErrorData', financeFileFormData).pipe(map((response: any) => {
      return response;
    }));
  }
  /*  
  ......................................................................................................
  * This is the saveAdvisorFileData function
  * @param file_id is file id
  * saveAdvisorFileData is used to save response
  .......................................................................................................
  */
  private saveAdvisorFileData(data: any, fileId: number) {
    var advisorFileFormData: any = new FormData();
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < Object.values(data[i]).length; j++) {
        advisorFileFormData.append('AdvisorData[' + i + '].file_id', fileId);
        advisorFileFormData.append('AdvisorData[' + i + '].' + Object.keys(data[i])[j] + '', Object.values(data[i])[j]);
      }
    }
    return this.http.post<any>(this.baseUrl + 'PasManualDataLoad/UpdateAdvisorFileErrorData', advisorFileFormData).pipe(map((response: any) => {
      return response;
    }));
  }
  /*  
......................................................................................................
* This is the CheckIfFileHasMissingInformation function
* @param file_id is file id
* @param document_type_id is document_type_id
* CheckIfFileHasMissingInformation is used to check if file contains missing information data
.......................................................................................................
*/
  CheckIfFileHasMissingInformation(document_type_id: any, file_id: any) {
    var lookup = new HttpParams().append('document_type_id', document_type_id).append('file_id', file_id);
    return this.http.get(this.baseUrl + 'PasManualDataLoad/CheckIfFileHasMissingInformation', { params: lookup }).pipe(map((response: any) => {
      return this.responseData(response)
    }))
  }
  /*  
 ......................................................................................................
 * This is the GetMissingInformationByFileId function
  * @param file_id is file id
  * @param document_type_id is document_type_id
  * GetMissingInformationByFileId is used to get the missing information data
 .......................................................................................................
 */
  GetMissingInformationByFileId(document_type_id: any, file_id: any) {
    var lookup = new HttpParams().append('document_type_id', document_type_id).append('file_id', file_id);
    return this.http.get(this.baseUrl + 'PasManualDataLoad/GetMissingInformationByFileId', { params: lookup }).pipe(map((response: any) => {
      return this.responseData(response)
    }))
  }
  /*  
 ......................................................................................................
 * This is the AddMissingInformation function
  * @param file_id is file id
  * @param lookup_value_name is lookup_value_name
  * @param lookup_value_desc is lookup_value_desc
  * @param lookup_type_name is lookup_type_name
  * AddMissingInformation is used to add the missing information data
 .......................................................................................................
 */
  AddMissingInformation(lookup_value_name: any, lookup_value_desc: any, lookup_type_name: any, file_id: any,misc_value:any) {
    var lookup = new HttpParams().append('LookupValueName', lookup_value_name)
      .append('LookupValueDescription', lookup_value_desc)
      .append('LookupTypeName', lookup_type_name)
      .append('FileId', file_id)
      .append('misc_value', misc_value);
    return this.http.get(this.baseUrl + 'PasManualDataLoad/AddPasMissingInformation', { params: lookup }).pipe(map((response: any) => {
      return this.responseData(response)
    }))
  }
  /*  
 ......................................................................................................
 * This is the CheckIfLookupExists function  
  * @param lookup_value_name is lookup_value_name  
  * @param lookup_type_name is lookup_type_name
  * CheckIfLookupExists is used to check if lookup data exists
 .......................................................................................................
 */
  CheckIfLookupExists(lookup_value_name: any, lookup_type_name: any, file_id: any) {
    var lookup = new HttpParams().append('LookupValueName', lookup_value_name)
      .append('LookupTypeName', lookup_type_name)
      .append('FileId', file_id);
    return this.http.get(this.baseUrl + 'PasManualDataLoad/CheckIfLookupExists', { params: lookup }).pipe(map((response: any) => {
      return this.responseData(response)
    }))
  }
  /*  
  ......................................................................................................
  * This is the ReprocessFile function
  * @param document_type_id is a document_type_id
  * @param file_id is a file id
  * ReprocessFile is used to add the missing tax information data
  .......................................................................................................
  */
  ReprocessFile(document_type_id: any, file_id: any,) {
    debugger
    var lookup = new HttpParams().append('DocumentTypeId', document_type_id)
      .append('FileId', file_id);
    return this.http.post(this.baseUrl + 'PasManualDataLoad/ReprocessFile','', { params: lookup }).pipe(map((response: any) => {
      return this.responseData(response)
    }))
  }
  /*  
......................................................................................................
* This is the AddMissingTaxPeriodData function
* @param lookup is a json data
* AddMissingTaxPeriodData is used to add the missing tax information data
.......................................................................................................
*/
  AddMissingTaxPeriodData(lookup: any) {
    return this.http.post(this.baseUrl + 'PasManualDataLoad/AddMissingTaxPeriodData', lookup).pipe(map((response: any) => {
      return this.responseData(response)
    }))
  }
}
