import { Injectable } from '@angular/core';
import * as Msal from 'msal';
import { Observable } from 'rxjs';
import { ConfigService } from '../config/config.service';

@Injectable()
export class MsalUserService {
    private accessToken: any;
    private sessionTimeOut:number;
    private clearTimeout: any;
    public clientApplication: Msal.UserAgentApplication;
    constructor(configService: ConfigService) {   
        let configData=configService.getConfig()
        this.sessionTimeOut=configData.sessionTimeOut;
        this.clientApplication = new Msal.UserAgentApplication(        
            configData.uiClienId,
            'https://login.microsoftonline.com/' + configData.tenantId,
            this.authCallback,
            {
                storeAuthStateInCookie: true,
                //cacheLocation: 'localStorage' ,  
            });

        this.autoLogOut();  
    }

    public GetAccessToken(): Observable<any> {
        if (sessionStorage.getItem('msal.idtoken') !== undefined && sessionStorage.getItem('msal.idtoken') != null) {
            this.accessToken = sessionStorage.getItem('msal.idtoken');
        }
        return this.accessToken;
    }

    public authCallback(errorDesc: any, token: any, error: any, tokenType: any) {
        if (token) {
            console.log(':');
        } else {
            console.log(error + ':' + errorDesc);
        }
    }

    public getCurrentUserInfo() {        
        const user = this.clientApplication.getUser();
        return user.name;
    }

    public logout() {
        localStorage.clear()
        this.clientApplication.logout(); 
        if (this.clearTimeout) {
            clearTimeout(this.clearTimeout);
        }      
    }
    public autoLogOut()
    {
        this.clearTimeout = setTimeout(() => {
            clearTimeout(this.clearTimeout);
            this.logout();
        }, this.sessionTimeOut);
    }
    public resetTimeout()
    {
        if (this.clearTimeout) {
            clearTimeout(this.clearTimeout);
        } 
        this.autoLogOut();
    }
}