import { Component, OnInit,TemplateRef } from "@angular/core";

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AdminSystemsetupService } from '../../../_services/admin/adminsystemsetup.service';
import { LookupData } from "../../../_models/LookupData";

import { Subscriber } from "rxjs";
import { ToastrService } from 'ngx-toastr';
import { SelectionModel } from "@angular/cdk/collections";
import { TableData } from "src/app/_models/tableData";
import { LookupMiscData } from '../../../_models/LookupMiscData';

import { ConfirmPopupComponent } from "src/app/common/confirm-popup/confirm-popup.component";


import { AddProductCodeComponent } from "./add-product-code/add-product-code.component";
@Component({
  selector: 'app-product-code',
  templateUrl: './product-code.component.html',
  styleUrls: ['./product-code.component.css']
})
export class ProductCodeComponent implements OnInit {
  public loadingTemplate: TemplateRef<any>;
  public loading = false;
  state: string = 'default';
  dialogRef: MatDialogRef<AddProductCodeComponent> | null;
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
    { columnDef: 'lookup_value_name', header: 'Product Code', cell: (element: any) => `${element.lookup_value_name}` },
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
    const lookup_type_name = "Product";
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
    this.dialogRef = this.dialog.open(AddProductCodeComponent, { width: '40.62%' });
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
      const dialogRef = this.dialog.open(AddProductCodeComponent, {
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
        this.lookup.lookup_type_name = 'Product';
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



