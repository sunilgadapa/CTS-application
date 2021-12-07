import { Component, OnInit, TemplateRef } from "@angular/core";
import { MatDrawerContainer } from '@angular/material/sidenav';
import { SideNavItems } from "../../../_models/sideNavItems";
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AdminSystemsetupService } from '../../../_services/admin/adminsystemsetup.service';
import { LookupData } from "../../../_models/LookupData";
import { Subscriber } from "rxjs";
import { ToastrService } from 'ngx-toastr';
import { SelectionModel } from "@angular/cdk/collections";
import { TableData } from "src/app/_models/tableData";
import { ConfirmPopupComponent } from "src/app/common/confirm-popup/confirm-popup.component";
import { AddtaxsourcecodeComponent } from "./addtaxsourcecode/addtaxsourcecode.component";

@Component({
  selector: 'app-taxsource-code',
  templateUrl: './taxsource-code.component.html',
  styleUrls: ['./taxsource-code.component.css']
})
export class TaxsourceCodeComponent implements OnInit {
saveTaxSrcCode={
 ids:[1,2] ,
lookup_type_name : 'Tax Source Code',
Page:0,
Size :0,
totalselectedrows :0
}
  addTaxModuleForm: FormGroup;
  public loadingTemplate: TemplateRef<any>;
  public loading = false;
  dialogRef: MatDialogRef<any> | null;
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
    { columnDef: 'lookup_value_name', header: 'Tax Source Code', cell: (element: any) => `${element.lookup_value_name}` },
    { columnDef: 'lookup_value_description', header: 'Description', cell: (element: any) => `${element.lookup_value_description}` },
    { columnDef: 'edittaxsrc', header: 'Amend', cell: (element: any) => `${element.edit}` },
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
   
    this.subscription.add(this.adminsystemsetupservice.editTaxSrcCode.subscribe(x => {
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
    const lookup_type_name = "Tax Source Code"
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
    this.dialogRef = this.dialog.open(AddtaxsourcecodeComponent, { width: '35%', });
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
      this.dialog.open(AddtaxsourcecodeComponent, {
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
        this.saveTaxSrcCode.ids = this.UserIds;
        this.saveTaxSrcCode.lookup_type_name = 'Tax Source Code';
        this.saveTaxSrcCode.Page = this.page_no;
        this.saveTaxSrcCode.Size = this.size;
        this.saveTaxSrcCode.totalselectedrows = this.totalSelectedRowdata;
        this.adminsystemsetupservice.PostSavechanges(this.saveTaxSrcCode).subscribe(
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
