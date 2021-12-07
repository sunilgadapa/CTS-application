import { Component, OnInit,  Inject, TemplateRef } from "@angular/core";
import { MatDrawerContainer } from '@angular/material/sidenav';
import { SideNavItems } from "../../../_models/sideNavItems";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AdminSystemsetupService } from '../../../_services/admin/adminsystemsetup.service';
import { Router } from '@angular/router';
import { LookupData } from "../../../_models/LookupData";
import { UserData } from '../../../_models/userData';
import { Subscriber } from "rxjs";
import { ToastrService } from 'ngx-toastr';
import { SelectionModel } from "@angular/cdk/collections";
import { TableData } from "src/app/_models/tableData";
import { ValidationsetupService } from "../../../_services/common/validationsetup.service";
import { ConfirmPopupComponent } from "src/app/common/confirm-popup/confirm-popup.component";
@Component({
  selector: 'app-submitting-entity',
  templateUrl: './submitting-entity.component.html',
  styleUrls: ['./submitting-entity.component.css']
})
export class SubmittingEntityComponent implements  OnInit {
  public loadingTemplate: TemplateRef<any>;
  public loading = false;
  dialogRef: MatDialogRef<AddsubmitEntity> | null;
  state: string = 'default';
  p: any;
  page_no = 1;
  size = 7;
  isUpdatebtn: boolean = false;
  drawer: MatDrawerContainer;
  mode: string = 'side';
  navItems: SideNavItems[];
  lookup: LookupData;
  isInvalid: boolean;
  labelError: string;
  Success: any;
  successMessage: any;
  userName: any[] = [];
  totalSelectedRowdata = 0;
  UserIds: any[] = [];
  isSelectedSaveChange: boolean;
  newItem: any[] = [];
  totalRowdata = 0;
  subscription = new Subscriber();
  columns = [
    { columnDef: 'status_flag', header: 'Active', cell: (element: any) => `${element.status_flag}` },
    { columnDef: 'lookup_value_name', header: 'Submitting Entity', cell: (element: any) => `${element.lookup_value_name}` },
    { columnDef: 'lookup_value_description', header: 'Description', cell: (element: any) => `${element.lookup_value_description}` },
    { columnDef: 'editsfe', header: 'Amend', cell: (element: any) => `${element.edit}` },
  ];
  columnsToDisplay = this.columns.map(c => c.columnDef);
  tableData: LookupData[];
  constructor( public dialog: MatDialog,
    public adminsystemsetupservice: AdminSystemsetupService, private toastr: ToastrService,
   ) { }

   /*  
.......................................................................................................
* This is the ngOnInit function

* ngOnInit is used to call getlookupdata to bind the grid

* ngOnInit is also use for get a row value when click on amend in grid
.......................................................................................................
*/
  ngOnInit(): void {
    this.getlookupdata()
    this.subscription.add(this.adminsystemsetupservice.CTSEvents.subscribe(x => {
      this.lookup = x;
    }));
    this.subscription.add(this.adminsystemsetupservice.submitFund.subscribe(x => {
      this.lookup = x;
      this.openDialog();
    }));
  }

   /*  
.......................................................................................................
* This is the SelectCurrentPage function

* @param event is page no selected on grid

* SelectCurrentPage is used to get data for selected page
.......................................................................................................
*/
  SelectCurrentPage(event: any) {
    this.page_no = event
     this.getlookupdata()
  }

   /*  
  .......................................................................................................
    * This is the getlookupdata function
  
    * getlookupdata is api call function to get look up values as submitting entity
  .......................................................................................................
  */
  getlookupdata() {
    this.loading = true;
    const lookup_type_name = "Submitting Entity"
    const page_no = this.page_no;
    this.adminsystemsetupservice.GetLookupdata(lookup_type_name, page_no).subscribe(lookupdata => {
      this.tableData = lookupdata.data;
      this.totalRowdata = this.tableData[0].totalrows;
      this.totalSelectedRowdata = this.tableData[0].totalselectedrows;
      this.loading = false;
    }, (error) => {
      this.loading = false;
    });
  }

  /*  
.......................................................................................................
  * This is the openDialog function
 
  * openDialog is used to open a pop up for edit submitting entity
.......................................................................................................
*/
  openDialog() {
    if(this.dialog.openDialogs.length==0){
    const dialogRef = this.dialog.open(AddsubmitEntity, {
      data: {
        isUpdate: "edit",
        message: "Error!!!",
        lookup: this.lookup
      }, width: '40%',
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getlookupdata()
    });
  }
  }

/*  
.......................................................................................................
  * This is the AddSubmitingPop function
 
  * AddSubmitingPop is used to open a pop up for add submitting entity
.......................................................................................................
*/
  AddSubmitingPop() {
    this.dialogRef = this.dialog.open(AddsubmitEntity, { width: '40%', });
    this.dialogRef.afterClosed().subscribe(result => {
      this.getlookupdata()
    });
  }

/*  
.......................................................................................................
  * This is the SelectcheckBoxChnage function

  * @param selection is Selection model 

  * SelectcheckBoxChnage is used to get selected row from grid
.......................................................................................................
*/
  SelectcheckBoxChnage(selection: SelectionModel<TableData>) {
    this.newItem = [];
    this.newItem = selection.selected
    this.userName = [];
    this.UserIds = [];
    for (let user of this.newItem) {
      this.userName.push(user.UserName);
      this.UserIds.push(user.lookup_value_id);
    }
    if (this.userName.length > 0 || this.totalSelectedRowdata>0) {
      this.isSelectedSaveChange = true;
    }
    else {
      this.isSelectedSaveChange = false;
    }
  }

/*  
.......................................................................................................
* This is the SavechangeEntity function

* SavechangeEntity is used to Save the active deactive rows of data grid
.......................................................................................................
*/
  SavechangeEntity() {
    const dialogRef = this.dialog.open(ConfirmPopupComponent, {
      width: '40%',
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
    this.loading = true;
    this.lookup.ids = this.UserIds;
    this.lookup.lookup_type_name = 'Submitting Entity';
    this.lookup.Page = this.page_no;
    this.lookup.Size = this.size;
    this.lookup.totalselectedrows = this.totalSelectedRowdata;
    this.adminsystemsetupservice.PostSavechanges(this.lookup).subscribe(
      (response) => {
        if (response.Statuscode === 200) {
          this.Success = true;
          this.loading = false;
          this.toastr.success(response.Message);
          this.isSelectedSaveChange = false;
          setTimeout(() => {
            this.Success = false;
            this.successMessage = '';
          }, 500);
        }
      },
      (error) => {
        this.isInvalid = true;
        this.loading = false;
        setTimeout(() => {
          this.toastr.error('Something went wrong');
        }, 500);
      }
    );
      }else
      {
        this.isSelectedSaveChange = false;
        this.ngOnInit();
      }
    })
  }

}

@Component({
  selector: 'submit-entity-dialog',
  templateUrl: './addsubmit-entity.html',
  styleUrls: ['./submitting-entity.component.css']
})
export class AddsubmitEntity {
  public loadingTemplate: TemplateRef<any>;
  public loading = false;
  hide = true;
  model: any = {};
  IsErrorVisible: boolean = true;
  public showPasswordOnPress: boolean = false;
  submitted = false;
  userData: UserData;
  lookup: LookupData;
  isInvalid: boolean;
  labelError: string;
  lookup_value_description: any;
  EntityForm: FormGroup;
  submitEntity: string;
  isUpdatebtn: boolean = false;
  textChanged: boolean = false;
  Describe: string;
  Success: any;
  Fail: any;
  errorMessage: any;
  successMessage: any;
  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<AddsubmitEntity>, public adminsystemsetupservice: AdminSystemsetupService,
    public router: Router, @Inject(MAT_DIALOG_DATA) private data: any, private toastr: ToastrService, public validation: ValidationsetupService) {
    if (data) {
      if (data.isUpdate == 'edit') {
        this.isUpdatebtn = true;
      }
      this.lookup = data.lookup.row;
      this.textChanged = false;
    }
  }

 /*  
.......................................................................................................
* This is the ngOnInit function

* ngOnInit is used to build a form and validations 
.......................................................................................................
*/
  ngOnInit() {
    this.EntityForm = this.formBuilder.group({
      lookup_value_name: new FormControl('',
        [
          Validators.required,
          Validators.pattern(this.validation.validationsArray.submittingEntity.addSubmittingEntity.submittingEntityName.pattern),
          Validators.minLength(this.validation.validationsArray.submittingEntity.addSubmittingEntity.submittingEntityName.minLength),
          Validators.maxLength(this.validation.validationsArray.submittingEntity.addSubmittingEntity.submittingEntityName.maxLength)
        ]
      ),
      lookup_value_description: new FormControl('',
        [
          Validators.pattern(this.validation.validationsArray.submittingEntity.addSubmittingEntity.submittingEntityDescription.pattern),
          Validators.minLength(this.validation.validationsArray.submittingEntity.addSubmittingEntity.submittingEntityDescription.minLength),
          Validators.maxLength(this.validation.validationsArray.submittingEntity.addSubmittingEntity.submittingEntityDescription.maxLength)
        ]
      )
    });
    this.EntityForm.controls.lookup_value_name.setValue(this.lookup.lookup_value_name);
    this.EntityForm.controls.lookup_value_description.setValue(this.lookup.lookup_value_description);
    setTimeout(()=>{                          
      this.EntityForm.valueChanges.subscribe(() => {
        this.textChanged= true;
      })
    }, 3000);
  }

  /*  
......................................................................................................
* This is the f function

* f is used to get status of Form
.......................................................................................................
*/
  get f() {
    return this.EntityForm.controls;
  }

  /*  
.......................................................................................................
* This is the onSubmitEntity function

* onSubmitEntity is used to save the submitting enties
.......................................................................................................
*/
  onSubmitEntity() {
    this.loading=true;
    this.submitted = true;
    this.lookup = this.lookup ? this.lookup : this.EntityForm.value;
    if (this.EntityForm.invalid) {
      this.isInvalid = true;
    }
    this.lookup.lookup_value_id = (this.lookup.lookup_value_id?.toString() == undefined) ? 0 : this.lookup.lookup_value_id;
    this.lookup.lookup_type_name = 'Submitting entity';
    this.lookup.lookup_value_name = this.EntityForm.get('lookup_value_name')?.value;
    this.lookup.lookup_value_description = this.EntityForm.get('lookup_value_description')?.value;
    this.adminsystemsetupservice.PostLookupdata(this.lookup).subscribe(
      (response) => {
        if (response.Statuscode === 200) {
          this.Success = true;
          this.toastr.success(response.Message);
          this.dialogRef.close()  
        }          
      },
      (error) => {
        this.isInvalid = true;
        this.loading=false;
        setTimeout(() => {
          this.toastr.error(error.error.Message);  
        }, 500);      
        this.dialogRef.close()  
      }
    );
  }

/*  
.......................................................................................................
* This is the onNoClick function

* onNoClick is used to close the pop up
.......................................................................................................
*/
  onNoClick() {
    this.dialogRef.close();
  }

}
