import {
  Component,
  ViewChild,
  AfterViewInit, TemplateRef, Output, EventEmitter
} from "@angular/core";
import { trigger, state, style, animate, transition } from '@angular/animations';
import { NavigationExtras, Router } from '@angular/router';
import { DeletePopupComponent } from '../../../common/delete-popup/delete-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { UploadFilePopupComponent } from "../upload-file-popup/upload-file-popup.component";
import { ProcessFilePopupComponent } from "../process-file-popup/process-file-popup.component";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from "ngx-toastr";
import { ManualUploadService } from "../../../_services/manualUpload/manualupload.service";
import { SelectionModel } from "@angular/cdk/collections";
import { FileTypeData } from '../../../_models/fileTypeData';
import { StatusTypeData } from "src/app/_models/StatusTypeData";
import { TaxModulePeriods } from '../../../_models/TaxModulePeriod';
import { FileModel } from '../../../_models/FileModel';
import { ManualData } from '../../../_models/manualUpload';
import { MatTableDataSource } from "@angular/material/table";
import { MatOption } from "@angular/material/core";
import { forkJoin, Observable, ReplaySubject } from "rxjs";
import { ProgressStatus } from "src/app/_models/progress-status";
import { DownloadPopupComponent } from "src/app/common/download-progress/download-progress.component";

@Component({
  selector: 'app-manual-data',
  templateUrl: './manual-data.component.html',
  styleUrls: ['./manual-data.component.css'],
  animations: [
    trigger('rotatedState', [
      state('default', style({ transform: 'rotate(720deg)' })),
      transition('default => rotated', animate('800ms')),
      transition('rotated => default', animate('800ms')),
    ]),
  ],
})
export class ManualDataComponent implements AfterViewInit {
  @Output() public downloadStatus: EventEmitter<ProgressStatus>;
  maualdatasearchform: FormGroup;
  isSelectedItem=true;
  constructor(public dialog: MatDialog, public router: Router,
    private formBuilder: FormBuilder,
    private fileTypeService: ManualUploadService,
    private toastr: ToastrService) {
    this.downloadStatus = new EventEmitter<ProgressStatus>();
    this.maualdatasearchform = this.formBuilder.group({
      file_type: ['', Validators.required],
      status: ['', Validators.required],
      tax_period: ['', Validators.required]
    });
  }
  public loadingTemplate: TemplateRef<any>;
  public loading = false;
  @ViewChild('allSelected') private allSelected: MatOption;
  @ViewChild('allSelected2') private allSelected2: MatOption;
  @ViewChild('allSelected3') private allSelected3: MatOption;
  state: string = 'default';
  p: any;
  totalRecords: number = 7;
  statusddl: boolean = false;
  statusddl1: boolean = false;
  statusddl2: boolean = false;
  file_type: any[] = [];
  statusddl3: boolean = false;
  File_Types: any[] = [];
  fileTypeData: FileTypeData;
  isProcessFile: boolean = false;
  fileNames: any[] = [];
  fileIds: number[] = [];
  deleteFile: any[] = []
  filesToValidate: number[] = [];
  filesToProcess: number[] = [];

  FileId: any[] = [];
  FileName: any[] = [];
  FileStatus: any[] = [];
  rejectedFile: any[] = [];
  loadedNoError: any[] = [];
  Status_Types: any[] = [];
  statusType: StatusTypeData;
  fileTypeIds: any = []
  statusTypesIds: any = []
  taxPeriodIds: any = []
  Tax_Period: any[] = [];
  TaxPeriodType: TaxModulePeriods;

  manualData: ManualData;
  size = 7;
  totalPages: number;
  ID: any;
  newItem: any[] = [];

  fileID: any;
  fileName: any;
  loadTypeId: "";

  newManualUpload = {
    FileID: 0,
    Page: 1,
    Size: 1,
    SearchText: "",
    file_type: [],
    status_type: [],
    Load_Type_val: [],
    period_val: [],
  }
  public labels: any = {
    previousLabel: "",
    nextLabel: ""
  };
  pageIndex = 1;
  currentPage: number = 1;
  fileModel: FileModel;
  public directionLinks: boolean = true;
  selection = new SelectionModel<any[]>(true, []);
  isSelectedDelete: boolean;
  isSelectedSingleToValidate: boolean;
  isSelectedSingleToDownload: boolean;
  isSelectedSingleToProcess: boolean;
  isSelectedSingleRejected: boolean = false;
  isSelectedSingleNoError: boolean = false;
  isPaginate: boolean
  dataloadfilter = false;
  manualfiletypeDrop: any;

  private replaySubject = new ReplaySubject<Response>(1);
  cache$: Observable<Response> = this.replaySubject.asObservable();

  dataSource = new MatTableDataSource<any>(undefined);
  columns = [
    { columnDef: 'status_flag', header: 'select', cell: (element: any) => `${element.status_flag}` },
    { columnDef: 'file_name', header: 'File Name', cell: (element: any) => `${element.file_name}` },
    { columnDef: 'file_type', header: 'File Type', cell: (element: any) => `${element.file_type_val}` },
    { columnDef: 'strTaxYears', header: 'Tax Period', cell: (element: any) => `${element.strTaxYears}` },
    { columnDef: 'file_landed_date', header: 'Landed Date', cell: (element: any) => `${element.file_landed_date}` },
    { columnDef: 'status', header: 'Status', cell: (element: any) => `${element.status}` },

  ];

  columnsToDisplay = this.columns.map(c => c.columnDef);


  tableData: any[] = [];

  arrColorAmber = [1001, 1017, 1013, 1008, 1007, 1011, 1006, 1004, 1002]
  arrColorGreen = [1014, 1015, 1016, 1012,]
  arrColorRed = [1010, 1005, 1003]
  All: any;


  //#region Toggle drop down list
  rotate() {
    this.state = this.state === 'default' ? 'rotated' : 'default';
    this.getManualUplaodData();
  }

  toggleArrow() {
    this.statusddl = this.statusddl === true ? false : true;
  }
  toggleArrow1() {
    this.statusddl1 = this.statusddl1 === true ? false : true;
  }
  toggleArrow2() {
    this.statusddl2 = this.statusddl2 === true ? false : true;
  }
  toggleArrow3() {
    this.statusddl3 = this.statusddl3 === true ? false : true;
  }
  //#endregion
  //#region Drop down list select
  toggleAllFileType() {
    if (this.allSelected.selected) {
      this.maualdatasearchform.controls.file_type
        .patchValue([...this.File_Types.map((item: any) => item), 0]);
    } else {
      this.maualdatasearchform.controls.file_type.patchValue([]);
    }
  }
  tossleFileType() {
    if (this.allSelected.selected) {
      this.allSelected.deselect();
      return false;
    }
    if (this.maualdatasearchform.controls.file_type.value.length == this.File_Types.length)
      this.allSelected.select();
    return true;
  }
  toggleAllStatus() {
    if (this.allSelected2.selected) {
      this.maualdatasearchform.controls.status
        .patchValue([...this.Status_Types.map((item: any) => item), 0]);
    } else {
      this.maualdatasearchform.controls.status.patchValue([]);
    }
  }
  toggleStatus() {
    if (this.allSelected2.selected) {
      this.allSelected2.deselect();
      return false;
    }
    if (this.maualdatasearchform.controls.status.value.length == this.Status_Types.length)
      this.allSelected2.select();
    return true;
  }
  toggleAllTaxPeriod() {
    if (this.allSelected3.selected) {
      this.maualdatasearchform.controls.tax_period
        .patchValue([...this.Tax_Period.map((item: any) => item), 0]);
    } else {
      this.maualdatasearchform.controls.tax_period.patchValue([]);
    }
  }
  toggleTaxPeriod() {
    if (this.allSelected3.selected) {
      this.allSelected3.deselect();
      return false;
    }
    if (this.maualdatasearchform.controls.tax_period.value.length == this.Tax_Period.length)
      this.allSelected3.select();
    return true;
  }

  //#endregion
  //#region Mat Table events and methods
  paginate(event: any) {
    this.isPaginate = true
    this.filesToDelete()
    this.pageIndex = event;
    this.currentPage = event;
    this.getManualUplaodData()
    this.dataSource = new MatTableDataSource<any>(
      this.tableData.slice(event * this.size - this.size, event * this.size)
    );
    this.rearrangePaging();
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
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }
  //#endregion
  //#region Get drop down data

  getAllDropDownData() {
    this.loading = true;
    const fileType = this.fileTypeService.getLookupdata('FileType');
    const status = this.fileTypeService.getLookupdata('Status');
    const taxPeriod = this.fileTypeService.getLookupdata('TaxPeriod');

    forkJoin([fileType, status, taxPeriod]).subscribe(result => {
      this.File_Types = result[0];
      let filedropdownvalue = JSON.parse(localStorage.getItem('manualFilestatusDDL') || 'null')
      if (filedropdownvalue != null) {
        let defaultValues = this.File_Types.filter((id: any) => filedropdownvalue.file_type.includes(id.ID));
        this.maualdatasearchform.controls['file_type'].setValue(defaultValues);
        if (defaultValues.length == this.File_Types.length) {
          this.maualdatasearchform.controls['file_type'].setValue(0);
          this.toggleAllFileType()
        }
      }
      else {
        this.maualdatasearchform.controls['file_type'].setValue(0);
        this.toggleAllFileType()
      }

      this.Status_Types = result[1];
      let fileStatusdropdown = JSON.parse(localStorage.getItem('manualFilestatusDDL') || 'null')
      if (fileStatusdropdown != null) {

        let defaultValues = this.Status_Types.filter((id: any) => fileStatusdropdown.status_type.includes(id.ID));

        this.maualdatasearchform.controls['status'].setValue(defaultValues);
        if (defaultValues.length == this.Status_Types.length) {
          this.maualdatasearchform.controls['status'].setValue(0);
          this.toggleAllStatus()
        }
      }
      else {
        this.maualdatasearchform.controls['status'].setValue(0);
        this.toggleAllStatus()
      }

      this.Tax_Period = result[2];
      let TaxperiodDDL = JSON.parse(localStorage.getItem('manualFilestatusDDL') || 'null')
      if (TaxperiodDDL != null) {

        let defaultValues = this.Tax_Period.filter((id: any) => TaxperiodDDL.period_val.includes(id.ID));
        this.maualdatasearchform.controls['tax_period'].setValue(defaultValues);
        if (TaxperiodDDL.period_val[0] == 0) {
          this.maualdatasearchform.controls['tax_period'].setValue(0);
          this.toggleAllTaxPeriod();
        }
      }
      else {
        this.maualdatasearchform.controls['tax_period'].setValue(0);
        this.toggleAllTaxPeriod();
      }

      this.getManualUplaodData();
      this.loading = false;
    }, (error) => {
      this.loading = false;
    })
  }
  ngAfterViewInit() {
    let fileStatusdropdown = JSON.parse(localStorage.getItem('manualFilestatusDDL') || 'null')

    if (fileStatusdropdown != null) {
      this.pageIndex = fileStatusdropdown.Page;
      this.getAllDropDownData();
    } else {
      this.pageIndex = 1;
      this.getAllDropDownData();
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(UploadFilePopupComponent, {
      data: {
        from: 'manualUpload'
      }, width: '36%',
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.getManualUplaodData();
      }
    });
  }
  buttonVisibilityByStatus(file: any, temp: any) {
    if (file.status == 'Loaded – With Errors' || file.status == 'Partial Upload') {
      this.filesToValidate.push(file.file_id)
    }
    if (file.status == 'Ready to process') {
      this.filesToProcess.push(file.file_id)
    }
    if (file.status == 'Rejected') {
      this.rejectedFile.push(temp)
    }
    if (file.status == 'Loaded – No Errors') {
      this.loadedNoError.push(temp)
    }
  }
  buttonVisibilityBySelection() {
    if (this.selection.selected.length == 1 && this.rejectedFile.length > 0) {
      this.isSelectedSingleRejected = true;
    } else {
      this.isSelectedSingleRejected = false;
    }
    if (this.selection.selected.length == 1 && this.loadedNoError.length > 0) {
      this.isSelectedSingleNoError = true;
    } else {
      this.isSelectedSingleNoError = false;
    }
    
    if(this.selection.selected.length>0)
    {
      this.isSelectedItem=false;
    }else
    {
      this.isSelectedItem=true;
    }
  }
  filesToDelete() {
    this.newItem = [];
    this.newItem = this.selection.selected
    this.fileNames = [];
    this.rejectedFile = [];
    this.fileIds = [];
    this.loadedNoError = [];
    this.filesToValidate = [];
    this.filesToProcess = [];
    this.deleteFile = [];
    for (let file of this.newItem) {
      this.fileNames.push(file.file_name);
      this.fileIds.push(file.file_id);
      let temp = {
        Ids: file.file_id,
        FileName: file.file_name
      }
      this.deleteFile.push(temp);
      this.buttonVisibilityByStatus(file, temp);
      this.buttonVisibilityBySelection();
    }
    if (this.selection.selected.length == 0) {
      this.isSelectedSingleRejected = false;
      this.isSelectedSingleNoError = false;
      this.isSelectedItem=true;
    }
    if (this.selection.selected.length > 0) {
       this.deleteVlidation()
    }
    else {
      this.isSelectedDelete = false;
    }
    if (this.selection.selected.length === 1 && this.filesToValidate.length > 0) {
      this.isSelectedSingleToValidate = true;
    }
    else {
      this.isSelectedSingleToValidate = false;
    }
    if (this.selection.selected.length === 1) {
      this.isSelectedSingleToDownload = true;
    }
    else {
      this.isSelectedSingleToDownload = false;
    }
    if (this.selection.selected.length === 1 && this.filesToProcess.length > 0) {
      this.isSelectedSingleToProcess = true;
    }
    else {
      this.isSelectedSingleToProcess = false;
    }
  }

  deleteVlidation(){
   
    if(this.newItem.length>0)
    {
      let deleteFileStatus=true;
      for(let file of this.newItem)
      {
        if(file.file_status_code ==1007 ||file.file_status_code == 1008)
        {
             deleteFileStatus=false;
             break;
        }
       
      }
      if(deleteFileStatus)
      {
        this.isSelectedDelete = true;
      }else
      {
        this.isSelectedDelete = false;
      }
    }
    else
    {
      this.isSelectedDelete = true;
    }
   
  }

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
        this.deleteFiles();
        this.selection = new SelectionModel<any[]>(false, []);


      }
    });
  }

  deleteFiles() {
    this.loading = true;
    this.fileTypeService.deleteFile(this.deleteFile).subscribe(response => {
      let newResponse = response
      if (newResponse.Statuscode == 200) {
        this.getManualUplaodData();
        this.loading = false;
        this.toastr.success(newResponse.Message);
      }
      else {
        setTimeout(() => {
          this.toastr.error(newResponse.Message);
        }, 500);           
      }
    },
      (error) => {
        this.loading = false;
        setTimeout(() => {
          this.toastr.error('Something went wrong')
        }, 500);         
      })

  }

  openDialogprocess() {
    this.loading = true;
    this.fileTypeService.ProcessFile(this.fileIds[0], this.fileNames[0]).subscribe((response: any) => {
      let newResponse = response
      if (newResponse.Statuscode == 200) {
        this.loading = false;
        const dialogRef = this.dialog.open(ProcessFilePopupComponent, {
          data: {
            text: "Process"
          }, width: '40%'
        });
        dialogRef.afterClosed().subscribe((confirmed: boolean) => {
          if (confirmed) {
            this.getManualUplaodData();
            this.selection.clear();
            this.filesToDelete()
          }
        });
      }
    },
      (error) => {
        this.loading = false;
        setTimeout(() => {
          this.toastr.error(error.error.Message)
        }, 500);          
      })
  }
  // downloadFile() {
  //   this.loading=true;
  //   this.fileTypeService.downloadFile(this.fileIds[0], this.fileNames[0]).subscribe((reponse: any) => {
  //     this.loading=false;
  //   },
  //     (error) => {
  //     console.log("🚀 ~ file: manual-data.component.ts ~ line 542 ~ ManualDataComponent ~ downloadFile ~ error", error)
  //       this.loading=false;
  //       this.toastr.error(error.error.Message)
  //     })
  // }
  // downloadFile() {
  //   this.downloadStatus.emit({ status: ProgressStatusEnum.START });
  //   this.fileTypeService.downloadFile(this.fileIds[0], this.fileNames[0]).subscribe(
  //     (data: any) => {
  //       switch (data.type) {
  //         case HttpEventType.DownloadProgress:
  //           this.downloadStatus.emit({ status: ProgressStatusEnum.IN_PROGRESS, percentage: Math.round((data.loaded / data.total) * 100) });
  //           break;
  //         case HttpEventType.Response:
  //           this.downloadStatus.emit({ status: ProgressStatusEnum.COMPLETE });
  //           const downloadedFile = new Blob([data.body], { type: data.body.type });
  //           const a = document.createElement('a');
  //           a.setAttribute('style', 'display:none;');
  //           document.body.appendChild(a);
  //           a.download = this.fileNames[0];
  //           a.href = URL.createObjectURL(downloadedFile);
  //           a.target = '_blank';
  //           a.click();
  //           document.body.removeChild(a);
  //           break;
  //       }                        
  //     },
  //     error => {
  //       this.downloadStatus.emit({ status: ProgressStatusEnum.ERROR });
  //       this.toastr.error("Something went wrong!");
  //     }
  //   );
  // }

  downloadFile() {
    this.dialog.open(DownloadPopupComponent, {
      data: {
        fileId: this.fileIds[0],
        filename: this.fileNames[0]
      }, width: '250px',
    });
  }

  refresh() {
    this.getManualUplaodData();
  }

  getValidatedManualData() {
    this.dataloadfilter = false;
    this.loading = true;
    this.fileTypeIds = []
    this.statusTypesIds = []
    this.taxPeriodIds = []
    let fileTypeLength = this.maualdatasearchform.controls.file_type.value.filter((filterFileType: any) => filterFileType != 0).length
    for (var i = 0; i < fileTypeLength; i++) {
      var id = this.maualdatasearchform.controls.file_type.value[i].ID;
      this.fileTypeIds.push(id)
    }
    let statusLength = this.maualdatasearchform.controls.status.value.filter((filterStatus: any) => filterStatus != 0).length
    for (var j = 0; j < statusLength; j++) {
      var id2 = this.maualdatasearchform.controls.status.value[j].ID;
      this.statusTypesIds.push(id2)
    }

    if (this.maualdatasearchform.controls.tax_period.value.length - 1 == this.Tax_Period.length) {
      this.taxPeriodIds = [];
      this.taxPeriodIds.push(0);
    }
    else {
      this.taxPeriodIds = [];
      let taxPeriodLength = this.maualdatasearchform.controls.tax_period.value.filter((filterTaxPeriod: any) => filterTaxPeriod != 0).length
      for (var k = 0; k < taxPeriodLength; k++) {
        var id3 = this.maualdatasearchform.controls.tax_period.value[k].ID;
        this.taxPeriodIds.push(id3)
      }
    }
  }
  getManualUplaodData(): void {
    if ((this.maualdatasearchform.controls.file_type.status == 'INVALID')
      || (this.maualdatasearchform.controls.status.status == 'INVALID')
      || (this.maualdatasearchform.controls.tax_period.status == 'INVALID')) {
      this.dataloadfilter = true;
    }
    else {
      this.getValidatedManualData();
      this.newManualUpload.file_type = this.fileTypeIds
      this.newManualUpload.status_type = this.statusTypesIds
      this.newManualUpload.period_val = this.taxPeriodIds
      this.newManualUpload.Page = this.pageIndex
      this.newManualUpload.Size = this.size
      this.newManualUpload.SearchText = "";
      localStorage.setItem('manualFilestatusDDL', JSON.stringify(this.newManualUpload));
      this.fileTypeService.GetManualLoadData(this.newManualUpload).subscribe(manualUploadresponse => {
        let response = manualUploadresponse
        if (response.Statuscode == 200) {
          this.tableData = response.data;
          this.totalRecords = response.data[0].totalrows;
          this.loading = false;
          this.selection.clear();
          this.filesToDelete();

          this.dataSource = new MatTableDataSource<any>(
            this.tableData.slice(0, this.size)
          );
          this.totalPages = this.totalRecords / this.size;
          this.totalPages = Math.ceil(this.totalPages);
          this.rearrangePaging();
        }
        else {
          setTimeout(() => {
            this.toastr.error(response.Message)
          }, 500);           
        }
      },
        (error) => {
          this.loading = false;
          this.tableData = [];
          if (this.pageIndex > 1 && this.tableData.length == 0) {
            this.pageIndex = this.pageIndex - 1;
            this.getManualUplaodData();
          }
          else {
            this.dataloadfilter = true;
          }
        });
    }
  }

  navigateToErrorValidation() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        "fileId": this.fileIds[0]
      }
    };
    this.router.navigate(['/manualValidation'], navigationExtras);
  }
}
