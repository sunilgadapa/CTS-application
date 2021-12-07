import { Component, ViewChild, AfterViewInit, TemplateRef, Output, EventEmitter } from "@angular/core";
import { trigger, state, style, animate, transition } from '@angular/animations';
import { NavigationExtras, Router } from '@angular/router';
import { DeletePopupComponent } from '../../common/delete-popup/delete-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { UploadFilePopupComponent } from "../../admin/manual-dataload/upload-file-popup/upload-file-popup.component";
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
import { PromoteFilePopupComponent } from "src/app/sars-submission/promote-file-popup/promote-file-popup.component";
import { GenerateFilePopupComponent } from "../generate-file-popup/generate-file-popup.component";
import { CorrespondenceService } from "src/app/_services/correspondence/correspondence.service";

@Component({
  selector: 'app-pas-correspondence',
  templateUrl: './correspondence.component.html',
  styleUrls: ['./correspondence.component.css'],
  animations: [
    trigger('rotatedState', [
      state('default', style({ transform: 'rotate(720deg)' })),
      transition('default => rotated', animate('800ms')),
      transition('rotated => default', animate('800ms')),
    ]),
  ],
})
export class CorrespondenceComponent implements AfterViewInit {
  @Output() public downloadStatus: EventEmitter<ProgressStatus>;
  //declaration of data
  correspondanceDataSearchForm: FormGroup;
  ReadyForGenerationFile: number[] = [];
  filesToReGenerate: any[] = [];
  deleteFile: any = [];
  generatedfile: any[] = [];
  generatedWithErrors: any[] = [];
  releasedAcceptedForPrinting: any[] = [];
  printingCompleted: any = [];
  constructor(public dialog: MatDialog, public router: Router,
    private formBuilder: FormBuilder,
    private fileTypeService: ManualUploadService,
    private toastr: ToastrService,
    private dataSubmissionService: DataSubmissionService,
    private correspondenceService : CorrespondenceService) {
    this.downloadStatus = new EventEmitter<ProgressStatus>();
    this.correspondanceDataSearchForm = this.formBuilder.group({
      brand: ['', Validators.required],
      file_type: ['', Validators.required],
      status: ['', Validators.required],
      correspondence_type: ['', Validators.required]
    });
  }
  public loadingTemplate: TemplateRef<any>;
  public loading = false;
  @ViewChild('allSelected') private allSelected: MatOption; // file type
  @ViewChild('allSelected2') private allSelected2: MatOption; // status
  @ViewChild('allSelected3') private allSelected3: MatOption; // correspondance type
  @ViewChild('allSelected4') private allSelected4: MatOption; // brand
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
  FileId: any[] = [];
  FileName: any[] = [];
  FileStatus: any[] = [];
  Status_Types: any[] = [];
  statusType: StatusTypeData;
  Tax_Period: any[] = [];
  TaxPeriodType: TaxModulePeriods;
  Brand: any[] = [];
  correspondance: any[] = [];
  fund_Entity: FundEntity;
  manualData: ManualData;
  size = 7;
  ID: any;
  newItem: any[] = [];
  fileID: any;
  fileName: any;

  newDataSubmission = {
    FileID: 0,
    Page: 1,
    Size: 7,
    SearchText: "",
    status_type: [],
    brand: [],
    correspondence_type: [],
    environment: [],
    tax_type_id: '',
    tax_period_id: ''
  }

  public labels: any = {
    previousLabel: "< Prev",
    nextLabel: "Next >"
  };
  pageIndex = 1;
  fileModel: FileModel;
  public directionLinks: boolean = true;
  selection = new SelectionModel<any[]>(true, []);
  isSelectedSingleToDownload: boolean;

  isSelectedSingleToGenerate: boolean;
  isSelectedSingleToReGenerate: boolean;

  isPreviewCorrespondance: boolean;
  isSelectedDelete: boolean;
  isViewSamples: boolean;
  isViewError: boolean;
  isFileOverview: boolean;
  isRelease: boolean;
  isReleaseForPrinting: boolean;
  isPaginate: boolean
  currentPage: number = 1;
  manualfiletypeDrop: any;
  totalPages: number;
  private replaySubject = new ReplaySubject<Response>(1);
  cache$: Observable<Response> = this.replaySubject.asObservable();
  dataSource = new MatTableDataSource<any>(undefined);
  columns = [
    { columnDef: 'status_flag', header: 'select', cell: (element: any) => `${element.status_type}` },
    { columnDef: 'tax_period', header: 'Tax Period', cell: (element: any) => `${element.tax_period_description}` },
    { columnDef: 'fund_entity', header: 'Brand', cell: (element: any) => `${element.brand_description}` },
    { columnDef: 'tax_number', header: 'Correspondance Type', cell: (element: any) => `${element.correspondence_type_description}` },
    { columnDef: 'file_name', header: 'File Name', cell: (element: any) => `${element.file_name}` },
    { columnDef: 'source_system', header: 'TEST/PROD', cell: (element: any) => `${element.correspondance_environment_name}` },
    { columnDef: 'status_date', header: 'Status Date', cell: (element: any) => `${element.status_date}` },
    { columnDef: 'updated_by', header: 'Updated By', cell: (element: any) => `${element.updated_by}` },
    { columnDef: 'status', header: 'Status', cell: (element: any) => `${element.status_description}` },
  ];
  columnsToDisplay = this.columns.map(c => c.columnDef);
  tableData: any[] = [];

  arrColorAmber = [1606]
  arrColorGreen = [1601, 1114, 1603, 1604]
  arrColorRed = [1602]
  arrColorBlue = [1605]



  //#region Toggle drop down list
  rotate() {
    this.state = this.state === 'default' ? 'rotated' : 'default';
    this.getCorrespondanceData();
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
* This is the toggleArrow1 function

*  toggleArrow1 is used to toggle dropdown arrow
.......................................................................................................
*/
  toggleArrow1() {
    this.statusddl1 = this.statusddl1 === true ? false : true;
  }
/*  
......................................................................................................
* This is the  toggleArrow2 function

*  toggleArrow2 is used to toggle dropdown arrow
.......................................................................................................
*/
  toggleArrow2() {
    this.statusddl2 = this.statusddl2 === true ? false : true;
  }
/*  
......................................................................................................
* This is the  toggleArrow3 function

*  toggleArrow3 is used to toggle dropdown arrow
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
      this.correspondanceDataSearchForm.controls.file_type
        .patchValue([...this.fileRegion.map((item: any) => item), 0]);
    } else {
      this.correspondanceDataSearchForm.controls.file_type.patchValue([]);
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
    if (this.correspondanceDataSearchForm.controls.file_type.value.length == this.fileRegion.length)
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
      this.correspondanceDataSearchForm.controls.status
        .patchValue([...this.Status_Types.map((item: any) => item), 0]);
    } else {
      this.correspondanceDataSearchForm.controls.status.patchValue([]);
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
    if (this.correspondanceDataSearchForm.controls.status.value.length == this.Status_Types.length)
      this.allSelected2.select();
    return true;
  }
/*  
......................................................................................................
* This is the toggleAllCorrespondanceType function

* toggleAllCorrespondanceType is used to toggle correspondance type
.......................................................................................................
*/
  toggleAllCorrespondanceType() {
    if (this.allSelected3.selected) {
      this.correspondanceDataSearchForm.controls.correspondence_type
        .patchValue([...this.correspondance.map((item: any) => item), 0]);
    } else {
      this.correspondanceDataSearchForm.controls.correspondence_type.patchValue([]);
    }
  }
/*  
......................................................................................................
* This is the toggleCorrespondanceType function

* toggleCorrespondanceType is used to toggle correspondance type
.......................................................................................................
*/
  toggleCorrespondanceType() {
    if (this.allSelected3.selected) {
      this.allSelected3.deselect();
      return false;
    }
    if (this.correspondanceDataSearchForm.controls.correspondence_type.value.length == this.correspondance.length)
      this.allSelected3.select();
    return true;
  }
/*  
......................................................................................................
* This is the toggleAllBrandType function

* toggleAllBrandType is used to toggle all brand type
.......................................................................................................
*/
  toggleAllBrandType() {
    if (this.allSelected4.selected) {
      this.correspondanceDataSearchForm.controls.brand
        .patchValue([...this.Brand.map((item: any) => item), 0]);
    } else {
      this.correspondanceDataSearchForm.controls.brand.patchValue([]);
    }
  }
/*  
......................................................................................................
* This is the toggleBrandType function

* toggleBrandType is used to toggle brand type
.......................................................................................................
*/
  toggleBrandType() {
    if (this.allSelected4.selected) {
      this.allSelected4.deselect();
      return false;
    }
    if (this.correspondanceDataSearchForm.controls.brand.value.length == this.Brand.length)
      this.allSelected4.select();
    return true;
  }

  //#endregion
  //#region Mat Table events and methods
  /*  
......................................................................................................
* This is the paginate function

* @event provide info about page 

* paginate is used to pagination
.......................................................................................................
*/
  paginate(event: any) {
    this.isPaginate = true
    this.filesToDelete()
    this.pageIndex = event;
    this.currentPage = event;
    this.getCorrespondanceData()
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
    const fileRegion = this.correspondenceService.getTypeEnvLookupdata('CorrespondenceEnv');
    const status = this.correspondenceService.getBrandStatusLookupdata('CorrespondenceStatus');
    const Brand = this.correspondenceService.getBrandStatusLookupdata('CorrespondenceBrand');
    const correspondance = this.correspondenceService.getTypeEnvLookupdata('CorrespondenceType');
    this.getDropdownAPI(fileRegion, status, Brand, correspondance);
  }
/*  
......................................................................................................
* This is the getDropdownAPI function

* getDropdownAPI is used to get all sect dropdown data by API call
.......................................................................................................
*/
  private getDropdownAPI(fileRegion: Observable<any>, status: Observable<any>, Brand: Observable<any>, correspondance: Observable<any>) {
    forkJoin([fileRegion, status, Brand, correspondance]).subscribe(result => {
      this.getFileType(result);
      this.getStatusType(result);
      this.getBrandType(result);
      this.getCorrespondanceType(result);
      this.getCorrespondanceData();
      this.loading = false;
    }, (error) => {
      this.loading = false;
    });
  }
/*  
......................................................................................................
* This is the getCorrespondanceType function

* getCorrespondanceType is used to get correspondance type
.......................................................................................................
*/
  private getCorrespondanceType(result: [any, any, any, any]) {
    this.correspondance = result[3];
    let correspondanceDDL = JSON.parse(localStorage.getItem('cacheCorrespondanceData') || 'null');

    if (correspondanceDDL != null) {

      let defaultValues = this.correspondance.filter((id: any) => correspondanceDDL.correspondence_type.includes(id.Status_Code));
      this.correspondanceDataSearchForm.controls['correspondence_type'].setValue(defaultValues);
      if (defaultValues.length == this.correspondance.length) {
        this.correspondanceDataSearchForm.controls['correspondence_type'].setValue(0);
        this.toggleAllCorrespondanceType();
      }
    }else{
      this.correspondanceDataSearchForm.controls['correspondence_type'].setValue(0);
        this.toggleAllCorrespondanceType(); 
    }
  }
/*  
......................................................................................................
* This is the getBrandType function

* getBrandType is used to get barnd type
.......................................................................................................
*/
  private getBrandType(result: [any, any, any, any]) {
    this.Brand = result[2];
    let brandDDL = JSON.parse(localStorage.getItem('cacheCorrespondanceData') || 'null');

    if (brandDDL != null) {

      let defaultValues = this.Brand.filter((id: any) => brandDDL.brand.includes(id.ID));
      this.correspondanceDataSearchForm.controls['brand'].setValue(defaultValues);
      if (defaultValues.length == this.Brand.length) {
        this.correspondanceDataSearchForm.controls['brand'].setValue(0);
        this.toggleAllBrandType();
      }
    }
    else {
      this.correspondanceDataSearchForm.controls['brand'].setValue(0);
      this.toggleAllBrandType();
    }
  }
/*  
......................................................................................................
* This is the getStatusType function

* getStatusType is used to get status type
.......................................................................................................
*/
  private getStatusType(result: [any, any, any, any]) {
    this.Status_Types = result[1];
    let fileStatusdropdown = JSON.parse(localStorage.getItem('cacheCorrespondanceData') || 'null');
    if (fileStatusdropdown != null) {

      let defaultValues = this.Status_Types.filter((id: any) => fileStatusdropdown.status_type.includes(id.ID));

      this.correspondanceDataSearchForm.controls['status'].setValue(defaultValues);
      if (defaultValues.length == this.Status_Types.length) {
        this.correspondanceDataSearchForm.controls['status'].setValue(0);
        this.toggleAllStatus();
      }
    } else {
      this.correspondanceDataSearchForm.controls['status'].setValue(0);
      this.toggleAllStatus();
    }
  }
/*  
......................................................................................................
* This is the getFileTypefunction

* getFileType is used to get file type
.......................................................................................................
*/
  private getFileType(result: [any, any, any, any]) {
    this.fileRegion = result[0];
    let filedropdownvalue = JSON.parse(localStorage.getItem('cacheCorrespondanceData') || 'null');
    if (filedropdownvalue != null) {
      let defaultValues = this.fileRegion.filter((id: any) => filedropdownvalue.environment.includes(id.Status_Code));
      this.correspondanceDataSearchForm.controls['file_type'].setValue(defaultValues);
      if (defaultValues.length == this.fileRegion.length) {
        this.correspondanceDataSearchForm.controls['file_type'].setValue(0);
        this.toggleAllFileType();
      }
    }
    else {
      this.correspondanceDataSearchForm.controls['file_type'].setValue(0);
      this.toggleAllFileType();
    }
  }
/*  
......................................................................................................
* This is the   ngAfterViewInit() {

* ngAfterViewInit is used to get all dropdown data
.......................................................................................................
*/
  ngAfterViewInit() {
    let fileStatusdropdown = JSON.parse(localStorage.getItem('cacheCorrespondanceData') || 'null')
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
* This is the  generateFile  function

* generateFile is used to open generate file dialog
.......................................................................................................
*/
  generateFile(): void {
    const dialogRef = this.dialog.open(GenerateFilePopupComponent, {
      data: {
      }, width: '36%'
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      this.handleDialogClose(confirmed);
    });
  }
  /*  
......................................................................................................
* This is the  openDialog  function

* openDialog is used to open upload dialog
.......................................................................................................
*/
  openDialog(): void {
    const dialogRef = this.dialog.open(UploadFilePopupComponent, {
      data: {
        from: 'pasManulaUpload'
      }, width: '36%'
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      this.handleDialogClose(confirmed);
    });
  }
 /*  
......................................................................................................
* This is the handleDialogClose function

* handleDialogClose is used to handle close event
.......................................................................................................
*/
  private handleDialogClose(confirmed: boolean) {
    if (confirmed) {
      this.getCorrespondanceData();
    }
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
      }, width: '40%'
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
* This is the filePromoteRepromote function

*  filePromoteRepromote is used to file promote repromote
.......................................................................................................
*/
  filePromoteRepromote() {
    this.loading = true;
    this.dataSubmissionService.filePromote(this.fileIds[0]).subscribe(response => {
      let newResponse = response
      if (newResponse.Statuscode == 200) {
        this.loading = false;
        this.getCorrespondanceData();
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
    this.newItem = this.selection.selected
    this.fileNames = [];
    this.fileIds = [];
    this.ReadyForGenerationFile = [];
    this.filesToReGenerate = [];
    this.generatedfile = [];
    this.generatedWithErrors = [];
    this.releasedAcceptedForPrinting = [];
    this.printingCompleted = [];
    this.isSelectedSingleToGenerate = false;
    this.isSelectedSingleToReGenerate = false;
    this.isPreviewCorrespondance = false;
    this.isSelectedSingleToDownload = false;
    this.isViewSamples = false;
    this.isReleaseForPrinting = false;
    this.isSelectedDelete = false;
    this.isPreviewCorrespondance = false;
    this.isViewError = false;
    this.isFileOverview = false;

    for (let file of this.newItem) {
      this.fileNames.push(file.file_name);
      this.fileIds.push(file);
      let temp = {
        Ids: file,
        FileName: file.file_name
      }
      this.deleteFile.push(temp);
      if (file.status_code == '1114') {
        this.ReadyForGenerationFile.push(file)
      }
      if (file.status_code == '1601') {
        this.generatedfile.push(file)
      }
      if (file.status_code == '1602') {
        this.generatedWithErrors.push(file)
      }
      if (file.status_code == '1603' || file.status_code == '1604') {
        this.releasedAcceptedForPrinting.push(file)
      }

      if (file.status_code == '1605') {
        this.printingCompleted.push(file)
      }
    }

    this.statusWiseEnableButtons();

  }
 /*  
......................................................................................................
* This is the statusWiseEnableButtons function

* statusWiseEnableButtons is used to enable disable button
.......................................................................................................
*/
  private statusWiseEnableButtons() {
    if (this.selection.selected.length === 1 && this.ReadyForGenerationFile.length > 0) {
      this.isSelectedSingleToGenerate = true;
      this.isSelectedDelete = false;

    }
    if (this.selection.selected.length === 1 && this.generatedfile.length > 0) {

      this.isSelectedDelete = true;
      this.isPreviewCorrespondance = true;
      this.isFileOverview = true;
      this.isReleaseForPrinting = true;
    }
    if (this.selection.selected.length === 1 && this.generatedWithErrors.length > 0) {
      this.isSelectedDelete = true;
      this.isPreviewCorrespondance = true;
      this.isFileOverview = true;
      this.isReleaseForPrinting = true;
      this.isSelectedSingleToReGenerate = true;
      this.isViewError = true;
    }

    if (this.selection.selected.length === 1 && this.releasedAcceptedForPrinting.length > 0) {
      this.isSelectedDelete = false;
      this.isPreviewCorrespondance = true;
      this.isFileOverview = true;
      this.isSelectedSingleToDownload = true;
    }

    if (this.selection.selected.length === 1 && this.printingCompleted.length > 0) {
      this.isSelectedDelete = false;
      this.isPreviewCorrespondance = true;
      this.isFileOverview = true;
      this.isSelectedSingleToDownload = true;
      if(this.printingCompleted[0].correspondance_environment_name=='Sample'){
        this.isViewSamples = true;
      }else{
        this.isViewSamples = false;
      }
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
        this.dialog.open(ProcessFilePopupComponent, { width: '40%' });
        this.getCorrespondanceData();
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
    this.getCorrespondanceData();
  }
/*  
......................................................................................................
* This is the getCorrespondanceData function

* getCorrespondanceData is used to get correspondance data
.......................................................................................................
*/
  getCorrespondanceData(): void {
    let taxModule = JSON.parse(localStorage.getItem('taxModuleHeader') || '243')
    let taxPeriods = JSON.parse(localStorage.getItem('taxPeriodsHeader') || '[0]')
    if ((this.correspondanceDataSearchForm.controls.file_type.status == 'INVALID')
      || (this.correspondanceDataSearchForm.controls.status.status == 'INVALID')
      || (this.correspondanceDataSearchForm.controls.correspondence_type.status == 'INVALID') 
      || (this.correspondanceDataSearchForm.controls.brand.status == 'INVALID')  
      || taxModule == null
      || taxPeriods == null) {
        this.toastr.error("Please select tax module, tax periods and correspondance filters.")
        this.loading = false;
    }
    else {
      this.loading = true;
      let fileTypeIds: any = []
      let statusTypesIds: any = []
      let brandIds: any = []
      let correspondanceIds: any = []

      let fileTypeLength = this.correspondanceDataSearchForm.controls.file_type.value.filter((fileType: any) => fileType != 0).length;

      for (var i = 0; i < fileTypeLength; i++) {
        var id = this.correspondanceDataSearchForm.controls.file_type.value[i].Status_Code;
        fileTypeIds.push(id)
      }
      let statusLength = this.correspondanceDataSearchForm.controls.status.value.filter((statusType: any) => statusType != 0).length;
      for (var j = 0; j < statusLength; j++) {
        var id1 = this.correspondanceDataSearchForm.controls.status.value[j].ID;
        statusTypesIds.push(id1)
      }
      let brandLength = this.correspondanceDataSearchForm.controls.brand.value.filter((brandType: any) => brandType != 0).length;
      for (var k = 0; k < brandLength; k++) {
        var id2 = this.correspondanceDataSearchForm.controls.brand.value[k].ID;
        brandIds.push(id2)
      }
      let correspondanceLength = this.correspondanceDataSearchForm.controls.correspondence_type.value.filter((corrsType: any) => corrsType != 0).length;
      for (var l = 0; l < correspondanceLength; l++) {
        var id3 = this.correspondanceDataSearchForm.controls.correspondence_type.value[l].Status_Code;
        correspondanceIds.push(id3)
      }

      this.newDataSubmission.environment = fileTypeIds;
      this.newDataSubmission.status_type = statusTypesIds;

      this.newDataSubmission.brand = brandIds;
      this.newDataSubmission.correspondence_type = correspondanceIds;
      this.newDataSubmission.Page = this.pageIndex;

      this.newDataSubmission.Size = this.size;
      this.newDataSubmission.SearchText = "";
      this.newDataSubmission.tax_type_id = JSON.parse(localStorage.getItem('taxModuleHeader') || '243')
      this.newDataSubmission.tax_period_id = JSON.parse(localStorage.getItem('taxPeriodsHeader') || '[0]')

      localStorage.setItem('cacheCorrespondanceData', JSON.stringify(this.newDataSubmission));

      this.correspondanceAPICall();
    }
  }
/*  
......................................................................................................
* This is the correspondanceAPICall function

* correspondanceAPICall is used to navigate to correspondance API call
.......................................................................................................
*/
  private correspondanceAPICall() {
    this.loading = true;
    this.correspondenceService.getCorrespondanceData(this.newDataSubmission).subscribe(sarsSubmissionresponse => {
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
        this.dataSource = new MatTableDataSource<any>(
          this.tableData.slice(0, this.size)
        );
        if (this.pageIndex > 1 && this.tableData.length == 0) {
          this.pageIndex = this.pageIndex - 1;
          this.getCorrespondanceData();
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
  submitSarsFile() {
    this.loading = true;
    this.dataSubmissionService.submitSarsFiles(this.fileIds[0]).subscribe(response => {
      let newResponse = response
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
      this.getCorrespondanceData();
      this.filesToDelete();
      this.toastr.success(newResponse.Message);
    }
    else {
      this.toastr.error(newResponse.Message);
    }
  }
}
