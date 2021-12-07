import { Component, Inject, TemplateRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsermanagmentService } from '../../../../_services/userManagement/usermanagment.service';
import { NotificationconfigurationService } from '../../../../_services/admin/notificationconfiguration.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-assign-role',
  templateUrl: './assign-role.component.html',
  styleUrls: ['./assign-role.component.css']
})
export class AssignRoleComponent {
  public loadingTemplate: TemplateRef<any>;
  public loading = false;
  action: any;
  rolesData: any[] = [];
  userData: any[] = [];
  assignRoleOrAddUserRequestData = {
    RoleId: 0,
    EventIds: 0,
    EntityToAdd: "Role",
    Id: 0
  }
  selectedStates: any[] = [];
  roleddl: boolean = false;
  constructor(private dialogRef: MatDialogRef<AssignRoleComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private userManagementService: UsermanagmentService, private notificationsService: NotificationconfigurationService, private toastr: ToastrService) {
    this.action = data.selectedAction;
    this.assignRoleOrAddUserRequestData.EventIds = data.eventId
    if (this.action == "1") {
      this.getRoleData();
    } else {
      this.getUserData();
    }
  }
  /* 
      * This is the toggleArrowRole function  
      * toggleArrowRole() is used to animate the role dropdown list arrow
  */
  toggleArrowRole() {
    this.roleddl = this.roleddl === true ? false : true;
  }
  /*  
    * This is the getRoleData function     
    * getRoleData() is used to make API CALL to roles which are configured in an entire application
  */
  getRoleData() {
    this.userManagementService.getRoles().subscribe(role => {
      //Make HTTP call to post API call
      this.rolesData = role.data;
    })
  }
  /*  
    * This is the getUserData function     
    * getUserData() is used to make API CALL to users which are onboarded in an entire application
  */
  getUserData() {
    this.notificationsService.getUsers().subscribe(data => {
      
      this.userData = data.data;
      this.selectedStates = [...this.userData];
    })
  }
  /*  
    * This is the search function     
    * search() is used to filter users from the populated ddl
  */
  search(value: string) {
    let filter = this.userData.filter((item: any) =>
      item.UserName.toLowerCase().includes(value.toLowerCase())
    );
    return [...filter];
  }
  /*  
    * This is the onKey function     
    * onKey() is used to filter users from the populated ddl
  */
  onKey(event: any) {
    this.selectedStates = this.search(event?.target.value);
  }
  /*  
    * This is the checkResponse function     
    * checkResponse() is used to check the response returned by more than one function
  */
  checkResponse(data: any) {
    let newResponse = data
    if (newResponse.Statuscode == 200) {
      this.toastr.success(newResponse.Message);
      this.dialogRef.close(true);
    } else {
      setTimeout(() => {
        this.toastr.error(newResponse.Message);
      }, 500);
    }
    this.loading = false;
  }
  /*  
    * This is the checkError function     
    * checkError() is used to check the error returned by more than one function
  */
  checkError(error: any) {
    this.loading = false;
    setTimeout(() => {
      this.toastr.error(error.error.Message)
    }, 500);
    this.dialogRef.close(true);
  }
  /*  
    * This is the closePopup function     
    * closePopup() is used to close the opened modal popup
  */
  closePopup() {
    this.dialogRef.close(false);
  }
  /*  
    * This is the assignRoleORUser function     
    * assignRoleORUser() is used to make API CALL to assign roles or users to selected tax type and event
  */
  assignRoleORUser() {
    this.loading = true;
    if (this.action == '1') {
      if (this.assignRoleOrAddUserRequestData.RoleId > 0) {
        this.notificationsService.addUserOrRole(this.assignRoleOrAddUserRequestData).subscribe(data => {
          //Make HTTP call to post API call
          this.checkResponse(data)
        }, (error) => {
          this.checkError(error)
        })
      } else {
        setTimeout(() => {
          this.toastr.error("Select atleast one value")
        }, 500);
      }
    } else {
      this.assignRoleOrAddUserRequestData.EntityToAdd = 'User';
      if (this.assignRoleOrAddUserRequestData.Id > 0) {
        this.notificationsService.addUserOrRole(this.assignRoleOrAddUserRequestData).subscribe(data => {
          this.checkResponse(data)
        }, (error) => {
          this.checkError(error)
        })
      } else {
        setTimeout(() => {
          this.toastr.error("Select atleast one value")
        }, 500);
      }
    }
  }
}
