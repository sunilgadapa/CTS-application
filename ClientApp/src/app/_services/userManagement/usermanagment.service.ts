
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { User } from '../../_models/user';
import { map } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { Search } from 'src/app/_models/search';
import { ConfigService } from '../config/config.service';

@Injectable({
  providedIn: 'root'
})
export class UsermanagmentService {
  configData = this.configService.getConfig();  
  baseUrl=this.configData.userManagementBaseUrl;
  adminBaseUrl=this.configData.adminBaseUrl;  
  user: User;
  private currentUserSource = new ReplaySubject<User | any>(1);
  currentUser$ = this.currentUserSource.asObservable();
  constructor(private http: HttpClient,private configService:ConfigService) { }


          /*  
......................................................................................................
* This is the doesUserExists function

* @param userName is a user name

* doesUserExists is used to check user is Exist in DB or not
.......................................................................................................
*/
  doesUserExists(userName: string) {
    const data = { 'username': userName };
    return this.http.post(this.baseUrl + 'UserManager/DoesUserExist', data)
  }

 /*  
......................................................................................................
* This is the getRoles function



* getRoles is used to get user roles
.......................................................................................................
*/
  getRoles() {
    return this.http.get<any>(this.baseUrl + 'UserManager/GetAllRoles').pipe(map((response: any) => {
      if (response) {
        this.currentUserSource.next(response.User);
      }
      return response;
    }
    ));
  }

   /*  
......................................................................................................
* This is the getUsers function

* @param search is a search text

* getUsers is used to get user by search text
.......................................................................................................
*/
  getUsers(search: Search) {
    return this.http.post<any>(this.baseUrl + 'UserManager/GetUsers', search).pipe(map((response: any) => {
      if (response) return response;
    }
    ));
  }

     /*  
......................................................................................................
* This is the deleteUsers function

* @param ids is a array of user ids to be deleted

* deleteUsers is used to delete user 
.......................................................................................................
*/
  deleteUsers(ids: number[]) {
    const data = {'UserIds' : ids};  
    return this.http.post<any>(this.baseUrl + 'UserManager/DeleteUsers', data).pipe(map((response: any) => {
      if (response) return response;
    }
    ));
  }

       /*  
......................................................................................................
* This is the addEditUser function

* @param data is a user details to be added or updated

* addEditUser is used to add or update user 
.......................................................................................................
*/
  addEditUser(data: any) {
    return this.http.post<any>(this.baseUrl + 'UserManager/AddEditUser', data).pipe(map((response: any) => {
      if (response) return response;
    }))

  }

 /*  
......................................................................................................
* This is the getLookupdata function

* @param lookupTypeName is a lookup Type Name

* getLookupdata is used get look up data
.......................................................................................................
*/
  getLookupdata(lookupTypeName: string) {    
    var data = new HttpParams().set('lookup_type_name', lookupTypeName)    
    return this.http.get<any>(this.adminBaseUrl + 'Admin/GetLookupValue', { params: data }).pipe(map((response: any) => {
      if (response.Statuscode == 200) {   
        return response.data;    
      }      
    }
    ));
  }
 
       /*  
......................................................................................................
* This is the getEntitiesByRole function

* @param ids is a array of role ids

* getEntitiesByRole is used toget deffrent entity assigned to perticular roles
.......................................................................................................
*/
  getEntitiesByRole(ids: number[]) {    
    const data = { 'RoleId': ids };
    return this.http.post(this.baseUrl + 'UserManager/GetEntitiesByRole', data).pipe(map((response: any) => {
      if (response) return response.data;
    }
    ));
  }
}
