import { Component, Inject, OnInit, TemplateRef } from '@angular/core';
import { UsermanagmentService } from '../../_services/userManagement/usermanagment.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { ValidationsetupService } from 'src/app/_services/common/validationsetup.service';
@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.css']
})
export class AdduserComponent implements OnInit {
  public loadingTemplate: TemplateRef<any>;
  public loading = false;
  isUserExists: boolean = false;
  isTaxModuleSelected: boolean = false;
  isRolesSelected: boolean = false;
  isMandatoryCheckboxSelected: boolean = false;
  enableErrorIcon: boolean = false;
  userForm: FormGroup;
  UserName: any = '';
  userInput: any;
  rolesdata: any;
  RoleItems: any;
  Roles: any[] = [];
  TaxModules: any[] = [];
  EntitiesToAdd: any[] = [];
  SourceSystemsToAdd: any[] = [];
  FundEntitiesToAdd: any[] = [];
  ConcatSrcSymFund: any[] = [];
  BrandsToAdd: any[] = [];
  rows: any[] = [];
  RoleId: any[] = []
  Entities: any[] = [];
  userData = {
    UserId: "",
    DateOfExpiry: "",
    RoleId: {},
    LookupEntities: {},
    TaxModuleId: {}
  }
  Tax_modules: any[] = []
  Source_Systems: any[] = [];
  Fund_Entity: any[] = [];
  Brand_Data: any[] = [];
  isUpdatebtn: boolean = false;
  dialogData: any;
  newDynamicIds: any[] = [];
  newRoleIds: any[] = [];
  newTaxModuleIds: any[] = [];
  datePlaceholder: any;
  textChanged: boolean = false;
  constructor(private dialogRef: MatDialogRef<AdduserComponent>, private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private userManagementService: UsermanagmentService,
    private formBuilder: FormBuilder, private toastr: ToastrService, public validation: ValidationsetupService) {
    this.datePlaceholder = this.validation.validationsArray.dateMetaData.datePlaceholder;
    if (data) {
      this.textChanged = false;
      if (data.mode == 'edit') {
        this.isUpdatebtn = true;
        this.isUserExists = true;
        this.isTaxModuleSelected = true;
        this.isRolesSelected = true;
        this.submitAndUpdateButtonVisibility();
        this.dialogData = data.updateData[0];
        this.getDialogTaxData();
        this.getDialogRoleData();
        this.getDialogSourceSymData();
        this.getDialogFundEntityData();
        this.getDialogBrandsData();
      }
    }
  }
  /*  
    * This is the getDialogBrandsData function  
    * getDialogBrandsData() is used to get brand data of selected row
  */
  private getDialogBrandsData() {
    if (this.dialogData.BrandIds != null) {
      var temp5 = this.dialogData.BrandIds.replace(/["']/g, "");
      var nameArr5 = temp5.split(',');
      for (let brandIds of nameArr5) {
        this.newDynamicIds.push(parseInt(brandIds));
        this.BrandsToAdd.push(parseInt(brandIds));
      }
    }
  }
/*  
  * This is the getDialogFundEntityData function  
  * getDialogFundEntityData() is used to get fund entity data of selected row
*/
  private getDialogFundEntityData() {
    if (this.dialogData.FundEntityIds != null) {
      var temp4 = this.dialogData.FundEntityIds.replace(/["']/g, "");
      var nameArr4 = temp4.split(',');
      for (let fundEntityId of nameArr4) {
        this.newDynamicIds.push(parseInt(fundEntityId));
        this.FundEntitiesToAdd.push(parseInt(fundEntityId));
      }
    }
  }
/*  
  * This is the getDialogSourceSymData function  
  * getDialogSourceSymData() is used to get source system data of selected row
*/
  private getDialogSourceSymData() {
    if (this.dialogData.SrcSymIds != null) {
      var temp3 = this.dialogData.SrcSymIds.replace(/["']/g, "");
      var nameArr3 = temp3.split(',');
      for (let srcSymId of nameArr3) {
        this.newDynamicIds.push(parseInt(srcSymId));
        this.SourceSystemsToAdd.push(parseInt(srcSymId));
      }
    }
  }
/*  
  * This is the getDialogRoleData function  
  * getDialogRoleData() is used to get role data of selected row
*/
  private getDialogRoleData() {
    if (this.dialogData.RolesIds != null) {
      var temp2 = this.dialogData.RolesIds.replace(/["']/g, "");
      var nameArr2 = temp2.split(',');
      for (let roleId of nameArr2) {
        this.newRoleIds.push(parseInt(roleId));
        this.RoleId.push(parseInt(roleId));
      }
      this.getEntitiesByRole(this.newRoleIds);
    }
  }
/*  
  * This is the getDialogTaxData function  
  * getDialogTaxData() is used to get tax data of selected row
*/
  private getDialogTaxData() {
    if (this.dialogData.TaxIds != null) {
      var temp = this.dialogData.TaxIds.replace(/["']/g, "");
      var nameArr = temp.split(',');
      for (let taxId of nameArr) {
        this.newTaxModuleIds.push(parseInt(taxId));
        this.TaxModules.push(parseInt(taxId));
      }
    }
  }
/*  
  * This is the ngOnInit function  
  * ngOnInit() is used to get all required data on page load event
*/
  ngOnInit() {
    this.getAllData();
    this.userForm = this.formBuilder.group({
      user_id: ['', Validators.required],
      date_of_expiry: ['', Validators.required],
    });
    this.userForm.controls.user_id.setValue(this.dialogData.UserName);
    var ddMMyyyy = this.datePipe.transform(this.dialogData.DateOfExpiry, "yyyy-MM-dd");
    this.userForm.controls.date_of_expiry.setValue(ddMMyyyy);
    setTimeout(() => {
      this.userForm.valueChanges.subscribe(() => {
        this.textChanged = true;
      })
    }, 3000);
  }
/*  
  * This is the onKey function  
  * @param event This is the OMCORE user id parameter
  * onKey() is used to get all required data on page load event
*/
  onKey(event: any) {
    var userId = event.target.value;
    if (userId.length == 14) {
      this.UserName = userId;
      this.userManagementService.doesUserExists(this.UserName).subscribe(
        response => {
          if (response) {
            this.isUserExists = true;
            this.enableErrorIcon = false;
            this.userInput = '';
          }
        }, (error) => {
          this.isUserExists = false;
          this.enableErrorIcon = true
          this.userInput = `Account ${userId} does not exist in Active Directory`;
        }
      );
    }
    else {
      if (userId.length == 0) {
        this.isUserExists = false;
        this.enableErrorIcon = true;
        this.userInput = `Please enter user ID`;
      }
      else {
        this.isUserExists = false;
        this.enableErrorIcon = true;
        this.userInput = `Account ${userId} does not exist in Active Directory`;
      }
    }
  }
/*  
  * This is the onConfirmClick function    
  * onConfirmClick() is used to add/update the users data on button click
*/
  onConfirmClick(): void {
    let userDetails = this.userForm.value
    this.userData.UserId = userDetails.user_id
    this.userData.DateOfExpiry = userDetails.date_of_expiry
    this.userData.RoleId = this.RoleId
    this.ConcatSrcSymFund = this.SourceSystemsToAdd.concat(this.FundEntitiesToAdd);
    this.EntitiesToAdd = this.ConcatSrcSymFund.concat(this.BrandsToAdd);
    this.userData.TaxModuleId = this.TaxModules
    if (this.EntitiesToAdd.length > 0) {
      this.userData.LookupEntities = this.EntitiesToAdd
      this.addEditUser()
    } else {
      setTimeout(() => {
        this.toastr.error("Please fill all data")
      }, 500);
    }
  }
/*  
  * This is the onCloseClick function    
  * onCloseClick() is used to close the add/update modal popup
*/
  onCloseClick() {
    this.dialogRef.close(false);
  }
/*  
  * This is the selectRoles function    
  * @param event This is the checkbox selection event parameter
  * @param row This is the selected row parameter 
  * selectRoles() is used to push selected roles in an array for further operations
*/
  selectRoles(event: any, row: any) {
    this.textChanged = true;
    if (event.checked) {
      this.RoleId.push(row.RoleId)
    }
    else {
      var index = this.RoleId.indexOf(row.RoleId);
      this.RoleId.splice(index, 1)
    }
    if (this.RoleId.length > 0) {
      this.isRolesSelected = true;
    }
    else {
      this.isRolesSelected = false;
    }
    this.getEntitiesByRole(this.RoleId);
    this.clearCheckboxes();
  }
/*  
  * This is the clearCheckboxes function    
  * clearCheckboxes() is used to clear the selected checkboxes
*/
  clearCheckboxes() {
    this.newDynamicIds = [];
    if (!this.Entities.includes('Brand')) {
      this.BrandsToAdd = [];
    }
    if (!this.Entities.includes('Retirement Fund Entity')) {
      this.FundEntitiesToAdd = [];
    }
    if (!this.Entities.includes('Source System')) {
      this.SourceSystemsToAdd = [];
    }
    this.submitAndUpdateButtonVisibility();
  }
/*  
  * This is the selectTaxModules function 
  * @param event This is the checkbox selection event parameter
  * @param row This is the selected row parameter    
  * selectTaxModules() is used to push selected tax modules in an array for further operations
*/
  selectTaxModules(event: any, row: any) {
    this.textChanged = true;
    if (event.checked) {
      this.TaxModules.push(row.lookup_value_id)
    }
    else {
      var index = this.rows.indexOf(row.lookup_value_id);
      this.TaxModules.splice(index, 1)
    }
    if (this.TaxModules.length > 0) {
      this.isTaxModuleSelected = true;
    }
    else {
      this.isTaxModuleSelected = false;
    }
  }
/*  
  * This is the submitAndUpdateButtonVisibility function    
  * submitAndUpdateButtonVisibility() is used to maintain mandatory field consistency based on each checkbox selection
*/
  submitAndUpdateButtonVisibility() {
    if ((this.Entities.includes('Source System') && this.SourceSystemsToAdd.length > 0) && (!this.Entities.includes('Retirement Fund Entity')) && (!this.Entities.includes('Brand'))) {
      this.isMandatoryCheckboxSelected = true;
    }
    else if ((!this.Entities.includes('Source System')) && (this.Entities.includes('Retirement Fund Entity') && this.FundEntitiesToAdd.length > 0) && (!this.Entities.includes('Brand'))) {
      this.isMandatoryCheckboxSelected = true;
    }
    else if ((!this.Entities.includes('Source System')) && (!this.Entities.includes('Retirement Fund Entity')) && (this.Entities.includes('Brand') && this.BrandsToAdd.length > 0)) {
      this.isMandatoryCheckboxSelected = true;
    }
    else if ((this.Entities.includes('Source System') && this.SourceSystemsToAdd.length > 0) && (this.Entities.includes('Retirement Fund Entity') && this.FundEntitiesToAdd.length > 0) && (!this.Entities.includes('Brand'))) {
      this.isMandatoryCheckboxSelected = true;
    }
    else if ((this.Entities.includes('Source System') && this.SourceSystemsToAdd.length > 0) && (!this.Entities.includes('Retirement Fund Entity')) && (this.Entities.includes('Brand') && this.BrandsToAdd.length > 0)) {
      this.isMandatoryCheckboxSelected = true;
    }
    else if ((!this.Entities.includes('Source System')) && (this.Entities.includes('Retirement Fund Entity') && this.FundEntitiesToAdd.length > 0) && (this.Entities.includes('Brand') && this.BrandsToAdd.length > 0)) {
      this.isMandatoryCheckboxSelected = true;
    }
    else if ((this.Entities.includes('Retirement Fund Entity') && this.FundEntitiesToAdd.length > 0) && (this.Entities.includes('Brand') && this.BrandsToAdd.length > 0) && (this.Entities.includes('Source System') && this.SourceSystemsToAdd.length > 0)) {
      this.isMandatoryCheckboxSelected = true;
    }
    else {
      this.isMandatoryCheckboxSelected = false;
    }
  }
/*  
  * This is the selectSourceSystems function    
  * @param event This is the checkbox selection event parameter
  * @param row This is the selected row parameter 
  * selectSourceSystems() is used to push selected source systems in an array for further operations
*/
  selectSourceSystems(event: any, row: any) {
    this.textChanged = true;
    if (event.checked) {
      this.SourceSystemsToAdd.push(row.lookup_value_id)
    }
    else {
      var index = this.rows.indexOf(row.lookup_value_id);
      this.SourceSystemsToAdd.splice(index, 1)
    }
    this.submitAndUpdateButtonVisibility();
  }
/*  
  * This is the selectFundEntities function    
  * @param event This is the checkbox selection event parameter
  * @param row This is the selected row parameter 
  * selectFundEntities() is used to push selected fund entities in an array for further operations
*/
  selectFundEntities(event: any, row: any) {
    this.textChanged = true;
    if (event.checked) {
      this.FundEntitiesToAdd.push(row.lookup_value_id)
    }
    else {
      var index = this.rows.indexOf(row.lookup_value_id);
      this.FundEntitiesToAdd.splice(index, 1)
    }
    this.submitAndUpdateButtonVisibility();
  }
/*  
  * This is the selectBrands function    
  * @param event This is the checkbox selection event parameter
  * @param row This is the selected row parameter 
  * selectBrands() is used to push selected brands in an array for further operations
*/
  selectBrands(event: any, row: any) {
    this.textChanged = true;
    if (event.checked) {
      this.BrandsToAdd.push(row.lookup_value_id)
    }
    else {
      var index = this.rows.indexOf(row.lookup_value_id);
      this.BrandsToAdd.splice(index, 1)
    }
    this.submitAndUpdateButtonVisibility();
  }
/*  
  * This is the addEditUser function      
  * addEditUser() is used to make API call to add/update user
*/
  addEditUser() {
    this.loading = true;
    this.userManagementService.addEditUser(this.userData).subscribe((response) => {
      //Make HTTP call to post API call
      let newResponse = response
      if (newResponse.Statuscode == 200) {
        this.dialogRef.close(true);
        this.loading = false;
        this.toastr.success(newResponse.Message);
      }
    }, (error) => {
      this.checkError(error)
    }
    )
  }
/*  
  * This is the getAllData function      
  * getAllData() is used to make API call to get all required data on add/update user popup
*/
  getAllData() {
    this.loading = true;
    const roles = this.userManagementService.getRoles();
    const taxModule = this.userManagementService.getLookupdata('Tax Module');
    const srcSym = this.userManagementService.getLookupdata('Source System');
    const fundEntity = this.userManagementService.getLookupdata('Retirement Fund Entity');
    const brand = this.userManagementService.getLookupdata('Brand');
    forkJoin([roles, taxModule, srcSym, fundEntity, brand]).subscribe(result => {
      this.rolesdata = result[0].data;
      this.Roles = this.rolesdata;
      this.Tax_modules = result[1];
      this.Tax_modules = this.Tax_modules.filter(
        (data: any) => data.status_flag === true);
      this.Source_Systems = result[2];
      this.Source_Systems = this.Source_Systems.filter(
        (data: any) => data.status_flag === true);
      this.Fund_Entity = result[3]
      this.Fund_Entity = this.Fund_Entity.filter(
        (data: any) => data.status_flag === true);
      this.Brand_Data = result[4]
      this.Brand_Data = this.Brand_Data.filter(
        (data: any) => data.status_flag === true);
      this.loading = false;
    }, (error) => {
      this.checkError(error)
    })
  }
/*  
  * This is the checkError function
  * @param error This is error parameter which contains information about the error      
  * checkError() is used to check and display the errors returned by fuction
*/
  checkError(error: any) {
    this.loading = false;
    setTimeout(() => {
      this.dialogRef.close(true);
      this.toastr.error('Something went wrong')
    }, 500);
  }
/*  
  * This is the getEntitiesByRole function
  * @param RoleId This is RoleId parameter of type an array
  * getEntitiesByRole() is used to get mandatory entities based on the roles selected
*/
  getEntitiesByRole(RoleId: number[]) {
    this.loading = true;
    this.userManagementService.getEntitiesByRole(RoleId).subscribe(response => {
      this.Entities = response;
      this.submitAndUpdateButtonVisibility();
      this.loading = false;
    }, (error) => {
      this.loading = false;
      setTimeout(() => {
        this.toastr.error('Something went wrong')
      }, 500);
    })
  }
}
