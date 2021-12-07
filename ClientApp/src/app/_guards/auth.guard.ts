import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { JwtAuthService } from './../_services/identity/jwt-auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(public auth: JwtAuthService, private toastr: ToastrService, private router: Router) { }
  canActivate(): boolean {
    if (!this.auth.isAuthenticated()) {
      setTimeout(() => {
        this.toastr.error('Session Expired! Please log in');
      }, 500);       
      this.router.navigate(['/']);       
      return false;
    }
    return true;
  }
}
