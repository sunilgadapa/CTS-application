import { Component, OnInit, Inject, TemplateRef,Injector } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminSystemsetupService } from '../../../_services/admin/adminsystemsetup.service';
import { LookupData } from "../../../_models/LookupData";
import { UserData } from '../../../_models/userData';
import { Router } from '@angular/router';
import { Subscriber } from "rxjs";
import { ToastrService } from 'ngx-toastr';
import { SelectionModel } from "@angular/cdk/collections";
import { TableData } from "src/app/_models/tableData";
import { LookupMiscData } from '../../../_models/LookupMiscData';
import { ValidationsetupService } from "../../../_services/common/validationsetup.service";
import { ConfirmPopupComponent } from "src/app/common/confirm-popup/confirm-popup.component";
import { PasmanualuploadService } from "src/app/_services/manualUpload/pasmanualupload.service";
@Component({
  selector: 'app-source-system',
  templateUrl: './source-system.component.html',
  styleUrls: ['./source-system.component.css']
})
export class SourceSystemComponent implements OnInit {
  public loadingTemplate: TemplateRef<any>;
  public loading = false;
  state: string = 'default';
  dialogRef: MatDialogRef<AddsourceDialog> | null;
  p: any;
  isUpdatebtn: boolean = false;
  lookup: LookupData;
  isInvalid: boolean;
  labelError: string;
  Success: any;
  successMessage: any;
  userName: any[] = [];
  UserIds: any[] = [];
  newItem: any[] = [];
  totalRowdata = 0;
  totalSelectedRowdata = 0;
  MiscData: LookupMiscData;
  isSelectedSaveChange: boolean;
  subscription = new Subscriber();
  editFlag = 1;
  size = 7;
  pageIndex = 0;
  page_no: number = 1;
  selection = new SelectionModel<any[]>(true, []);
  columns = [
    { columnDef: 'status_flag', header: 'Active', cell: (element: any) => `${element.status_flag}` },
    { columnDef: 'lookup_value_name', header: 'Source System', cell: (element: any) => `${element.lookup_value_name}` },
    { columnDef: 'lookup_value_description', header: 'Description', cell: (element: any) => `${element.lookup_value_description}` },
    { columnDef: 'editsrc', header: 'Amend', cell: (element: any) => `${element.edit}` },
  ];
  columnsToDisplay = this.columns.map(c => c.columnDef);
  tableData: LookupData[];
  constructor(public dialog: MatDialog,
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
    this.adminsystemsetupservice.editdtaxsrc.subscribe(x => {
      this.lookup = x;
      if (this.editFlag == 1) {
        this.editFlag = 0;
        this.openDialog();
      }
    });
  }

  /*  
 .......................................................................................................
 * This is the SelectCurrentPage function
 
 * @param event is page no selected on grid
 
 * SelectCurrentPage is used to get data for selected page
 .......................................................................................................
 */
  SelectCurrentPage(event: any) {
    this.pageIndex = event;
    this.page_no = this.pageIndex
    this.selection = new SelectionModel<any>(true, [])
    this.getlookupdata()
  }

  /*  
  .......................................................................................................
    * This is the getlookupdata function
  
    * getlookupdata is api call function to get look up values as source system
  .......................................................................................................
  */
  getlookupdata() {
    this.loading = true;
    const lookup_type_name = "Source System";
    const page_no = this.page_no;
    this.adminsystemsetupservice.GetLookupdata(lookup_type_name, page_no).subscribe(lookupdata => {
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
    * This is the AddSourcePop function
   
    * AddSourcePop is used to open a pop up for add source system
  .......................................................................................................
  */
  AddSourcePop() {
    this.dialogRef = this.dialog.open(AddsourceDialog, { width: '40.62%' });
    this.dialogRef.afterClosed().subscribe(result => {
      this.getlookupdata()
    });
  }

  /*  
  .......................................................................................................
    * This is the openDialog function
   
    * openDialog is used to open a pop up for edit source system
  .......................................................................................................
  */
  openDialog() {
    if (this.dialog.openDialogs.length == 0) {
      const dialogRef = this.dialog.open(AddsourceDialog, {
        data: {
          isUpdate: "edit",
          message: "Error!!!",
          lookup: this.lookup
        }, width: '40.62%'
      });
      dialogRef.afterClosed().subscribe(result => {
        this.editFlag = 1;
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
  * This is the SavechangeSource function
  
  * SavechangeSource is used to Save the active deactive rows of data grid
  .......................................................................................................
  */
  SavechangeSource() {
    const dialogRef = this.dialog.open(ConfirmPopupComponent, {
      width: '40%'
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.loading = true;
        this.lookup.ids = this.UserIds;
        this.lookup.lookup_type_name = 'Source System';
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
              }, 1500);
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
    })
  }

}

@Component({
  selector: 'demo-jazz-dialog',
  templateUrl: './addsourcesystem.html',
  styleUrls: ['./source-system.component.css']
})
export class AddsourceDialog implements OnInit {
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
  srcName_readonly = false;
  Success: any;
  successMessage: any;
  isUpdatebtn: boolean = false;
  subscription = new Subscriber();
  textChanged: boolean = false;
  fileId: number;
  toastr:ToastrService;
  validation:ValidationsetupService;
  adminsystemsetupservice:AdminSystemsetupService;
  constructor(private formBuilder: FormBuilder,
    private injector : Injector,
    public dialogRef: MatDialogRef<AddsourceDialog>,
    public pasManualUploadService: PasmanualuploadService,
    public router: Router,
    @Inject(MAT_DIALOG_DATA) private data: any,
   ) {

      this.toastr = injector.get<ToastrService>(ToastrService);
      this.validation= injector.get<ValidationsetupService>(ValidationsetupService);
      this.adminsystemsetupservice= injector.get<AdminSystemsetupService>(AdminSystemsetupService);
    this.registerForm = this.formBuilder.group({
      lookup_value_name: new FormControl('',
        [
          Validators.required,
          Validators.pattern(this.validation.validationsArray.sourceSystem.addSourceSystem.sourceSystemName.pattern),
          Validators.minLength(this.validation.validationsArray.sourceSystem.addSourceSystem.sourceSystemName.minLength),
          Validators.maxLength(this.validation.validationsArray.sourceSystem.addSourceSystem.sourceSystemName.maxLength)
        ]
      ),
      lookup_value_description: new FormControl('',
        [
          Validators.pattern(this.validation.validationsArray.sourceSystem.addSourceSystem.sourceSystemDescription.pattern),
          Validators.minLength(this.validation.validationsArray.sourceSystem.addSourceSystem.sourceSystemDescription.minLength),
          Validators.maxLength(this.validation.validationsArray.sourceSystem.addSourceSystem.sourceSystemDescription.maxLength)
        ]
      )
    });
    if (data) {
      if (data.isUpdate == 'edit') {
        this.lookup = data.lookup.row;
        this.registerForm.controls.lookup_value_name.setValue(this.lookup.lookup_value_name);
        this.registerForm.controls.lookup_value_description.setValue(this.lookup.lookup_value_description);
        this.isUpdatebtn = true;
      } else if (data.isUpdate == 'addmissinginfo') {
        this.registerForm.controls.lookup_value_name.setValue(data.lookup.MissingLookupValueName);
        this.srcName_readonly = true
        this.fileId = data.fileId
      }

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
  * This is the addSourceSystem function
  
  * addSourceSystem is used to save the submitting enties
  .......................................................................................................
  */
  addSourceSystem() {
    this.loading = true;
    this.submitted = true;
    this.lookup = this.lookup ? this.lookup : this.registerForm.value;
    if (this.registerForm.invalid) {
      this.isInvalid = true;
    } else {
      this.lookup.lookup_value_id = (this.lookup.lookup_value_id?.toString() == "") ? 0 : this.lookup.lookup_value_id;
      this.lookup.lookup_type_name = 'Source system';
      this.lookup.lookup_value_name = this.registerForm.get('lookup_value_name')?.value;
      this.lookup.lookup_value_description = this.registerForm.get('lookup_value_description')?.value;
      if (this.srcName_readonly) {
        this.SaveSourceSymFromAddMissingInfo();
      }
      else {
        this.SaveSourceSymFromSystemSetup();
      }
    }
  }

  private SaveSourceSymFromAddMissingInfo() {
    this.pasManualUploadService.AddMissingInformation(this.lookup.lookup_value_name,
      this.lookup.lookup_value_description,
      this.lookup.lookup_type_name,
      this.fileId,'').subscribe(
        (response) => {
          if (response.Statuscode === 200) {
            if (response.data == 1) {
              this.toastr.error(response.Message);
            }
            else {
              this.toastr.success(response.Message);
            }
            this.Success = true;
            this.loading = false;
            this.dialogRef.close();
          }
        },
        (error) => {
          this.ErrorWhenAddingSrcSym(error);
        }
      );
  }

  private SaveSourceSymFromSystemSetup() {
    this.adminsystemsetupservice.PostLookupdata(this.lookup).subscribe(
      (response) => {
        if (response.Statuscode === 200) {
          this.Success = true;
          this.loading = false;
          this.toastr.success(response.Message);
          this.dialogRef.close();
        }
      },
      (error) => {
        this.ErrorWhenAddingSrcSym(error);
      }
    );
  }

  private ErrorWhenAddingSrcSym(error: any) {
    this.isInvalid = true;
    this.loading = false;
    setTimeout(() => {
      this.toastr.error(error.error.Message);
    }, 500);
    this.dialogRef.close();
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

