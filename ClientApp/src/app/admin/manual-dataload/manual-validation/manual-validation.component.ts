import { Component, OnInit, TemplateRef } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from "ngx-toastr";
import { ManualUploadService } from "../../../_services/manualUpload/manualupload.service";
import { MatTableDataSource } from "@angular/material/table";
import { SelectionModel } from "@angular/cdk/collections";
import { forkJoin, } from "rxjs";
import { PowerBIReport } from "../../../Constant/powerbi.report";
@Component({
  selector: 'app-manual-validation',
  templateUrl: './manual-validation.component.html',
  styleUrls: ['./manual-validation.component.css']
})
export class ManualValidationComponent implements  OnInit {
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
  fileTable: any[];
  newItem: any[] = [];
  errorFields: any[] = [];
  errorDescription: any[] = [];
  filteredArray: any[] = [];
  isAmmendClicked: boolean;
  selected = -1;
  public labels: any = {
    previousLabel: "< Prev",
    nextLabel: "Next >"
  };
  isColumnIncluded: boolean;
  public myDates: any = {};
  public directionLinks: boolean = true;
  columnsFileTable = [
    { columnDef: 'file_name', header: 'File Name', cell: (element: any) => `${element.file_name}` },
    { columnDef: 'taxperiod', header: 'Tax Period', cell: (element: any) => `${element.taxperiod}` },
    { columnDef: 'file_landed_date', header: 'Landed Date', cell: (element: any) => `${element.file_landed_date}` },
    { columnDef: 'ErrorCount', header: 'Error', cell: (element: any) => `${element.ErrorCount}` },
  ];
  columnsToDisplayFileTable = this.columnsFileTable.map(c => c.columnDef);
  columns: Array<any>
  displayedColumns: Array<any>
  errorsData: any[];
  parentName="Hello";
  constructor(
    public toastr: ToastrService, private manualUploadService: ManualUploadService, private route: ActivatedRoute, public router: Router) {
    this.route.queryParams.subscribe(params => {
      let id = params["fileId"];
      if (id) {
        this.fileId = id
      }
    });
  }

  ngOnInit(): void {
    this.getFile()
  }
 
  paginate(event: any) {
    this.selection.clear();
    this.pageIndex = event;
    this.currentPage=event;
    this.getErrorsData();
    this.dataSourceChild = new MatTableDataSource<any>(
      this.errorsData.slice(event * this.size - this.size, event * this.size)
    );
    this.rearrangePaging();
  }
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
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSourceChild.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSourceChild.data.forEach(row => this.selection.select(row));
  }

  getFile() {   
    this.manualUploadService.getFileById(this.fileId).subscribe(response => {
      let newResponse = response;
      if (newResponse.Statuscode == 200) {
        this.fileTable = newResponse.data
        this.documetTypeId = newResponse.data[0].document_type_id
        this.getErrorsData()
        this.dataSource = new MatTableDataSource<any>(
          this.fileTable);
      }
    })
  }

  ammendError() {
    this.isAmmendClicked = true
  }

  saveError() {
    this.loading=true;
    this.manualUploadService.saveErrors(this.documetTypeId, this.newItem, this.fileId).subscribe(response => {
      let newResponse = response;
      if (newResponse.Statuscode == 200) {
        this.loading=false;
        this.toastr.success(newResponse.Message);
        this.getFile();
        this.getErrorsData();
      }
    }, (error) => {
      this.loading=false;
      setTimeout(() => {
        this.toastr.error("Internal server error")
      }, 500);       
      this.getFile();
      this.getErrorsData();
    })
    this.isAmmendClicked = false;
    this.isSelectedDelete = false;
    this.selection.clear();
  }

  getErrorsData() {    
    this.loading = true;
    const errorsData2 = this.manualUploadService.getFileErrorsById(this.fileId, this.documetTypeId, this.pageIndex, this.size);
    const fileHeaders = this.manualUploadService.getFileErrorHeadersById(this.fileId, this.documetTypeId, this.pageIndex, this.size);    
    
    forkJoin([errorsData2, fileHeaders]).subscribe(result => {
      if (result[0].Statuscode == 200) {
        this.errorsData = result[0].data
        this.totalRecords = this.fileTable[0].ErrorCount
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
        let columnsToExclude = ['page', 'size', 'file_id', 'status_flag', 'status_code', 'batch_id', 'job_id', 'created_date', 'created_by', 'last_updated_by', 'last_updated_date', 'totalrows']
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
      }
      if (result[1].Statuscode == 200) {
        this.errorFields = result[1].data.lstDataLoadErrorHeader
        this.errorDescription=result[1].data.lstDataLoadErrorDecription        
      }      
      this.loading = false;
    },(error)=>{
      this.loading = false;
    })
  }

  errorsToUpdateDelete() {
    this.isAmmendClicked = false
    this.newItem = [];
    this.newItem = this.selection.selected
    this.fileNames = [];
    this.fileIds = [];
    this.rowIds = [];
    for (let file of this.newItem) {
      this.fileNames.push(file.file_name);
      this.fileIds.push(file.file_id);
      this.rowIds.push(file.row_id)
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

  navigateToManualDataLoad() {
    this.router.navigate(['/manualData']);
  }

  deleteErrorRecords() {
    this.loading=true;
    this.manualUploadService.deleteErrors(this.documetTypeId, this.rowIds).subscribe(response => {
      let newResponse = response;
      if (newResponse.Statuscode == 200) {
        this.loading=false;
        this.toastr.success(newResponse.Message)
        this.getFile();
        this.getErrorsData();
      }
    }, (error) => {
      this.loading=false;
      setTimeout(() => {
        this.toastr.error("Internal server error")
      }, 500);          
    })
    this.isAmmendClicked = false;
    this.isSelectedDelete = false;
    this.selection.clear();
  }
  DataLoadErrorReport() {
    let filter="FileDetails/File_id in ('"+this.fileId+"')";
    this.router.navigate(['/viewErrorReport'], {state: {reportId:PowerBIReport.Data_Load_Error_Report,filter:filter}});

  }
  FileOverviewReport() {
    let filter="FileHistory/File_id in ('"+this.fileId+"')";
    this.router.navigate(['/viewErrorReport'], {state: {reportId:PowerBIReport.File_Overview_Report,filter:filter}});
  }
  ControlTotalsReport()
  {
    let filter="FileDetails/File_id in ('"+this.fileId+"')";
    this.router.navigate(['/viewErrorReport'], {state: {reportId:PowerBIReport.Control_Totals_Report,filter:filter}});
  }
  DataLoadOverviewReport()
  {
    this.router.navigate(['/viewErrorReport'], {state: {reportId:PowerBIReport.Data_Load_Overview_Report}});
  }
}
