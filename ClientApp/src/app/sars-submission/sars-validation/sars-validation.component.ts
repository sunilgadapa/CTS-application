import { Component, OnInit, TemplateRef } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from "ngx-toastr";
import { ManualUploadService } from "../../_services/manualUpload/manualupload.service";
import { MatTableDataSource } from "@angular/material/table";
import { SelectionModel } from "@angular/cdk/collections";
import { DataSubmissionService } from "src/app/_services/dataSubmission/datasubmission.service";
import { DeletePopupComponent } from "src/app/common/delete-popup/delete-popup.component";
import { MatDialog } from "@angular/material/dialog";
import { SavePopupComponent } from "src/app/common/save-popup/save-popup.component";
@Component({
  selector: 'app-sars-validation',
  templateUrl: './sars-validation.component.html',
  styleUrls: ['./sars-validation.component.css']
})
export class SarsValidationComponent implements  OnInit {
  public loadingTemplate: TemplateRef<any>;
  public loading = false;
  state: string = 'default';
  p: any;
  fileId: number = 0;
  documetTypeId: number = 0;
  totalRecords: number = 1;
  totalPages: number;
  currentPage:number=1;
  pageIndex = 1;
  size = 7;
  dataSource = new MatTableDataSource<any>(undefined);
  dataSourceChild = new MatTableDataSource<any>(undefined);
  selection = new SelectionModel<any[]>(true, []);
  isSelectedDelete: boolean;
  isSelectedSingle: boolean;
  fileNames: any[] = [];
  fileIds: number[] = [];
  rowIds: number[] = [];
  deleteErrorFile: any = [];
  fileTable: any[];
  sarsSubmissionErrorHeader:any[];
  sarsSubmissionErrorData:any[];
  newItem: any[] = [];
  errorFields: any[] = [];
  filteredArray: any[] = [];
  errorDescription: any[] = [];
  isAmmendClicked: boolean;
  selected = -1;
  public labels: any = {
    previousLabel: "< Prev",
    nextLabel: "Next >"
  };
  isColumnIncluded: boolean;
  public myDates: any = {};
  public directionLinks: boolean = true;
  payload: any = {
    Page: 1,
    Size: 7,
    SearchText: "",
    status_type: [],
    fundentity_type: [],
    totalrows: 0,
    fileregion_type: [],
    sars_submission_id: 0
  }
 
  columnsFileTable = [
    { columnDef: 'file_name', header: 'File Name', cell: (element: any) => `${element.file_name}` },
    { columnDef: 'fund_entity_name', header: 'Fund Entity', cell: (element: any) => `${element.fund_entity_name}` },
    { columnDef: 'file_region_name', header: 'TEST/PROD', cell: (element: any) => `${element.file_region_name}` },
    { columnDef: 'status_date', header: 'Status Date', cell: (element: any) => `${element.status_date}` },
    { columnDef: 'status_name', header: 'Status', cell: (element: any) => `${element.status_name}` },
    { columnDef: 'ErrorCount', header: 'Errors', cell: (element: any) => `${element.ErrorCount}` },
  ];
  columnsToDisplayFileTable = this.columnsFileTable.map(c => c.columnDef);
  columns: Array<any>
  displayedColumns: Array<any>
  errorsData: any[];
  constructor(public dialog : MatDialog,
    public toastr: ToastrService, private manualUploadService: ManualUploadService, private dataSubmissionService: DataSubmissionService, private route: ActivatedRoute, public router: Router) {
    this.route.queryParams.subscribe(params => {
      let id = params["fileId"];
      if (id) {
        this.fileId = id
      }
    });
  }
 /*  
......................................................................................................
* This is the ngOnInit function

* ngOnInit is used to initialisation purpose
.......................................................................................................
*/
  ngOnInit(): void {
    this.getFile()
  }
  /*  
......................................................................................................
* This is the paginate function

* paginate is used to pagination
.......................................................................................................
*/
  paginate(event: any) {
    this.selection.clear();
    this.pageIndex = event;
    this.getErrorsData();
    this.dataSourceChild = new MatTableDataSource<any>(
      this.errorsData.slice(event * this.size - this.size, event * this.size)
    );
  }
   /*  
......................................................................................................
* This is the rearrangePaging function

* rearrangePaging is used to rearranging page
.......................................................................................................
*/
  rearrangePaging()
  {
    if(this.currentPage==1)
    {
      this.labels.previousLabel="";
    }
    else
    {
      this.labels.previousLabel="< Prev";
    }
    if(this.currentPage==this.totalPages) 
    {
      this.labels.nextLabel="";
    }
    else
    {
      this.labels.nextLabel="Next >";
    }
  }
   /*  
......................................................................................................
* This is the isAllSelected function

* isAllSelected is used to check all selected or not
.......................................................................................................
*/
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSourceChild.data.length;
    return numSelected === numRows;
  }
 /*  
......................................................................................................
* This is the masterToggle function

* masterToggle is used to toggle
.......................................................................................................
*/
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSourceChild.data.forEach(row => this.selection.select(row));
  }
 /*  
......................................................................................................
* This is the getFile function

* getFile is used to get selected file details
.......................................................................................................
*/
  getFile() {   
    this.payload.sars_submission_id = Number(this.fileId);
    this.dataSubmissionService.getSarsSubmissionErrorData(this.fileId, this.pageIndex, this.size).subscribe(response => {
      let newResponse = response;
      if (newResponse.Statuscode == 200) {
        this.fileTable = newResponse.data.sarsSubmissionData;
        this.sarsSubmissionErrorHeader=newResponse.data.sarsSubmissionErrorHeaderData;
        this.sarsSubmissionErrorData=newResponse.data.sarsSubmissionErrorData;
        this.dataSource = new MatTableDataSource<any>(this.fileTable);
        this.getErrorsData()
      }
    })
  }
 /*  
......................................................................................................
* This is the ammendError function

* ammendError is used to check is ammended clicked
.......................................................................................................
*/
  ammendError() {
    this.isAmmendClicked = true
  }

  /*  
......................................................................................................
* This is the deleteDialog function

* deleteDialog is used to open delete dialog
.......................................................................................................
*/
saveDialog(): void {
  const saveDialogRef = this.dialog.open(SavePopupComponent, {
    data: {
      header: 'Save Changes?',
      message: `Do you want to continue?`,
      description: `${this.fileNames.length} records has been updated`,
      buttonText: {
        ok: 'Yes',
        cancel: 'No'
      }
    },
    width: '40%'
  });
  saveDialogRef.afterClosed().subscribe((conf: boolean) => {
    if (conf) {
      this.saveError();
      this.selection = new SelectionModel<any[]>(false, []);
    }
  });
}
 /*  
......................................................................................................
* This is the saveError function

* saveError is used to save error API call
.......................................................................................................
*/
  saveError() {
    this.loading=true;
    this.manualUploadService.saveErrors(this.documetTypeId, this.newItem, this.fileId).subscribe(response => {
      let newResponse = response;
      if (newResponse.Statuscode == 200) {
        this.loading=false;
        this.toastr.success(newResponse.Message);
        this.getErrorsData();
      }
    }, (error) => {
      this.loading=false;
      this.toastr.error("Internal server error")
      this.getErrorsData();
    })
    this.isAmmendClicked = false;
    this.isSelectedDelete = false;
    this.selection.clear();
  }
 /*  
......................................................................................................
* This is the  getErrorsData function

*  getErrorsData is used to get error data
.......................................................................................................
*/
  getErrorsData() {
    this.loading = true;
     this.errorsData = this.sarsSubmissionErrorData;
      this.totalRecords = this.fileTable[0].ErrorCount;
      // Get list of columns by gathering unique keys of objects found in errorsData.
      const columns1 = this.errorsData
        .reduce((columns:any, row) => { 
          return [...columns, ...Object.keys(row)]
        }, [])
        .reduce((columns: any, column: any) => {
          return columns.includes(column)
            ? columns
            : [...columns, column]
        }, [])
      let columnsToExclude = ['Page', 'Size', 'Sars_Submission_Datail_Id', 'Status_Flag', 'TotalRows']
      this.filteredArray = columns1.filter((value: any) => !columnsToExclude.includes(value));
      // Describe the columns for <mat-table>.
      this.columns = this.filteredArray.map((column: any) => {
        return {
          columnDef: column,
          header: column,
          cell: (element: any) => `${element[column] ? element[column] : ''}`
        }
      })
      this.displayedColumns = this.columns.map(c => c.columnDef);

      // Set the dataSource for <mat-table>.
      this.dataSourceChild = new MatTableDataSource<any>(
        this.errorsData.slice(0, this.size)
      )

      this.totalPages=this.totalRecords/this.size;
      this.totalPages=Math.ceil(this.totalPages);
      this.rearrangePaging();
    this.errorFields = this.sarsSubmissionErrorHeader;
    this.loading = false;
  }
 /*  
......................................................................................................
* This is the errorsToUpdateDelete function

* errorsToUpdateDelete is used to update
.......................................................................................................
*/
  errorsToUpdateDelete() {
    this.isAmmendClicked = false
    this.newItem = [];
    this.newItem = this.selection.selected
    this.fileNames = [];
    this.fileIds = [];
    this.rowIds = [];
    for (let file of this.newItem) {
      this.fileNames.push(file.Row_Id);
      this.rowIds.push(file.Row_Id)

      let temp = {
        Ids: file.Row_Id,
        FileName: file.file_name
      }
      this.deleteErrorFile.push(temp);
    }
    
    if (this.selection.selected.length > 0) {
      this.isSelectedDelete = true;
    }
    else {
      this.isSelectedDelete = false;
    }
    if (this.selection.selected.length === 1) {
      this.isSelectedSingle = true;
    }
    else {
      this.isSelectedSingle = false;
    }
  }
 /*  
......................................................................................................
* This is the navigateToSars function

* navigateToSars is used to navigate to sars page
.......................................................................................................
*/
  navigateToSars() {
    this.router.navigate(['/sarssubmission']);
  }
  /*  
......................................................................................................
* This is the deleteDialog function

* deleteDialog is used to open delete dialog
.......................................................................................................
*/
deleteDialog(): void {
  const dialogRef = this.dialog.open(DeletePopupComponent, {
    data: {
      message: `Are you sure you want to delete the selected file(s)?${this.fileNames.join(' , ')}`,
      buttonText: {
        ok: 'Yes',
        cancel: 'No'
      }
    },
    width: '50%'
  });
  dialogRef.afterClosed().subscribe((confirmed: boolean) => {
    if (confirmed) {
      this.deleteErrorRecords();
      this.selection = new SelectionModel<any[]>(false, []);
    }
  });
}
 /*  
......................................................................................................
* This is the deleteErrorRecords function

* deleteErrorRecords is used to delete
.......................................................................................................
*/
  deleteErrorRecords() {
    this.loading=true;
    this.dataSubmissionService.deletErrorFile(this.deleteErrorFile,this.documetTypeId).subscribe(response => {
      let newResponse = response;
      if (newResponse.Statuscode == 200) {
        this.loading=false;
        this.toastr.success(newResponse.Message)
        this.getErrorsData();
      }
    }, (error) => {
      this.loading=false;
      this.toastr.error("Internal server error")
    })
    this.isAmmendClicked = false;
    this.isSelectedDelete = false;
  }
   /*  
......................................................................................................
* This is the viewErrorReport function

* viewErrorReport is used to navigate error report page
.......................................................................................................
*/
  viewErrorReport() {
    this.router.navigate(['/ViewErrorReport']);
   }

}
