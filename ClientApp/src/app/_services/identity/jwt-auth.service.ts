import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class JwtAuthService {
  userData: any;
  token=""
  constructor(public jwtHelper: JwtHelperService) { }
  public isAuthenticated(): boolean {
    this.userData = JSON.parse( localStorage.getItem('userData') || '{}');
    
    this.token = this.userData.token;
    return !this.jwtHelper.isTokenExpired(this.token);
  }
}
