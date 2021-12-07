import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ConfigService } from '../config/config.service';


@Injectable({
  providedIn: 'root',
})

export class AuthenticationService {  
  configData = this.configService.getConfig();  
  baseUrl=this.configData.identityBaseUrl;
  constructor(private http: HttpClient, public router: Router,private configService: ConfigService) { }
          /*  
......................................................................................................
* This is the checkUserOnboarded function

* checkUserOnboarded is used to check wwther the user is on borded or not
.......................................................................................................
*/
  checkUserOnboarded(){ 
    return this.http.post(this.baseUrl + 'user/Onboard',null).pipe(map((response: any) => {     
      return response;
    }))
  }

  /*  
......................................................................................................
* This is the getNavItems function

* getNavItems is used to get navigation list
.......................................................................................................
*/
  getNavItems() {
    return this.http.get<any>(this.baseUrl + 'Menu/Menu').pipe(map((response: any) => {     
      return response;
    }
    ));
  }
}