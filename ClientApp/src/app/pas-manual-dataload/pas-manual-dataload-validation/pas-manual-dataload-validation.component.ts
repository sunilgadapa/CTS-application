import { Component, OnInit, TemplateRef } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from "ngx-toastr";
import { MatTableDataSource } from "@angular/material/table";
import { SelectionModel } from "@angular/cdk/collections";
import { forkJoin, } from "rxjs";
import { PowerBIReport } from "../../Constant/powerbi.report";
import { PasmanualuploadService } from "src/app/_services/manualUpload/pasmanualupload.service";
import { ManualUploadService } from "src/app/_services/manualUpload/manualupload.service";
import { AddsourceDialog } from "src/app/admin/system-setup/source-system/source-system.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { AddfundEntity } from "src/app/admin/system-setup/fund-entity/fund-entity.component";
import { AddTaxperiodComponent } from "src/app/admin/system-setup/tax-period/add-taxperiod/add-taxperiod.component";
import { AddProductCodeComponent } from "src/app/admin/system-setup/product-code/add-product-code/add-product-code.component";
import { AddtaxsourcecodeComponent } from "src/app/admin/system-setup/taxsource-code/addtaxsourcecode/addtaxsourcecode.component";

@Component({
  selector: 'app-pas-manual-dataload-validation',
  templateUrl: './pas-manual-dataload-validation.component.html',
  styleUrls: ['./pas-manual-dataload-validation.component.css']
})
export class PasManualDataloadValidationComponent implements OnInit {
  public loadingTemplate: TemplateRef<any>;
  public loading = false;
  dialogRef: MatDialogRef<any> | null;
  state: string = 'default';
  p: any;
  fileId: number = 0;
  documetTypeId: number = 0;
  totalRecords: number = 0;
  totalPages: number;
  currentPage: number = 1;
  pageIndex = 1;
  pageIndexMissingInfo = 1;
  size = 7;
  totalRecordsMissingInfo: number = 0;
  totalPagesMissingInfo: number;
  dataSource = new MatTableDataSource<any>(undefined);
  dataSourceChild = new MatTableDataSource<any>(undefined);
  dataSourceMissingInformation = new MatTableDataSource<any>(undefined);
  selection = new SelectionModel<any[]>(true, []);
  isSelectedDelete: boolean;
  isSelectedSingle: boolean;
  isMissingDataExists: boolean = false;
  fileNames: any[] = [];
  fileIds: number[] = [];
  rowIds: number[] = [];
  fileTable: any[];
  newItem: any[] = [];
  errorFields: any[] = [];
  missingInformationData: any[] = [];
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
    { columnDef: 'ErrorCount', header: 'Error', cell: (element: any) => `${this.isMissingDataExists ? this.totalRecordsMissingInfo : element.ErrorCount}` },
  ];
  columnsToDisplayFileTable = this.columnsFileTable.map(c => c.columnDef);
  columnsMissingInformationTable = [
    { columnDef: 'Action', header: 'Action', cell: (element: any) => `${element.Action}` },
    { columnDef: 'RowNumber', header: 'Row Number', cell: (element: any) => `${element.RowNumber}` },
    { columnDef: 'MissingLookupValueName', header: 'Missing Information', cell: (element: any) => `${element.MissingLookupValueName + ' (' + element.MissingLookupTypeName + ')'}` },
  ];
  columnsToDisplayMissingInformationTable = this.columnsMissingInformationTable.map(c => c.columnDef);
  columns: Array<any>
  displayedColumns: Array<any>
  errorsData: any[] = [];
  constructor(public dialog: MatDialog,
    public toastr: ToastrService, private manualUploadService: ManualUploadService, private pasManualUploadService: PasmanualuploadService, private route: ActivatedRoute, public router: Router) {
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
    this.currentPage = event;
    this.getErrorsData();
    this.dataSourceChild = new MatTableDataSource<any>(
      this.errorsData.slice(event * this.size - this.size, event * this.size)
    );
    this.rearrangePaging();
  }

  paginateMissingInfo(event: any) {
    this.pageIndexMissingInfo = event;
    this.GetMissingInformationByFileId();
    this.dataSourceMissingInformation = new MatTableDataSource<any>(
      this.missingInformationData.slice(event * this.size - this.size, event * this.size)
    );
    this.rearrangePagingMissingInfo();
  }
  rearrangePaging() {
    if (this.currentPage == 1) {
      this.labels.previousLabel = "";
    }
    else {
      this.labels.previousLabel = "< Prev";
    }
    if (this.currentPage == this.totalPages) {
      this.labels.nextLabel = "";
    }
    else {
      this.labels.nextLabel = "Next >";
    }
  }
  rearrangePagingMissingInfo() {
    if (this.pageIndexMissingInfo == 1) {
      this.labels.previousLabel = "";
    }
    else {
      this.labels.previousLabel = "< Prev";
    }
    if (this.pageIndexMissingInfo == this.totalPagesMissingInfo) {
      this.labels.nextLabel = "";
    }
    else {
      this.labels.nextLabel = "Next >";
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
    this.loading = true;
    this.pasManualUploadService.getFileById(this.fileId).subscribe(response => {
      let newResponse = response;
      if (newResponse.Statuscode == 200) {
        this.fileTable = newResponse.data
        this.documetTypeId = newResponse.data[0].document_type_id
        this.dataSource = new MatTableDataSource<any>(
          this.fileTable);
        if (this.isMissingDataExists) {
          this.GetMissingInformationByFileId();
        }
        else {
          this.CheckIfFileHasMissingInformation()
        }
      }
    })
  }
  CheckIfFileHasMissingInformation() {
    this.pasManualUploadService.CheckIfFileHasMissingInformation(this.documetTypeId, this.fileId).subscribe(response => {
      let newResponse = response;
      if (newResponse.Statuscode == 200) {
        this.GetMissingInformationByFileId();
        this.isMissingDataExists = true;
      }
    }, (error) => {
      this.isMissingDataExists = false;

      if (this.fileTable[0].file_status_code == 1006) {
        this.getErrorsData()

      } else {
        this.loading = false;
      }
    })
  }
  GetMissingInformationByFileId() {
    this.loading = true;
    this.pasManualUploadService.GetMissingInformationByFileId(this.documetTypeId, this.fileId).subscribe(response => {
      let newResponse = response;
      if (newResponse.Statuscode == 200) {
        this.missingInformationData = newResponse.data
        this.dataSourceMissingInformation = new MatTableDataSource<any>(
          this.missingInformationData);
        this.totalRecordsMissingInfo = newResponse.data[0].TotalNumerOfRows
        this.totalPagesMissingInfo = this.totalRecordsMissingInfo / this.size;
        this.totalPagesMissingInfo = Math.ceil(this.totalPagesMissingInfo);
        this.rearrangePagingMissingInfo();
        this.loading = false;
      }
    }, (error) => {
      this.getFile();
      this.missingInformationData = []
      this.dataSourceMissingInformation = new MatTableDataSource<any>(
        this.missingInformationData);
      this.loading = false;
      this.isMissingDataExists = false
    })
  }
  ammendError() {
    this.isAmmendClicked = true
  }

  saveError() {

    this.loading = true;
    this.pasManualUploadService.saveErrors(this.documetTypeId, this.newItem, this.fileId).subscribe(response => {
      let newResponse = response;
      if (newResponse.Statuscode == 200) {
        this.loading = false;
        setTimeout(() => {
          this.toastr.success(newResponse.Message);
        }, 500);
        this.getFile();
        this.getErrorsData();
      }
    }, (error) => {
      this.loading = false;
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
    const errorsData2 = this.pasManualUploadService.getFileErrorsById(this.fileId, this.documetTypeId, this.pageIndex, this.size);
    const fileHeaders = this.pasManualUploadService.getFileErrorHeadersById(this.fileId, this.documetTypeId, this.pageIndex, this.size);

    forkJoin([errorsData2, fileHeaders]).subscribe(result => {

      if (result[0].Statuscode == 200) {
        this.errorsData = result[0].data
        this.totalRecords = this.fileTable[0].ErrorCount
        // Get list of columns by gathering unique keys of objects found in errorsData.
        const columns1 = this.errorsData
          .reduce((columns: any, row) => {
            return [...columns, ...Object.keys(row)]
          }, [])
          .reduce((columns: any, column: any) => {
            return columns.includes(column)
              ? columns
              : [...columns, column]
          }, [])
        let columnsToExclude = ['page', 'size', 'file_id', 'status_flag', 'status_code', 'batch_id', 'job_id', 'created_date', 'created_by', 'last_updated_by', 'last_updated_date', 'totalrows', 'File_rowid']
        this.filteredArray = columns1.filter((value: any) => !columnsToExclude.includes(value));
        // Describe the columns for <mat-table>.

        this.columns = this.filteredArray.map((column: any) => {
          return {
            columnDef: column,
            header: column,
            // header: column=='SourceSystemID'?'Source System ID':column=='ClientID'?'Client ID':column=='PolicyID'?'Policy ID':column.replace(/([A-Z])/g, ' $1').trim(),
            cell: (element: any) => `${element[column] ? element[column] : ''}`
          }
        })
        this.displayedColumns = this.columns.map(c => c.columnDef);

        // Set the dataSource for <mat-table>.
        this.dataSourceChild = new MatTableDataSource<any>(
          this.errorsData.slice(0, this.size)
        )
        this.totalPages = this.totalRecords / this.size;
        this.totalPages = Math.ceil(this.totalPages);
        this.rearrangePaging();
      }
      if (result[1].Statuscode == 200) {
        this.errorFields = result[1].data.lstDataLoadErrorHeader
        this.errorDescription = result[1].data.lstDataLoadErrorDecription
      }
      this.loading = false;
    }, (error) => {
      this.loading = false;
    })
    this.loading = false;
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
    this.router.navigate(['/pasmanualdataload']);
  }

  deleteErrorRecords() {
    this.loading = true;
    this.manualUploadService.deleteErrors(this.documetTypeId, this.rowIds).subscribe(response => {
      let newResponse = response;
      if (newResponse.Statuscode == 200) {
        this.loading = false;
        this.toastr.success(newResponse.Message)
        this.getFile();
        this.getErrorsData();
      }
    }, (error) => {
      this.loading = false;
      setTimeout(() => {
        this.toastr.error("Internal server error")
      }, 500);
    })
    this.isAmmendClicked = false;
    this.isSelectedDelete = false;
    this.selection.clear();
  }
  DataLoadErrorReport() {
    let filter = "FileDetails/File_id in ('" + this.fileId + "')";
    this.router.navigate(['/viewErrorReport'], { state: { reportId: PowerBIReport.Data_Load_Error_Report, filter: filter } });

  }
  FileOverviewReport() {
    let filter = "FileHistory/File_id in ('" + this.fileId + "')";
    this.router.navigate(['/viewErrorReport'], { state: { reportId: PowerBIReport.File_Overview_Report, filter: filter } });
  }
  ControlTotalsReport() {
    let filter = "FileDetails/File_id in ('" + this.fileId + "')";
    this.router.navigate(['/viewErrorReport'], { state: { reportId: PowerBIReport.Control_Totals_Report, filter: filter } });
  }
  DataLoadOverviewReport() {
    this.router.navigate(['/viewErrorReport'], { state: { reportId: PowerBIReport.Data_Load_Overview_Report } });
  }

  addInfo(row: any) {
    if (row.MissingLookupTypeName == "SourceSystemID") {
      this.loading = true;
      this.pasManualUploadService.CheckIfLookupExists(row.MissingLookupValueName,
        "Source system", this.fileId).subscribe(
          (response) => {
            this.missingInfoAlreadyExists(response);
          },
          (error) => {
            this.loading = false;
            this.dialogRef = this.dialog.open(AddsourceDialog, {
              data: {
                isUpdate: "addmissinginfo",
                fileId: this.fileId,
                lookup: row
              },
              width: '40.62%'
            });
            this.dialogRef.afterClosed().subscribe((confirmed: boolean) => {
              this.GetMissingInformationByFileId();
            });
          }
        );

    } else if (row.MissingLookupTypeName == "FundEntityCode") {
      this.loading = true;
      this.pasManualUploadService.CheckIfLookupExists(row.MissingLookupValueName,
        "Retirement Fund Entity", this.fileId).subscribe(
          (response1) => {
            this.missingInfoAlreadyExists(response1);
          },
          (error) => {
            this.loading = false;
            this.dialogRef = this.dialog.open(AddfundEntity, {
              data: {
                isUpdate: "addmissinginfo",
                fileId: this.fileId,
                lookup: row
              },
              width: '40.62%'
            });
            this.dialogRef.afterClosed().subscribe((confirmed: boolean) => {
              this.GetMissingInformationByFileId();
            });
          }
        );
    }
    else if (row.MissingLookupTypeName == "ProductCode") {
      this.loading = true;
      this.pasManualUploadService.CheckIfLookupExists(row.MissingLookupValueName,
        "Product", this.fileId).subscribe(
          (response1) => {
            this.missingInfoAlreadyExists(response1);
          },
          (error) => {
            this.loading = false;
            this.dialogRef = this.dialog.open(AddProductCodeComponent, {
              data: {
                isUpdate: "addmissinginfo",
                fileId: this.fileId,
                lookup: row
              },
              width: '40.62%'
            });
            this.dialogRef.afterClosed().subscribe((confirmed: boolean) => {
              this.GetMissingInformationByFileId();
            });
          }
        );
    }
    else if (row.MissingLookupTypeName == "TaxYear") {
      this.dialogRef = this.dialog.open(AddTaxperiodComponent, {
        data: {
          isUpdate: "addmissinginfo",
          fileId: this.fileId,
          lookup: row
        },
        width: '45%'
      });
      this.dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        this.GetMissingInformationByFileId();
      });
    } else if (row.MissingLookupTypeName == "TaxSourceCode") {
      this.dialogRef = this.dialog.open(AddtaxsourcecodeComponent, {
        data: {
          isUpdate: "addmissinginfo",
          fileId: this.fileId,
          lookup: row
        },
        width: '45%'
      });
      this.dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        this.GetMissingInformationByFileId();
      });
    }

  }

  private missingInfoAlreadyExists(response1: any) {
    if (response1.Statuscode === 200) {
      this.toastr.error(response1.Message);
      this.GetMissingInformationByFileId();
      this.loading = false;
    }
  }
}
