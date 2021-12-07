import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UsermanagmentService } from '../_services/userManagement/usermanagment.service';
import { AuthenticationService } from '../_services/identity/authentication.service';
@Injectable({
  providedIn: 'root'
})

export class RoleGuard implements CanActivate {
  user:any;
  constructor(private userManagementService: UsermanagmentService, private authenticationService: AuthenticationService,   )
  {
    this.user = JSON.parse(localStorage.getItem('onBordeduser') || '{}');
     if(this.user!=undefined && this.user!=null)
    {
    this.authenticationService.checkUserOnboarded().subscribe((response) => {
      if (response.Statuscode === 200) {   
        localStorage.setItem('onBordeduser', JSON.stringify(response));
       this.user = JSON.parse(localStorage.getItem('onBordeduser') || '{}');
      }
    });
  }
}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.isAuthorized(route);
  }
  private isAuthorized(route:ActivatedRouteSnapshot):boolean{
    var actualRoleIds:string[]=this.user.data.role_id.split(',');
    const expectedRoleIds:string[]=route.data.roleIds;
    const matchedRole=actualRoleIds.findIndex(ar=>expectedRoleIds.indexOf(ar)!=-1);
    return matchedRole<0?false:true;
  }
}
