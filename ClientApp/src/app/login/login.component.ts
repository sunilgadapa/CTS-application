import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup,} from '@angular/forms';
import { AuthenticationService } from '../_services/identity/authentication.service';
import { User } from '../_models/user';
import { UserData } from '../_models/userData';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public loadingTemplate: TemplateRef<any>;
  public loading = false;
  hide = true;
  model: any = {};
  IsErrorVisible: boolean = true;
  public showPasswordOnPress: boolean = false;
  registerForm: FormGroup;
  submitted = false;
  data: any = {};
  userData: UserData;
  user: User;
  userNew= {
    user:'',
    userName:'',
    password:''
  };
  isInvalid: boolean;
  labelError: string;
  constructor(    
    private authenticationService: AuthenticationService,   
    public router: Router
  ) {}
/*  
  * This is the ngOnInit function  
  * ngOnInit() is used to get all required data on page load event
*/
  ngOnInit() {
    this.checkIfUserOnboarded()    
  }
/*  
  * This is the checkIfUserOnboarded function  
  * checkIfUserOnboarded() is used to check if user is onboarded or not
*/
  checkIfUserOnboarded(){
    this.loading = true;
    this.authenticationService.checkUserOnboarded().subscribe(
      //Make HTTP call to post API call
      (response) => {
        if (response.Statuscode === 200) {   
          this.loading = false; 
          localStorage.setItem('onBordeduser', JSON.stringify(response));
          this.router.navigate([response.data.routes]);
        }      
      },
      (error) => {
        this.loading = false; 
        this.router.navigate(['/notonboarded']);
      }
    );
  }
}
