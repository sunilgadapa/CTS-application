import { Component, ViewChild, AfterViewInit, TemplateRef, Output, EventEmitter } from "@angular/core";
import { trigger, state, style, animate, transition } from '@angular/animations';
import { NavigationExtras, Router } from '@angular/router';

import { DeletePopupComponent } from '../../common/delete-popup/delete-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { ProcessFilePopupComponent } from "../../admin/manual-dataload/process-file-popup/process-file-popup.component";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ToastrService } from "ngx-toastr";
import { ManualUploadService } from "../../_services/manualUpload/manualupload.service";
import { SelectionModel } from "@angular/cdk/collections";
import { FileTypeData } from '../../_models/fileTypeData';
import { StatusTypeData } from "src/app/_models/StatusTypeData";
import { TaxModulePeriods } from '../../_models/TaxModulePeriod';
import { FileModel } from '../../_models/FileModel';
import { ManualData } from '../../_models/manualUpload';

import { MatTableDataSource } from "@angular/material/table";
import { MatOption } from "@angular/material/core";
import { forkJoin, Observable, ReplaySubject } from "rxjs";
import { ProgressStatus, ProgressStatusEnum } from "src/app/_models/progress-status";
import { HttpEventType } from "@angular/common/http";
import { DataSubmissionService } from "src/app/_services/dataSubmission/datasubmission.service";
import { FundEntity } from "src/app/_models/sars-submission/fundEntity";
import { PromoteFilePopupComponent } from "../promote-file-popup/promote-file-popup.component";
import { ConfirmFilePopupComponent } from "../confirm-file-popup/confirm-file-popup.component";
import { UploadEFilePopupComponent } from "../upload-e-filling-popup/upload-e-filing-popup.component";

@Component({
  selector: 'app-data-submission-dataload',
  templateUrl: './sars-data-submission.component.html',
  styleUrls: ['./sars-data-submission.component.css'],
  animations: [
    trigger('rotatedState', [
      state('default', style({ transform: 'rotate(720deg)' })),
      transition('default => rotated', animate('800ms')),
      transition('rotated => default', animate('800ms')),
    ]),
  ],
})
export class SarsDataSubmissionComponent implements AfterViewInit {
  @Output() public downloadStatus: EventEmitter<ProgressStatus>;
  sarsDataSearchForm: FormGroup;
  filesToPromote: number[] = [];
  filesReadyForLogicalCreation: any = [];
  filesToRepromote: number[] = [];
  filesReadyToSubmit: any = [];
  filesSubmittedToSars: any = [];
  filesAcknowlowdged: any = [];
  filesAcceptedWarnings: any = [];
  filesRejected: any = [];
  deleteFile: any = [];
  filesToPartialUpload : any =[];
  filesWarningsBySars : any = [];
  constructor(public dialog: MatDialog, public router: Router,
    private formBuilder: FormBuilder,
    private fileTypeService: ManualUploadService,
    private toastr: ToastrService,
    private dataSubmissionService: DataSubmissionService) {
    this.downloadStatus = new EventEmitter<ProgressStatus>();
    this.sarsDataSearchForm = this.formBuilder.group({
      file_type: ['', Validators.required],
      status: ['', Validators.required],
      fund_entity: ['', Validators.required]
    });
  }
  public loadingTemplate: TemplateRef<any>;
  public loading = false;
  @ViewChild('allSelected') private allSelected: MatOption;
  @ViewChild('allSelected2') private allSelected2: MatOption;
  @ViewChild('allSelected3') private allSelected3: MatOption;
  @ViewChild('allSelected4') private allSelected4: MatOption;
  state: string = 'default';
  p: any;
  totalRecords: number = 7;
  statusddl: boolean = false;
  statusddl1: boolean = false;
  statusddl2: boolean = false;
  file_type: any[] = [];
  statusddl3: boolean = false;
  fileRegion: any[] = [];
  fileTypeData: FileTypeData;
  isProcessFile: boolean = false;
  fileNames: any[] = [];
  fileIds: number[] = [];
  filesToValidate: number[] = [];
  filesToProcess: number[] = [];
  FileId: any[] = [];
  FileName: any[] = [];
  FileStatus: any[] = [];

  Status_Types: any[] = [];
  statusType: StatusTypeData;

  Tax_Period: any[] = [];
  TaxPeriodType: TaxModulePeriods;

  Fund_Entity: any[] = [];
  fund_Entity: FundEntity;

  manualData: ManualData;
  size = 7;
  ID: any;
  newItem: any[] = [];
  selectedFile : any =[];
  fileID: any;
  fileName: any;

  newDataSubmission = {
    FileID: 0,
    Page: 1,
    Size: 7,
    SearchText: "",
    status_type: [],
    fundentity_type: [],
    fileregion_type: [],
    tax_type_id : 0,
    tax_period_id : 0
  }

  public labels: any = {
    previousLabel: "< Prev",
    nextLabel: "Next >"
  };
  pageIndex = 1;
  fileModel: FileModel;
  public directionLinks: boolean = true;
  selection = new SelectionModel<any[]>(true, []);
  isSelectedDelete: boolean;
  isSelectedSingleToDownload: boolean;
  isSelectedSingleToProcess: boolean;
  isSelectedSingleToSignOff: boolean;
  isSelectedSingleToPromote: boolean;
  isSelectedSingleToRepromote: boolean;
  isViewSubmissionReturnReport: boolean;
  isSarsSubmission: boolean;
  isViewUnpromoted: boolean;
  isViewError: boolean;
  isFileOverview: boolean;
  isSnapshot: boolean;
  isSubmitFile: boolean;
  isEFilling: boolean;
  isPaginate: boolean
  currentPage: number = 1;
  manualfiletypeDrop: any;
  totalPages: number;
  private replaySubject = new ReplaySubject<Response>(1);
  cache$: Observable<Response> = this.replaySubject.asObservable();
  dataSource = new MatTableDataSource<any>(undefined);
  columns = [
    { columnDef: 'status_flag', header: 'select', cell: (element: any) => `${element.status_flag}` },
    { columnDef: 'tax_period', header: 'Tax Period', cell: (element: any) => `${element.tax_period_name}` },
    { columnDef: 'fund_entity', header: 'Fund Entity', cell: (element: any) => `${element.fund_entity_name}` },
    { columnDef: 'tax_number', header: 'Tax Number', cell: (element: any) => `${element.tax_number}` },
    { columnDef: 'file_name', header: 'File Name', cell: (element: any) => `${element.file_name}` },
    { columnDef: 'source_system', header: 'TEST/PROD', cell: (element: any) => `${element.file_region_name}` },
    { columnDef: 'status_date', header: 'Status Date', cell: (element: any) => `${element.status_date}` },
    { columnDef: 'updated_by', header: 'Updated By', cell: (element: any) => `${element.last_updated_date}` },
    { columnDef: 'status', header: 'Status', cell: (element: any) => `${element.status_name}` },
  ];
  columnsToDisplay = this.columns.map(c => c.columnDef);
  tableData: any[] = [];

  arrColorAmber = [1111, 1205, 1303, 1210]
  arrColorGreen = [1109, 1114, 1104, 1301, 1302]
  arrColorRed = [1113, 1311]


  //#region Toggle drop down list
  rotate() {
    this.state = this.state === 'default' ? 'rotated' : 'default';
    this.getSarsUploadData();
  }
/*  
......................................................................................................
* This is the  toggleArrow function

*  toggleArrow is used to toggle dropdown arrow
.......................................................................................................
*/
  toggleArrow() {
    this.statusddl = this.statusddl === true ? false : true;
  }
/*  
......................................................................................................
* This is the  toggleArrow1 function

*  toggleArrow1 is used to toggle dropdown arrow
.......................................................................................................
*/
  toggleArrow1() {
    this.statusddl1 = this.statusddl1 === true ? false : true;
  }
/*  
......................................................................................................
* This is the  toggleArrow2 function

* toggleArrow2 is used to toggle dropdown arrow
.......................................................................................................
*/
  toggleArrow2() {
    this.statusddl2 = this.statusddl2 === true ? false : true;
  }
/*  
......................................................................................................
* This is the  toggleArrow3 function

* toggleArrow3 is used to toggle dropdown arrow
.......................................................................................................
*/
  toggleArrow3() {
    this.statusddl3 = this.statusddl3 === true ? false : true;
  }

  //#endregion
  //#region Drop down list select
    /*  
......................................................................................................
* This is the toggleAllFileType function

* toggleAllFileType is used to toggle all file type
.......................................................................................................
*/
  toggleAllFileType() {
    if (this.allSelected.selected) {
      this.sarsDataSearchForm.controls.file_type
        .patchValue([...this.fileRegion.map((item: any) => item), 0]);
    } else {
      this.sarsDataSearchForm.controls.file_type.patchValue([]);
    }
  }
/*  
......................................................................................................
* This is the tossleFileType function

* tossleFileType is used to tossle all file type
.......................................................................................................
*/
  tossleFileType() {
    if (this.allSelected.selected) {
      this.allSelected.deselect();
      return false;
    }
    if (this.sarsDataSearchForm.controls.file_type.value.length == this.fileRegion.length)
      this.allSelected.select();
    return true;
  }
/*  
......................................................................................................
* This is the toggleAllStatus function

* toggleAllStatus is used to toggle all status
.......................................................................................................
*/
  toggleAllStatus() {
    if (this.allSelected2.selected) {
      this.sarsDataSearchForm.controls.status
        .patchValue([...this.Status_Types.map((item: any) => item), 0]);
    } else {
      this.sarsDataSearchForm.controls.status.patchValue([]);
    }
  }
/*  
......................................................................................................
* This is the toggleStatus function

* toggleStatus is used to toggle status
.......................................................................................................
*/
  toggleStatus() {
    if (this.allSelected2.selected) {
      this.allSelected2.deselect();
      return false;
    }
    if (this.sarsDataSearchForm.controls.status.value.length == this.Status_Types.length)
      this.allSelected2.select();
    return true;
  }

  toggleAllFundType() {
    if (this.allSelected4.selected) {
      this.sarsDataSearchForm.controls.fund_entity
        .patchValue([...this.Fund_Entity.map((item: any) => item), 0]);
    } else {
      this.sarsDataSearchForm.controls.fund_entity.patchValue([]);
    }
  }
 /*  
......................................................................................................
* This is the toggleFundType function

* toggleFundType is used to toggle fund type
.......................................................................................................
*/
  toggleFundType() {
    if (this.allSelected4.selected) {
      this.allSelected4.deselect();
      return false;
    }
    if (this.sarsDataSearchForm.controls.fund_entity.value.length == this.Fund_Entity.length)
      this.allSelected4.select();
    return true;
  }

  //#endregion
  //#region Mat Table events and methods
   /*  
......................................................................................................
* This is the paginate function

* paginate is used to pagination
.......................................................................................................
*/
  paginate(event: any) {
    this.isPaginate = true
    this.filesToDelete()
    this.pageIndex = event;
    this.currentPage = event;
    this.getSarsUploadData()
    this.dataSource = new MatTableDataSource<any>(
      this.tableData.slice(event * this.size - this.size, event * this.size)
    );
    this.rearrangePaging();
  }
 /*  
......................................................................................................
* This is the rearrangePaging function

* rearrangePaging is used to rearranginag page
.......................................................................................................
*/
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
 /*  
......................................................................................................
* This is the isAllSelected function

*  isAllSelected is used to check all selected or not
.......................................................................................................
*/
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
/*  
......................................................................................................
* This is the masterToggle function

* masterToggle is used to master toggle
.......................................................................................................
*/
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }
  //#endregion
  //#region Get drop down data
/*  
......................................................................................................
* This is the getAllDropDownData function

* getAllDropDownData is used to get all sect dropdown data by API call
.......................................................................................................
*/
  getAllDropDownData() {
    this.loading = true;
    const fileRegion = this.dataSubmissionService.getLookupdata('File Region');
    const status = this.dataSubmissionService.getLookupdata('SARSStatus');

    const Fund_Entity = this.dataSubmissionService.getLookupdata('Fund Entity');

    forkJoin([fileRegion, status, Fund_Entity]).subscribe(result => {
      this.fileRegion = result[0];

      let filedropdownvalue = JSON.parse(localStorage.getItem('cacheSarsData') || 'null')
      if (filedropdownvalue != null) {
        let defaultValues = this.fileRegion.filter((id: any) => filedropdownvalue.fileregion_type.includes(id.ID));
        this.sarsDataSearchForm.controls['file_type'].setValue(defaultValues);
        if (defaultValues.length == this.fileRegion.length) {
          this.sarsDataSearchForm.controls['file_type'].setValue(0);
          this.toggleAllFileType()
        }
      }

      this.Status_Types = result[1];
      let fileStatusdropdown = JSON.parse(localStorage.getItem('cacheSarsData') || 'null')
      if (fileStatusdropdown != null) {

        let defaultValues = this.Status_Types.filter((id: any) => fileStatusdropdown.status_type.includes(id.ID));

        this.sarsDataSearchForm.controls['status'].setValue(defaultValues);
        if (defaultValues.length == this.Status_Types.length) {
          this.sarsDataSearchForm.controls['status'].setValue(0);
          this.toggleAllStatus()
        }
      }
      this.Fund_Entity = result[2];
      let fundEntityDDL = JSON.parse(localStorage.getItem('cacheSarsData') || 'null')

      if (fundEntityDDL != null) {

        let defaultValues = this.Fund_Entity.filter((id: any) => fundEntityDDL.fundentity_type.includes(id.ID));
        this.sarsDataSearchForm.controls['fund_entity'].setValue(defaultValues);
        if (defaultValues.length == this.Fund_Entity.length) {
          this.sarsDataSearchForm.controls['fund_entity'].setValue(0);
          this.toggleAllFundType()
        }
      }
      this.getSarsUploadData();
    }, (error) => {
      this.loading = false;
    })
  }
/*  
......................................................................................................
* This is the   ngAfterViewInit() {

* ngAfterViewInit is used to get all dropdown data
.......................................................................................................
*/
  ngAfterViewInit() {
    let fileStatusdropdown = JSON.parse(localStorage.getItem('cacheSarsData') || 'null')
    if (fileStatusdropdown != null) {
      this.pageIndex = fileStatusdropdown.Page;
      this.getAllDropDownData();
    } else {
      this.pageIndex = 1;
      this.getAllDropDownData();
    }
  }
  /*  
......................................................................................................
* This is the  openDialog  function

* openDialog is used to open upload dialog
.......................................................................................................
*/
  openEFillingDialog(): void {
    const dialogRef = this.dialog.open(UploadEFilePopupComponent, {
      data: {
        from: 'sarsSubmission'
      }, width: '36%'
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.getSarsUploadData();
      }
    });
  }
    /*  
......................................................................................................
* This is the  openPromoteDialog  function

* openPromoteDialog is used to open promote dialog
.......................................................................................................
*/
  openPromoteDialog(type: any): void {
    this.loading = false;
    const dialogRef = this.dialog.open(PromoteFilePopupComponent, {
      data: {
        from: 'sarsSubmission',
        type: type
      }, width: '50%'
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.filePromoteRepromote();
        this.selection = new SelectionModel<any[]>(false, []);
      }
    });
  }

   /*  
......................................................................................................
* This is the  openFileSubmissionDialog  function

* openFileSubmissionDialog is used to open sars submission dialog
.......................................................................................................
*/
openFileSubmissionDialog(): void {
  this.loading = false;
  const submitDialogRef = this.dialog.open(ConfirmFilePopupComponent, {
    data: {
      from: 'sarsSubmission',
      header: 'Submission',
      description : 'Physical File Process Started',
    }, width: '50%'
  });
  submitDialogRef.afterClosed().subscribe((confirm: boolean) => {
    if (confirm) {
      this.submitSarsFile();
      this.selection = new SelectionModel<any[]>(false, []);
    }
  });
}

   /*  
......................................................................................................
* This is the filePromoteRepromote function

*  filePromoteRepromote is used to file promote repromote
.......................................................................................................
*/
  filePromoteRepromote(){
    this.loading = true;
    let payload ={
      tax_type_id:this.selectedFile.tax_type_id,
      tax_period_id:this.selectedFile.tax_period_id,
      fund_entity_id:this.selectedFile.fund_entity_id,
      status_code:this.selectedFile.status_code
    }
    this.dataSubmissionService.filePromote(payload).subscribe(response => {
      let newResponse = response
      if (newResponse.Statuscode == 200) {
        this.loading = false;
        this.getSarsUploadData();
        this.filesToDelete();
        this.toastr.success(newResponse.Message);
      }
      else {
        this.toastr.error(newResponse.Message);
      }
    },
      (error) => {
        this.loading = false;
        this.toastr.error('Something went wrong')
      })
  }
 /*  
......................................................................................................
* This is the filesToDelete function

* filesToDelete is used to delete file
.......................................................................................................
*/
  filesToDelete() {
    this.newItem = [];
    this.selectedFile = [];
    this.newItem = this.selection.selected;
    this.fileNames = [];
    this.fileIds = [];
    this.filesToValidate = [];
    this.filesToProcess = [];
    this.filesToPromote = [];
    this.filesReadyToSubmit = [];
    this.filesAcknowlowdged = [];
    this.filesReadyForLogicalCreation = [];
    this.filesToRepromote = [];
    this.filesSubmittedToSars = [];
    this.filesAcceptedWarnings = [];
    this.filesRejected = [];
    this.deleteFile = [];
    this.filesToPartialUpload = [];
    this.filesWarningsBySars = [];
    this.isSelectedSingleToProcess = false;
    this.isSelectedSingleToPromote = false;
    this.isSelectedSingleToRepromote = false;
    this.isViewSubmissionReturnReport = false;
    this.isSelectedSingleToDownload = false;
    this.isSelectedDelete = false;
    this.isSarsSubmission = false;
    this.isViewUnpromoted = false;
    this.isViewError = false;
    this.isFileOverview = false;
    this.isSnapshot = false;
    this.isSubmitFile = false;
    this.isEFilling = false;
    for (let file of this.newItem) {
      this.selectedFile = file;
      this.fileNames.push(file.file_name);
      this.fileIds.push(file.sars_submission_id);
      let temp = {
        Ids: file.sars_submission_id,
        FileName: file.file_name
      }
      this.deleteFile.push(temp);
      this.checkFileStatus(file);
    }
  
    this.disableButtonBySelection();
  }
 /*  
......................................................................................................
* This is the disableButtonBySelection function

* disableButtonBySelection is used to enable disable button
.......................................................................................................
*/
disableButtonBySelection() {
    this.enableDisable2();

    if (this.selection.selected.length === 1 && this.filesReadyToSubmit.length > 0) {
      this.isViewSubmissionReturnReport = true;
      this.isSarsSubmission = true;
      this.isFileOverview = true;
      this.isViewUnpromoted = true;
      this.isSubmitFile = true;
      this.isSelectedDelete = false;
    }

   if (this.selection.selected.length === 1 && this.filesSubmittedToSars.length > 0 || this.selection.selected.length === 1 && this.filesAcknowlowdged.length > 0) {
      this.isViewSubmissionReturnReport = true;
      this.isSarsSubmission = true;
      this.isFileOverview = true;
      this.isViewUnpromoted = true;
      this.isSelectedDelete = false;
    }

    if (this.selection.selected.length === 1 && this.filesAcceptedWarnings.length > 0) {
      this.isViewSubmissionReturnReport = true;
      this.isSarsSubmission = true;
      this.isFileOverview = true;
      this.isViewUnpromoted = true;
      this.isSelectedDelete = true;
      this.isEFilling = true;
    }

    if (this.selection.selected.length === 1 && this.filesRejected.length > 0) {
      this.isSelectedDelete = false;
      this.isSelectedSingleToDownload = true;
    }

    if (this.selection.selected.length === 1 && this.filesToPartialUpload.length > 0) {
      this.isViewSubmissionReturnReport = true;
      this.isSarsSubmission = true;
      this.isFileOverview = true;
      this.isViewError = true;
      this.isSelectedDelete = true;
    }
  }
/*  
......................................................................................................
* This is the enableDisable2 function

* enableDisable2 is used to enable disable button
.......................................................................................................
*/
  private enableDisable2() {
    if (this.selection.selected.length === 1 && this.filesToProcess.length > 0) {
      this.isSelectedSingleToProcess = true;
    }

    if (this.selection.selected.length === 1 && this.filesToPromote.length > 0) {
      this.isSelectedSingleToPromote = true;
      this.isSelectedDelete = false;
    }

    if (this.selection.selected.length === 1 && this.filesToRepromote.length > 0) {
      this.isSelectedSingleToRepromote = true;
      this.isViewUnpromoted = true;
      this.isViewError = true;
      this.isSelectedDelete = false;
    }

    if (this.selection.selected.length === 1 && this.filesReadyForLogicalCreation.length > 0) {
      this.isSnapshot = true;
      this.isViewUnpromoted = true;
      this.isViewError = true;
      this.isSelectedDelete = false;
    }
  }
/*  
......................................................................................................
* This is the checkFileStatus function

* checkFileStatus is used to check status
.......................................................................................................
*/
checkFileStatus(file: any) {
    if (file.status_code == 1109) {
      this.filesToPromote.push(file.sars_submission_id);
    }
    if (file.status_code == 1113) {
      this.filesToRepromote.push(file.sars_submission_id);
    }
    if (file.status_code == 1114) {
      this.filesReadyForLogicalCreation.push(file.sars_submission_id);
    }
    if (file.status_code == 1104) {
      this.filesReadyToSubmit.push(file.sars_submission_id);
    }
    if (file.status_code == 1301) {
      this.filesSubmittedToSars.push(file.sars_submission_id);
    }
    if (file.status_code == 1302) {
      this.filesAcknowlowdged.push(file.sars_submission_id);
    }
    if (file.status_code == 1205 || file.status_code == 1303) {
      this.filesAcceptedWarnings.push(file.sars_submission_id);
    }
    if (file.status_code == 1311) {
      this.filesRejected.push(file.sars_submission_id);
    }
    if (file.status_code == 1210) {
      this.filesToPartialUpload.push(file.sars_submission_id);
    }
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
        this.deleteFiles();
        this.selection = new SelectionModel<any[]>(false, []);
      }
    });
  }
/*  
......................................................................................................
* This is the deleteFiles function

* deleteFiles is used to open delete file
.......................................................................................................
*/
  deleteFiles() {
    this.loading = true;
    this.dataSubmissionService.deleteFile(this.deleteFile).subscribe(response => {
      let newResponse = response;
      this.handleResponse(newResponse);
    },
      (error) => {
        this.loading = false;
        this.toastr.error('Something went wrong')
      })
  }
/*  
......................................................................................................
* This is the handleResponsefunction

* handleResponseis used to handle API response
.......................................................................................................
*/
  private handleResponse(newResponse: any) {
    if (newResponse.Statuscode == 200) {
      this.loading = false;
      this.getSarsUploadData();
      this.filesToDelete();
      this.toastr.success(newResponse.Message);
    }
    else {
      this.toastr.error(newResponse.Message);
    }
  }
/*  
......................................................................................................
* This is the openDialogprocess function

* openDialogprocess is used to open dialog
.......................................................................................................
*/
  openDialogprocess() {
    this.loading = true;
    this.fileTypeService.ProcessFile(this.fileIds[0], this.fileNames[0]).subscribe((response: any) => {
      let newResponse = response
      if (newResponse.Statuscode == 200) {
        this.loading = false;
        this.dialog.open(ProcessFilePopupComponent, { width: '50%' });
        this.getSarsUploadData();
        this.selection.clear();
        this.filesToDelete()
      }
      else {
        this.toastr.error(newResponse.Message)
      }
    },
      (error) => {
        this.loading = false;
        this.toastr.error('Something went wrong')
      })
  }
/*  
......................................................................................................
* This is the downloadFile function

* downloadFile is used to download file
.......................................................................................................
*/
  downloadFile() {
    this.downloadStatus.emit({ status: ProgressStatusEnum.START });
    this.fileTypeService.downloadFile(this.fileIds[0], this.fileNames[0]).subscribe(
      (data: any) => {
        switch (data.type) {
          case HttpEventType.DownloadProgress:
            this.downloadStatus.emit({ status: ProgressStatusEnum.IN_PROGRESS, percentage: Math.round((data.loaded / data.total) * 100) });
            break;
          case HttpEventType.Response:
            this.downloadStatus.emit({ status: ProgressStatusEnum.COMPLETE });
            const downloadedFile = new Blob([data.body], { type: data.body.type });
            const a = document.createElement('a');
            a.setAttribute('style', 'display:none;');
            document.body.appendChild(a);
            a.download = this.fileNames[0];
            a.href = URL.createObjectURL(downloadedFile);
            a.target = '_blank';
            a.click();
            document.body.removeChild(a);
            break;
        }
      },
      error => {
        this.downloadStatus.emit({ status: ProgressStatusEnum.ERROR });
        this.toastr.error("Something went wrong!");
      }
    );
  }
/*  
......................................................................................................
* This is the refresh function

* refresh is used to refresh page
.......................................................................................................
*/
  refresh() {
    this.getSarsUploadData();
  }
/*  
......................................................................................................
* This is the getSarsUploadData function

* getSarsUploadData is used to get sars data
.......................................................................................................
*/
  getSarsUploadData(): void {
    let taxModule = JSON.parse(localStorage.getItem('taxModuleHeader') || 'null')
    let taxPeriods = JSON.parse(localStorage.getItem('taxPeriodsHeader') || 'null')
    if ((this.sarsDataSearchForm.controls.file_type.status == 'INVALID')
      || (this.sarsDataSearchForm.controls.status.status == 'INVALID')
      || (this.sarsDataSearchForm.controls.fund_entity.status == 'INVALID')
      || taxModule == null
      || taxPeriods == null) {
        this.toastr.error("Please select tax module, tax periods and SARS submission filters.")
        this.loading = false;
    }
    else {
      this.loading = true;
      let fileTypeIds: any = []
      let statusTypesIds: any = []

      let fundEntityIds: any = []
      let fileTypeLength = this.sarsDataSearchForm.controls.file_type.value.filter((filterFileType: any) => filterFileType != 0).length
      for (var i = 0; i < fileTypeLength ; i++) {
        var id = this.sarsDataSearchForm.controls.file_type.value[i].ID;
        fileTypeIds.push(id)
      }
      let statusLength= this.sarsDataSearchForm.controls.status.value.filter((statusType: any) => statusType != 0).length;
      for (var j = 0; j < statusLength; j++) {
        var id1 = this.sarsDataSearchForm.controls.status.value[j].ID;
        statusTypesIds.push(id1)
      }
      let fundLength = this.sarsDataSearchForm.controls.fund_entity.value.filter((fundType: any) => fundType != 0).length
      for (var k = 0; k < fundLength; k++) {
        var id2 = this.sarsDataSearchForm.controls.fund_entity.value[k].ID;
        fundEntityIds.push(id2)
      }

      this.newDataSubmission.fileregion_type = fileTypeIds;
      this.newDataSubmission.status_type = statusTypesIds;

      this.newDataSubmission.fundentity_type = fundEntityIds;
      this.newDataSubmission.Page = this.pageIndex;

        this.newDataSubmission.Size = this.size;
        this.newDataSubmission.SearchText = "";
        this.newDataSubmission.tax_type_id = JSON.parse(localStorage.getItem('taxModuleHeader') || 'null')
        this.newDataSubmission.tax_period_id = JSON.parse(localStorage.getItem('taxPeriodsHeader') || 'null')

      localStorage.setItem('cacheSarsData', JSON.stringify(this.newDataSubmission));

      this.getSarsDataAPICall();
    }
  }
/*  
......................................................................................................
* This is the getSarsDataAPICall function

* getSarsDataAPICall  is  used to get sars data API call
.......................................................................................................
*/
  private getSarsDataAPICall() {
    this.loading = true;
    this.dataSubmissionService.getSarsSubmissionData(this.newDataSubmission).subscribe(sarsSubmissionresponse => {
      let response = sarsSubmissionresponse;
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
    },
      (error) => {
        this.loading = false;
        this.tableData = [];
        if (this.pageIndex > 1 && this.tableData.length == 0) {
          this.pageIndex = this.pageIndex - 1;
          this.getSarsUploadData();
        }
        else {
          if (error && error.error && error.error.Message) {
            this.toastr.error(error.error.Message);
          } else {
            this.toastr.error('Something went wrong!');
          }
        }
      });
  }
/*  
......................................................................................................
* This is the navigateToSnapshot function

* navigateToSnapshot is  used to navigate to snapshot page
.......................................................................................................
*/
  navigateToSnapshot() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        "fileId": this.fileIds[0]
      }
    };
    this.router.navigate(['/sarsSnapshot'], navigationExtras);
  }
/*  
......................................................................................................
* This is the viewErrorReport function

* viewErrorReport  is  used to navigate to error report
.......................................................................................................
*/
  viewErrorReport() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        "fileId": this.fileIds[0]
      }
    };
    this.router.navigate(['/sarsValidation'], navigationExtras);
  }
/*  
......................................................................................................
* This is the submitSarsFile function

* submitSarsFile  is  used to SARS file submit API call
.......................................................................................................
*/
  submitSarsFile(){
  this.loading = true;
    this.dataSubmissionService.submitSarsFiles(this.fileIds[0]).subscribe((response : any) => {
      let newResponse = response;
      this.handleResponse(newResponse);
    },
      (error) => {
        this.loading = false;
        this.toastr.error('Something went wrong')
      })
  }

}
