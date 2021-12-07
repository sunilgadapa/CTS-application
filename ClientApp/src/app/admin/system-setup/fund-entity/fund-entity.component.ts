import { Component, OnInit,  Inject, Injector , TemplateRef } from "@angular/core";
import { MatDrawerContainer } from '@angular/material/sidenav';
import { SideNavItems } from "../../../_models/sideNavItems";
import { MatDialog,MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
import { PasmanualuploadService } from "src/app/_services/manualUpload/pasmanualupload.service";
@Component({
  selector: 'app-fund-entity',
  templateUrl: './fund-entity.component.html',
  styleUrls: ['./fund-entity.component.css']
})
export class FundEntityComponent implements  OnInit {
  public loadingTemplate: TemplateRef<any>;
  public loading = false;
  dialogRef: MatDialogRef<AddfundEntity> | null;
  state: string = 'default';
  p: any;
  page_no = 1;
  size = 7;
  isUpdatebtn: boolean = false;
  isSavebtn: boolean = false;
  drawer: MatDrawerContainer;
  mode: string = 'side';
  navItems: SideNavItems[];
  lookup: LookupData;
  isInvalid: boolean;
  isSelectedSaveChange: boolean;
  labelError: string;
  totalSelectedRowdata = 0;
  Success: any;
  successMessage: any;
  userName: any[] = [];
  UserIds: any[] = [];
  newItem: any[] = [];
  totalRowdata = 0;
  subscription = new Subscriber();
  columns = [
    { columnDef: 'status_flag', header: 'Active', cell: (element: any) => `${element.status_flag}` },
    { columnDef: 'lookup_value_name', header: 'Fund Entity', cell: (element: any) => `${element.lookup_value_name}` },
    { columnDef: 'lookup_value_description', header: 'Description', cell: (element: any) => `${element.lookup_value_description}` },
    { columnDef: 'edit', header: 'Amend', cell: (element: any) => `${element.edit}` },
  ];
  columnsToDisplay = this.columns.map(c => c.columnDef);
  tableData: LookupData[];
  constructor( public dialog: MatDialog, public adminsystemsetupservice: AdminSystemsetupService,
    private toastr: ToastrService) { }
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
    this.subscription.add(this.adminsystemsetupservice.editdtax.subscribe(x => {
      this.lookup = x;
      this.openDialog();
    }));
  }

   /*  
  .......................................................................................................
    * This is the getlookupdata function
  
    * getlookupdata is api call function to get look up values as Fund entity
  .......................................................................................................
  */
  getlookupdata() {
    this.loading = true;
    const lookup_type_name = "Retirement Fund Entity"
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
    const dialogRef = this.dialog.open(AddfundEntity, {
      data: {
        isUpdate: "edit",
        isSave: "savechanges",
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
  * This is the AddFundPop function
 
  * AddFundPop is used to open a pop up for add fund entity
.......................................................................................................
*/
  AddFundPop() {
    this.dialogRef = this.dialog.open(AddfundEntity, { width: '40%' });
    this.dialogRef.afterClosed().subscribe(result => {
      this.getlookupdata()
    });
  }

  addsavechange(newItem: any) {
    this.UserIds = []
    this.UserIds.push(newItem.lookup_value_id)
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
* This is the SavechangeFund function

* SavechangeFund is used to Save the active deactive rows of data grid
.......................................................................................................
*/
  SavechangeFund() {
    const dialogRef = this.dialog.open(ConfirmPopupComponent, {
      width: '40%',
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
    this.loading = true;
    this.lookup.ids = this.UserIds;
    this.lookup.lookup_type_name = 'Retirement Fund Entity';
    this.lookup.Page = this.page_no;
    this.lookup.Size = this.size;
    this.lookup.totalselectedrows = this.totalSelectedRowdata;
    this.adminsystemsetupservice.PostSavechanges(this.lookup).subscribe(
      (response) => {
        if (response.Statuscode === 200) {
          this.Success = true;
          this.loading = false;
          this.isSelectedSaveChange=false;
          this.toastr.success(response.Message);
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
      }else
      {
        this.isSelectedSaveChange=false;
        this.ngOnInit()
      }
    })
  }

}

@Component({
  selector: 'fund-entity-dialog',
  templateUrl: './addfund-entity.html',
  styleUrls: ['./fund-entity.component.css']
})
export class AddfundEntity {
  public loadingTemplate: TemplateRef<any>;
  public loading = false;
  hide = true;
  model: any = {};
  IsErrorVisible: boolean = true;
  public showPasswordOnPress: boolean = false;
  FundEntityForm: FormGroup;
  submitted = false;
  userData: UserData;
  lookup: LookupData;
  isUpdatebtn: boolean = false;
  isInvalid: boolean;
  labelError: string;
  funentyName_readonly=false;
  lookup_value_description: any;
  Success: any;
  successMessage: any;
  textChanged: boolean= false;
  fileId:number
  toastr:ToastrService;
  validation:ValidationsetupService;
  adminsystemsetupservice:AdminSystemsetupService;
  constructor(private injector : Injector,private formBuilder: FormBuilder, public dialogRef: MatDialogRef<AddfundEntity>, 
    public router: Router, @Inject(MAT_DIALOG_DATA) private data: any,public pasManualUploadService: PasmanualuploadService) {
      this.toastr = injector.get<ToastrService>(ToastrService);
      this.validation= injector.get<ValidationsetupService>(ValidationsetupService);
      this.adminsystemsetupservice= injector.get<AdminSystemsetupService>(AdminSystemsetupService);
      this.FundEntityForm = this.formBuilder.group({
        lookup_value_name: new FormControl('',
          [
            Validators.required,
            Validators.pattern(this.validation.validationsArray.fundEntity.addFundEntity.fundEntityName.pattern),
            Validators.minLength(this.validation.validationsArray.fundEntity.addFundEntity.fundEntityName.minLength),
            Validators.maxLength(this.validation.validationsArray.fundEntity.addFundEntity.fundEntityName.maxLength)
          ]
        ),
        lookup_value_description: new FormControl('',
          [
            Validators.pattern(this.validation.validationsArray.fundEntity.addFundEntity.fundEntityDescription.pattern),
            Validators.minLength(this.validation.validationsArray.fundEntity.addFundEntity.fundEntityDescription.minLength),
            Validators.maxLength(this.validation.validationsArray.fundEntity.addFundEntity.fundEntityDescription.maxLength)
          ]
        )
      });
   
      if (data) {
      if (data.isUpdate == 'edit') {
        this.isUpdatebtn = true;
        this.lookup = data.lookup.row;
        this.FundEntityForm.controls.lookup_value_name.setValue(this.lookup.lookup_value_name);
        this.FundEntityForm.controls.lookup_value_description.setValue(this.lookup.lookup_value_description);
      }else if(data.isUpdate=='addmissinginfo')
      {
        this.fileId=data.fileId
        this.FundEntityForm.controls.lookup_value_name.setValue(data.lookup.MissingLookupValueName);
        this.funentyName_readonly=true
      }
     
      this.textChanged= false;
    }
  }

 /*  
.......................................................................................................
* This is the ngOnInit function

* ngOnInit is used to build a form and validations 
.......................................................................................................
*/
  ngOnInit() {
   
  
    setTimeout(()=>{                          
      this.FundEntityForm.valueChanges.subscribe(() => {
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
    return this.FundEntityForm.controls;
  }
  
/*  
.......................................................................................................
* This is the onSubmitFund function

* onSubmitFund is used to save the fund enties
.......................................................................................................
*/
  onSubmitFund() {
    this.loading = true;
    this.submitted = true;
    this.lookup = this.lookup ? this.lookup : this.FundEntityForm.value;
    if (this.FundEntityForm.invalid) {
      this.isInvalid = true;
    }
    this.lookup.lookup_type_name = 'Retirement Fund Entity';
    this.lookup.lookup_value_name = this.FundEntityForm.get('lookup_value_name')?.value;
    this.lookup.lookup_value_description = this.FundEntityForm.get('lookup_value_description')?.value;
    if(this.funentyName_readonly){
      this.SaveFundEntityFromAddMissingInfo();
    }
    else{
      this.SaveFundEntityFromSystemSetup();
    }    
  }
  private SaveFundEntityFromAddMissingInfo() {
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

  private SaveFundEntityFromSystemSetup() {
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
