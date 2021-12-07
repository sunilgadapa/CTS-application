import { Component, OnInit, Inject, TemplateRef } from "@angular/core";
import { MatDrawerContainer } from '@angular/material/sidenav';
import { SideNavItems } from "../../../_models/sideNavItems";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AdminSystemsetupService } from '../../../_services/admin/adminsystemsetup.service';
import { LookupData } from "../../../_models/LookupData";
import { UserData } from '../../../_models/userData';
import { Router } from '@angular/router';
import { Subscriber } from "rxjs";
import { ToastrService } from 'ngx-toastr';
import { SelectionModel } from "@angular/cdk/collections";
import { TableData } from "src/app/_models/tableData";
import { ValidationsetupService } from "../../../_services/common/validationsetup.service";
import { ConfirmPopupComponent } from "src/app/common/confirm-popup/confirm-popup.component";
@Component({
  selector: 'app-tax-module',
  templateUrl: './tax-module.component.html',
  styleUrls: ['./tax-module.component.css']
})
export class TaxModuleComponent implements OnInit {
  addTaxModuleForm: FormGroup;
  public loadingTemplate: TemplateRef<any>;
  public loading = false;
  dialogRef: MatDialogRef<AddtaxDialog> | null;
  state: string = 'default';
  isSavechangesSelect: boolean;
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
  isSelectedSaveChange: boolean;
  Success: any;
  successMessage: any;
  userName: any[] = [];
  UserIds: any[] = [];
  newItem: any[] = [];
  totalSelectedRowdata = 0;
  totalRowdata = 0;
  subscription = new Subscriber();
  columns = [
    { columnDef: 'status_flag', header: 'Active', cell: (element: any) => `${element.status_flag}` },
    { columnDef: 'lookup_value_name', header: 'Tax Module', cell: (element: any) => `${element.lookup_value_name}` },
    { columnDef: 'lookup_value_description', header: 'Module Name Description', cell: (element: any) => `${element.lookup_value_description}` },
    { columnDef: 'edits', header: 'Amend', cell: (element: any) => `${element.edit}` },
  ];
  columnsToDisplay = this.columns.map(c => c.columnDef);
  newTaxModuleIds: any[] = [];
  tableData: any[]=[];
  constructor(public dialog: MatDialog, private formBuilder: FormBuilder,
    public adminsystemsetupservice: AdminSystemsetupService, private toastr: ToastrService,
  ) { }
  
  ngOnInit(): void {
    this.addTaxModuleForm = this.formBuilder.group({
      tax_module: ['', Validators.required],
      module_name: ['', Validators.required],
    });
    this.getlookupdata()
    this.subscription.add(this.adminsystemsetupservice.CTSEvents.subscribe(x => {
      this.lookup = x;
    }));
    this.subscription.add(this.adminsystemsetupservice.editdtaxModule.subscribe(x => {
      this.lookup = x;
      this.openDialog();
    }));
  }

  /*  
  .......................................................................................................
    * This is the getlookupdata function

    * getlookupdata is api call function to get look up values as Tax Modules
  .......................................................................................................
  */
  getlookupdata() {
    this.loading = true;
    const lookup_type_name = "Tax Module"
    const page_no = this.page_no;
    this.adminsystemsetupservice.GetLookupdata(lookup_type_name, page_no).subscribe(lookupdata => {
      //Make HTTP call to get API call
      this.tableData = lookupdata.data;
      this.totalRowdata = this.tableData[0].totalrows
      this.totalSelectedRowdata = this.tableData[0].totalselectedrows
      this.loading = false;
    }, (error) => {
      this.loading = false;
    });
  }

  /*  
.......................................................................................................
  * This is the AddTaxmodulePop function
 
  * AddTaxmodulePop is used to open a pop up for add tax module
.......................................................................................................
*/
  AddTaxmodulePop() {
    this.dialogRef = this.dialog.open(AddtaxDialog, { width: '35%', });
    this.dialogRef.afterClosed().subscribe(result => {
      this.getlookupdata()
    });
  }

  /*  
.......................................................................................................
  * This is the openDialog function
 
  * openDialog is used to open a pop up for edit tax module
.......................................................................................................
*/
  openDialog() {
    if (this.dialog.openDialogs.length == 0) {
      this.dialog.open(AddtaxDialog, {
        data: {
          isUpdate: "edit",
          message: "Error!!!",
          lookup: this.lookup,
        }, width: '35%',
      });
    }
  }
  
  /*  
.......................................................................................................
  * This is the SelectcheckBoxChnage function

  * @param selection is Selection model 

  * SelectcheckBoxChnage is used to get selected row from grid
.......................................................................................................
*/
  SelectcheckBoxChnage(selection: SelectionModel<TableData>) {
    if (selection.selected.length === 1) {
      this.isSavechangesSelect = true;
    }
    else {
      this.isSavechangesSelect = false;
    }
    this.newItem = [];
    this.newItem = selection.selected
    this.userName = [];
    this.UserIds = [];
    for (let user of this.newItem) {
      this.userName.push(user.UserName);
      this.UserIds.push(user.lookup_value_id);
    }
    if (this.userName.length > 0 || this.totalSelectedRowdata > 0) {
      this.isSelectedSaveChange = true;
    }
    else {
      this.isSelectedSaveChange = false;
    }
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
* This is the SavechangeTax function

* SavechangeTax is used to Save the active deactive rows of data grid
.......................................................................................................
*/
  SavechangeTax() {
    const dialogRef = this.dialog.open(ConfirmPopupComponent, {
      width: '40%',
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.loading = true;
        this.lookup.ids = this.UserIds;
        this.lookup.lookup_type_name = 'Tax Module';
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
              this.toastr.error('Something went wrong')
            }, 500);
          }
        );
      } else {
        this.ngOnInit();
        this.isSelectedSaveChange = false;
      }
    });
  }
}

@Component({
  selector: 'tax-module-dialog',
  templateUrl: './addtaxmodule.html',
  styleUrls: ['./tax-module.component.css']
})
export class AddtaxDialog implements OnInit {
  public loadingTemplate: TemplateRef<any>;
  public loading = false;
  hide = true;
  model: any = {};
  IsErrorVisible: boolean = true;
  public showPasswordOnPress: boolean = false;
  registerForm: FormGroup;
  submitted = false;
  userData: UserData;
  lookup: LookupData;
  isInvalid: boolean;
  labelError: string;
  isUpdatebtn: boolean = false;
  lookup_value_id?: number;
  Success: any;
  successMessage: any;
  textChanged: boolean = false;
  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<AddtaxDialog>, public adminsystemsetupservice: AdminSystemsetupService,
    public router: Router, @Inject(MAT_DIALOG_DATA) private data: any, private toastr: ToastrService, public validation: ValidationsetupService) {
    if (data) {
      if (data.isUpdate == 'edit') {
        this.isUpdatebtn = true;
      }
      this.lookup = data.lookup.row;
      this.textChanged = false;
    }
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      lookup_value_name: new FormControl('',
        [
          Validators.required,
          Validators.pattern(this.validation.validationsArray.taxModule.addTaxModule.taxModuleName.pattern),
          Validators.minLength(this.validation.validationsArray.taxModule.addTaxModule.taxModuleName.minLength),
          Validators.maxLength(this.validation.validationsArray.taxModule.addTaxModule.taxModuleName.maxLength)
        ]),
      lookup_value_description: new FormControl('',
        [
          Validators.minLength(this.validation.validationsArray.taxModule.addTaxModule.moduleName.minLength),
          Validators.maxLength(this.validation.validationsArray.taxModule.addTaxModule.moduleName.maxLength)
        ]
      )
    });
    this.registerForm.controls.lookup_value_name.setValue(this.lookup.lookup_value_name);
    this.registerForm.controls.lookup_value_description.setValue(this.lookup.lookup_value_description);
    setTimeout(() => {
      this.registerForm.valueChanges.subscribe(() => {
        this.textChanged = true;
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
    return this.registerForm.controls;
  }

/*  
.......................................................................................................
* This is the TaxModuledata function

* TaxModuledata is used to save the tax moudle
.......................................................................................................
*/
  TaxModuledata() {
    this.loading = true;
    this.submitted = true;
    this.lookup = this.lookup ? this.lookup : this.registerForm.value;
    if (this.registerForm.invalid) {
      this.isInvalid = true;
    }
    this.lookup.lookup_value_id = (this.lookup.lookup_value_id?.toString() == undefined) ? 0 : this.lookup.lookup_value_id;
    this.lookup.lookup_type_name = 'Tax module';
    this.lookup.lookup_value_name = this.registerForm.get('lookup_value_name')?.value;
    this.lookup.lookup_value_description = this.registerForm.get('lookup_value_description')?.value;
    this.adminsystemsetupservice.PostLookupdata(this.lookup).subscribe(
      (response) => {
        if (response.Statuscode === 200) {
          this.Success = true;
          this.loading = false;
          this.toastr.success(response.Message);
          this.dialogRef.close()
        }
      }, (error) => {
        this.isInvalid = true;
        this.loading = false;
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