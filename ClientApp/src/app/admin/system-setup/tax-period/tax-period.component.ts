import { Component, OnInit,TemplateRef } from "@angular/core";
import { MatDrawerContainer } from '@angular/material/sidenav';
import { SideNavItems } from "../../../_models/sideNavItems";
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AdminSystemsetupService } from '../../../_services/admin/adminsystemsetup.service';
import { Subscriber } from "rxjs";
import { ToastrService } from 'ngx-toastr';
import { SelectionModel } from "@angular/cdk/collections";
import { TableData } from "src/app/_models/tableData";
import { ConfirmPopupComponent } from "src/app/common/confirm-popup/confirm-popup.component";
import { AddTaxperiodComponent } from "./add-taxperiod/add-taxperiod.component";
@Component({
  selector: 'app-tax-period',
  templateUrl: './tax-period.component.html',
  styleUrls: ['./tax-period.component.css']
})
export class TaxPeriodComponent implements OnInit {

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
  taxSaveData={
    TaxPeriodIds:[1,2],
    PageNumber:1,
    Size:7
  }
  mode: string = 'side';
  navItems: SideNavItems[];
  lookup: any;
  isInvalid: boolean;
  labelError: string;
  isSelectedSaveChange: boolean;
  Success: any;
  successMessage: any;
  userName: any[] = [];
  UserIds: any[] = [];
  newItem: any[] = [];
  taxPeriodIds:any[]=[];
  totalSelectedRowdata = 0;
  totalRowdata = 0;
  subscription = new Subscriber();


  columns = [
    { columnDef: 'status_flag', header: 'Active', cell: (element: any) => `${element.status_flag}` },
    { columnDef: 'tax_module_period', header: 'Tax module', cell: (element: any) => `${element.TaxTypeName}` },
    { columnDef: 'tax_year', header: 'Tax Year', cell: (element: any) => `${element.TaxYear}` },
    { columnDef: 'tax_period_description ', header: 'Tax Period Description', cell: (element: any) => `${element.TaxPeriodDescription}` },
    { columnDef: 'submission_period_start_date', header: 'Submission Period Start Date', cell: (element: any) => `${element.SubmissionStartDate}` },
    { columnDef: 'submission_period_end_date', header: 'Submission Period End Date', cell: (element: any) => `${element.SubmissionEndDate}` },
    { columnDef: 'landing_period_start_date', header: 'Landing Period Start Date', cell: (element: any) => `${element.LandingStartDate}` },
    { columnDef: 'landing_period_end_date', header: 'Landing Period End Date', cell: (element: any) => `${element.LandingEndDate}` },
    { columnDef: 'tax_edits', header: 'Amend', cell: (element: any) => `${element.edit}` },
  ];
  columnsToDisplay = this.columns.map(c => c.columnDef);
  newTaxModuleIds: any[] = [];
  tableData:any[]=[]
  
  constructor(public dialog: MatDialog, private formBuilder: FormBuilder,
    public adminsystemsetupservice: AdminSystemsetupService, private toastr: ToastrService,
  ) { }
  
  ngOnInit(): void {
   
    this.getlookupdata()
 
    this.subscription.add(this.adminsystemsetupservice.editdtaxperiod.subscribe(x => {
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
    const page_no = this.page_no;
       //Make HTTP call to get API call
       this.adminsystemsetupservice.GetTaxPeriodData(this.size, page_no).subscribe(lookupdata => {
    
        this.tableData = lookupdata.data;
        for(let data of this.tableData)
        {
          data.status_flag=data.StatusFlag;
        }
        this.totalRowdata = this.tableData[0].TotalRows;
      this.loading = false;
       })
  
  }

/*  
.......................................................................................................
  * This is the AddTaxmodulePop function
 
  * AddTaxmodulePop is used to open a pop up for add tax module
.......................................................................................................
*/
AddTaxPeriodPop() {
    this.dialogRef = this.dialog.open(AddTaxperiodComponent, { width: '45%', });
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
      this.dialogRef= this.dialog.open(AddTaxperiodComponent, {
        data: {
          isUpdate: "edit",
          lookup: this.lookup,
        }, width: '45%',
      });
      this.dialogRef.afterClosed().subscribe(result => {
        this.getlookupdata()
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
    this.taxPeriodIds = [];
    for (let data of this.newItem) {
    
      this.taxPeriodIds.push(data.TaxPeriodId);
    }
    if (this.taxPeriodIds.length > 0 || this.totalSelectedRowdata > 0) {
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
      this.taxSaveData.PageNumber=this.page_no;
      this.taxSaveData.Size=this.size;
      this.taxSaveData.TaxPeriodIds=[];
      this.taxSaveData.TaxPeriodIds=this.taxPeriodIds
        this.adminsystemsetupservice.SaveTaxPeriodData(this.taxSaveData).subscribe(
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
