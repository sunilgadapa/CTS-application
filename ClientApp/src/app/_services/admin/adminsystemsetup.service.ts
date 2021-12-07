import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { User } from '../../_models/user';
import { UserData, AddressData } from '../../_models/userData';
import { LookupData, MessageData } from '../../_models/LookupData';
import { map } from 'rxjs/operators';
import { ReplaySubject, Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { AddNewDomain, AddDomainValu } from '../../../app/_models/domainRef';
import { ConfigService } from '../config/config.service';
@Injectable({
  providedIn: 'root'
})
export class AdminSystemsetupService {
  configData = this.configService.getConfig();  
  baseUrl=this.configData.adminBaseUrl;
  domainBaseUrl=this.configData.domainDefinitionBaseUrl;
  user: User;
  submitFund = new Subject<any>();
  CTSEvents = new Subject<any>();
  editdtax = new Subject<any>();
  editdomain= new Subject<any>();
  editdtaxModule = new Subject<any>();
  editdtaxperiod = new Subject<any>();
  neweditdtax = new Subject<any>();
  getRadiodata = new Subject<any>();
  editdtaxsrc = new Subject<any>();
  editdmessage = new Subject<any>();
  clickRadiobtn = new Subject<any>();
  editTaxSrcCode=new  Subject<any>();
  GetmisData = {
    contact_id: 0,
    Page: 1,
    Size: 10,
    SearchText: null
  };
  private currentUserSource = new ReplaySubject<User | any>(1);
  currentUser$ = this.currentUserSource.asObservable();
  constructor(private http: HttpClient, private datePipe: DatePipe,private configService:ConfigService) { }
  
    /*  
......................................................................................................
* This is the GetLookupdata function

* @param lookup_type_name is look up type name

* @param page is selected page on  grid

* GetLookupdata is used to get look up type values
.......................................................................................................
*/
  GetLookupdata(lookup_type_name: string, page: any) {
    var lookup = new HttpParams();
    lookup = lookup.append('page_no', page);
    lookup = lookup.append('lookup_type_name', lookup_type_name);
    return this.http.get<LookupData>(this.baseUrl + 'Admin/GetLookupValue', { params: lookup }).pipe(map((response: any) => {
      if (response.Statuscode == 200) {
        return response;
      }
         }
    ));
  }

      /*  
......................................................................................................
* This is the GetTaxPeriodData function

* @param size is size of page

* @param page is selected page on  grid

* GetTaxPeriodData is used to get look up type values
.......................................................................................................
*/
GetTaxPeriodData(size:any, page: any) {
  var lookup = new HttpParams();
  lookup = lookup.append('PageNumber', page);
  lookup = lookup.append('Size', size);
  return this.http.get(this.baseUrl + 'Admin/GetTaxPeriodData', { params: lookup }).pipe(map((responsedata: any) => {
    if (responsedata.Statuscode == 200) {
      return responsedata;
    }
       }
  ));
}


      /*  
......................................................................................................
* This is the GetLookupdata function

* @param lookup_type_name is look up type name

* @param page is selected page on  grid

* GetLookupdata is used to get look up type values
.......................................................................................................
*/
  getLookTaxdata(lookupTypeName: string, page_no: any) {
    var lookup = new HttpParams();
    lookup = lookup.append('page', page_no);
    lookup = lookup.append('lookup_type_name', lookupTypeName);
    return this.http.get<any>(this.baseUrl + 'Admin/GetLookupValue', { params: lookup }).pipe(map((response: any) => {
      if (response.Statuscode == 200) {
        return response.data;
      }
    }
    ));
  }

      /*  
......................................................................................................
* This is the GetLookupdataBYID function

* @param lookup_type_name is look up type name

* @param lookup_value_id is ID of lookup value

* GetLookupdataBYID is used to get look up type values by ID
.......................................................................................................
*/
  GetLookupdataBYID(lookup_value_id: any, lookup_type_name: string) {
    var lookup = new HttpParams();
    lookup = lookup.append('lookup_value_id', lookup_value_id);
    lookup = lookup.append('lookup_type_name', lookup_type_name);
    return this.http.get<LookupData>(this.baseUrl + 'Admin/GetLookupValueById', { params: lookup }).pipe(map((response: any) => {
         return response;
    }
    ));
  }

        /*  
......................................................................................................
* This is the PostLookupdata function

* @param lookup is a set of look up values

* PostLookupdata is used to save the look up type values 
.......................................................................................................
*/
  PostLookupdata(lookup: LookupData) {
    return this.http.post<UserData>(this.baseUrl + 'Admin/AddEditLookupValue', lookup).pipe(map((response: any) => {
      return response;
    }))
  }


        /*  
......................................................................................................
* This is the PostLookupdata function

* @param lookup is a set of look up values

* PostLookupdata is used to save the look up type values 
.......................................................................................................
*/
AddEditTaxPeriodData(taxPeriodData:any) {
  return this.http.post(this.baseUrl + 'Admin/AddEditTaxPeriodData', taxPeriodData).pipe(map((response: any) => {
    return response;
  }))
}

          /*  
......................................................................................................
* This is the PostSavechanges function

* @param lookup is a set of look up values

* PostSavechanges is used to save the look up type values 
.......................................................................................................
*/
  PostSavechanges(lookup: any) {
    return this.http.post<UserData>(this.baseUrl + 'Admin/SaveLookup', lookup).pipe(map((response: any) => {
      return response;
    }))
  }

  SaveTaxPeriodData(taxPeriodData: any) {
    return this.http.post(this.baseUrl + 'Admin/SaveTaxPeriodData', taxPeriodData).pipe(map((response: any) => {
      return response;
    }))
  }
  //#region Admin modules-Popup
  
  GetMisseDropValues(lookup_type_name: string, type: string) {
    var lookup = new HttpParams();
    lookup = lookup.append('lookup_type_name', lookup_type_name);
    lookup = lookup.append('type', type);
    return this.http.get<LookupData>(this.baseUrl + 'Admin/GetMiscDropDownValue', { params: lookup }).pipe(map((response: any) => {
      return response;
    }
    ));
  }


        /*  
......................................................................................................
* This is the GetMiscDDLDataByTaxModuleId function

* @param lookup_type_name is look up type name

* @param lookup_value_id is ID of lookup value

* GetMiscDDLDataByTaxModuleId is used to get Misc data by tax module id
.......................................................................................................
*/
  GetMiscDDLDataByTaxModuleId(lookup_type_name: string, lookup_value_id: any ) {
    var lookup = new HttpParams();
    lookup = lookup.append('lookup_type_name', lookup_type_name);
    lookup = lookup.append('lookup_value_id', lookup_value_id);
    return this.http.get<LookupData>(this.baseUrl + 'Admin/GetMiscDDLDataByTaxModuleId', { params: lookup }).pipe(map((response: any) => {
      return response;
    }
    ));
  }

          /*  
......................................................................................................
* This is the PostMiscellaneosData function

* PostMiscellaneosData is used to post misc data
.......................................................................................................
*/
  PostMiscellaneosData(misData: any) {
    var misform: any = new FormData()
    for (let i = 0; i < misData.length; i++) {
      misform.append('MiscData[' + i + '].other_misc_info_id', misData[i].other_misc_info_id);
      misform.append('MiscData[' + i + '].lookup_value_id', misData[i].lookup_value_id);
      misform.append('MiscData[' + i + '].value', misData[i].value);
      misform.append('MiscData[' + i + '].contact_id', misData[i].contact_id);
      misform.append('MiscData[' + i + '].effective_date', this.datePipe.transform(misData[i].effective_date, "dd/MM/yyyy"));
      misform.append('MiscData[' + i + '].expiry_date', this.datePipe.transform(misData[i].expiry_date, "dd/MM/yyyy"));
      misform.append('MiscData[' + i + '].contact_type', misData[i].contact_type);
    }
    return this.http.post<any>(this.baseUrl + 'Admin/AddEditMiscData', misform).pipe(map((response: any) => {
      return response;
    }))
  }

           /*  
......................................................................................................
* This is the GetMiscOrLegalDataById function

* GetMiscOrLegalDataById is used to get misc or legal data by id
.......................................................................................................
*/
  GetMiscOrLegalDataById(newMisData: any) {
    return this.http.post<any>(this.baseUrl + 'Admin/GetMiscellanousData', newMisData).pipe(map((response: any) => {
      return response;
    }))
  }

             /*  
......................................................................................................
* This is the GetMiscOrLegalDataById1 function

* GetMiscOrLegalDataById1() is used to get misc or legal data by id
.......................................................................................................
*/
  GetMiscOrLegalDataById1(newMisData: any) {
    return new Promise((resolve,reject)=>{
      this.http.post(this.baseUrl + 'Admin/GetMiscellanousData', newMisData).subscribe(response=>{
        resolve(response)
      },(err)=>{
        reject(err)
      })
      })
  }

             /*  
......................................................................................................
* This is the  postEmailData function

*  postEmailData() is used to post email data
.......................................................................................................
*/
  postEmailData(emailData: any) {
    var emailForm: any = new FormData()
    for (let i = 0; i < emailData.length; i++) {
      emailForm.append('EmailData[' + i + '].email_id', emailData[i].email_id);
      emailForm.append('EmailData[' + i + '].email_type_id', emailData[i].lookup_value_id);
      emailForm.append('EmailData[' + i + '].value', emailData[i].value);
      emailForm.append('EmailData[' + i + '].contact_id', emailData[i].contact_id);
      emailForm.append('EmailData[' + i + '].effective_date', this.datePipe.transform(emailData[i].effective_date, "dd/MM/yyyy"));
      emailForm.append('EmailData[' + i + '].expiry_date', this.datePipe.transform(emailData[i].expiry_date, "dd/MM/yyyy"));
    }
    return this.http.post<any>(this.baseUrl + 'Admin/AddEditEmailData', emailForm).pipe(map((response: any) => {
      return response;
    }))
  }
  
             /*  
......................................................................................................
* This is the getEmailData function

* getEmailData() is used to get email data
.......................................................................................................
*/
  getEmailData(emailData: any) {
    return this.http.post<any>(this.baseUrl + 'Admin/GetEmailData', emailData).pipe(map((response: any) => {
      return response;
    }))
  }

              /*  
......................................................................................................
* This is the  getContactData function

* getContactData() is used to get contact data
.......................................................................................................
*/
  getContactData(contactData: any) {
    return this.http.post<any>(this.baseUrl + 'Admin/GetContactData', contactData).pipe(map((response: any) => {
      return response;
    }))
  }

  
              /*  
......................................................................................................
* This is the postContactData function

* postContactData() is used to post contact data
.......................................................................................................
*/
  postContactData(contactData: any) {
    var contactForm: any = new FormData()
    for (let i = 0; i < contactData.length; i++) {
      contactForm.append('ContactData[' + i + '].phone_id', contactData[i].phone_id);
      contactForm.append('ContactData[' + i + '].phone_type_id', contactData[i].lookup_value_id);
      contactForm.append('ContactData[' + i + '].country_code', contactData[i].country_code);
      contactForm.append('ContactData[' + i + '].value', contactData[i].value);
      contactForm.append('ContactData[' + i + '].contact_id', contactData[i].contact_id);
      contactForm.append('ContactData[' + i + '].effective_date', this.datePipe.transform(contactData[i].effective_date, "dd/MM/yyyy"));
      contactForm.append('ContactData[' + i + '].expiry_date', this.datePipe.transform(contactData[i].expiry_date, "dd/MM/yyyy"));
    }
    return this.http.post<any>(this.baseUrl + 'Admin/AddEditcontactData', contactForm).pipe(map((response: any) => {
      return response;
    }))
  }
              /*  
......................................................................................................
* This is the SaveCommunicationAddressData function

* SaveCommunicationAddressData() is used to save address data
.......................................................................................................
*/
  SaveCommunicationAddressData(address: AddressData) {
    return this.http.post<AddressData>(this.baseUrl + 'Admin/AddEditAddressData', address).pipe(map((response: any) => {
      return response;
    }))
  }

               /*  
......................................................................................................
* This is the getAddressData function

* getAddressData() is used to get address data
.......................................................................................................
*/
  getAddressData(contact_id: any) {
    var lookup = new HttpParams();
    lookup = lookup.append('contact_type_id', contact_id);
    return this.http.get<LookupData>(this.baseUrl + 'Admin/GetAddressData', { params: lookup }).pipe(map((response: any) => {
             return response;
    }
    ));
  }
  //#endregion
  //messaging Event
                /*  
......................................................................................................
* This is the AddMessagingEvent function

* AddMessagingEvent() is used to add messaging event
.......................................................................................................
*/
  AddMessagingEvent(message: MessageData) {
    return this.http.post<UserData>(this.baseUrl + 'MessagEvent/AddEditMessageEvent', message).pipe(map((response: any) => {
      return response;
    }))
  }
                 /*  
......................................................................................................
* This is the GetMessageDataById function

* GetMessageDataById() is used to get message data by id
.......................................................................................................
*/
  
  GetMessageDataById(newMessageData: any) {
    return this.http.post<any>(this.baseUrl + 'MessagEvent/GetMessageEvent', newMessageData).pipe(map((response: any) => {
      return response;
    }))
  }
                  /*  
......................................................................................................
* This is the  PostMessagingEvent function

*  PostMessagingEvent() is used to post messaging event
.......................................................................................................
*/
  PostMessagingEvent(lookupsavemessage: LookupData) {
    return this.http.post<LookupData>(this.baseUrl + 'MessagEvent/SaveMessageEvent', lookupsavemessage).pipe(map((response: any) => {
      return response;
    }))
  }
                  /*  
......................................................................................................
* This is the  GetAddressDropValues function

* GetAddressDropValues() is used to get dropdown values
.......................................................................................................
*/
  GetAddressDropValues(type: string) {
    var newaddress = new HttpParams();
    newaddress = newaddress.append('type', type);
    return this.http.get(this.baseUrl + 'Admin/GetDropDownData', { params: newaddress }).pipe(map((response: any) => {
    
      return response;
    }
    ));
  }
  //domain and refrence Start
                   /*  
......................................................................................................
* This is the AddDomainRefData function

* AddDomainRefData() is used to add domain referance data
.......................................................................................................
*/
  AddDomainRefData(domainname: AddNewDomain) {
    return this.http.post<AddNewDomain>(this.domainBaseUrl + 'Domain/AddEditDomainData', domainname).pipe(map((response: any) => {
      return response;
    }))
  }
                    /*  
......................................................................................................
* This is the  GetDomainRefNameById function

*  GetDomainRefNameById() is used to get domain referance name by id
.......................................................................................................
*/
  GetDomainRefNameById(domainname: any) {
    return this.http.post<any>(this.domainBaseUrl + 'Domain/GetDomainDef', domainname).pipe(map((response: any) => {
     
        return response;
      
    }))
  }
                     /*  
......................................................................................................
* This is the SaveDomainRefName function

* SaveDomainRefName() is used to save domain referance name 
.......................................................................................................
*/
  SaveDomainRefName(lookup: any) {
    return this.http.post<any>(this.domainBaseUrl + 'Domain/SaveDomainDef', lookup).pipe(map((response: any) => {
      return response;
    }))
  }
                      /*  
......................................................................................................
* This is the AddaddDomainValueEvent function

* AddaddDomainValueEvent() is used to add domain value
.......................................................................................................
*/
  AddaddDomainValueEvent(domainvalue: AddDomainValu) {
    return this.http.post<AddDomainValu>(this.domainBaseUrl + 'Domain/AddEditDomainRefData', domainvalue).pipe(map((response: any) => {
      return response;
    }))
  }
                        /*  
......................................................................................................
* This is the GetDomainValuesById function

* GetDomainValuesById() is used to get domain value
.......................................................................................................
*/
  GetDomainValuesById(domainname: any) {
    return this.http.post<any>(this.domainBaseUrl + 'Domain/GetDomainRef', domainname).pipe(map((response: any) => {
     
        return response;
      
    }))
  }
                          /*  
......................................................................................................
* This is the SaveDomainReValues function

* SaveDomainReValues() is used to save domain value
.......................................................................................................
*/
  SaveDomainReValues(lookup: any) {
    return this.http.post<any>(this.domainBaseUrl + 'Domain/SaveDomainRef', lookup).pipe(map((response: any) => {
      return response;
    }))
  }
                            /*  
......................................................................................................
* This is the GetValidationType function

* GetValidationType() is used to get validation type
.......................................................................................................
*/
  GetValidationType(validationType:string) {
    var param:any=new  HttpParams;
    param = param.append('validationType', validationType);
    return this.http.get(this.domainBaseUrl + 'DomainValidation/GetValidationType',{ params: param }).pipe(map((response: any) => {
      return response;
    }
    ));
  }
                              /*  
......................................................................................................
* This is the GetValidationRule function

* GetValidationRule() is used to get validation rule
.......................................................................................................
*/
  GetValidationRule(lookup_value_id:any){
    var param:any=new  HttpParams;
    param = param.append('lookup_value_id', lookup_value_id);
    return this.http.get(this.domainBaseUrl + 'DomainValidation/GetValidationRule', { params: param }).pipe(map((response: any) => {
     
      return response;
    }
    ));
  }
                                /*  
......................................................................................................
* This is the GetValidationRulePromise function

* GetValidationRulePromise() is used to get validation rule
.......................................................................................................
*/
  GetValidationRulePromise(lookup_value_id:any){
    var param:any=new  HttpParams;
    param = param.append('lookup_value_id', lookup_value_id);
    return new Promise((resolve,reject)=>{
      this.http.get(this.domainBaseUrl + 'DomainValidation/GetValidationRule', { params: param }).subscribe(response=>{
        resolve(response)
      },(err)=>{
        reject(err)
      })
      })
  }
                                  /*  
......................................................................................................
* This is the GetDomainValues function

* GetDomainValues() is used to get domain values
.......................................................................................................
*/
  GetDomainValues(lookup_type_id:any){
    var param:any=new  HttpParams;
    param = param.append('lookupTypeId', lookup_type_id);
    return this.http.get(this.domainBaseUrl + 'DomainValidation/GetDomainValues', { params: param }).pipe(map((response: any) => {
     
      return response;
    }
    ));
  }
                                    /*  
......................................................................................................
* This is the SaveValidationRule function

* SaveValidationRuleis used to save validation rules
.......................................................................................................
*/
  SaveValidationRule(param:any){
    return this.http.post<any>(this.domainBaseUrl + 'DomainValidation/SaveValidationRule', param).pipe(map((response: any) => {
     
        return response;
      
    }))
  }
  
}
