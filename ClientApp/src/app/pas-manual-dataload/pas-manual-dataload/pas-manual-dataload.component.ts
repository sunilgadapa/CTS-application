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
import { PasmanualuploadService } from "../../_services/manualUpload/pasmanualupload.service";
import { SelectionModel } from "@angular/cdk/collections";
import { FileTypeData } from '../../_models/fileTypeData';
import { StatusTypeData } from "src/app/_models/StatusTypeData";
import { TaxModulePeriods } from '../../_models/TaxModulePeriod';
import { LoadType } from '../../_models/LoadType';
import { FileModel } from '../../_models/FileModel';
import { ManualData } from '../../_models/manualUpload';
import { MatTableDataSource } from "@angular/material/table";
import { MatOption } from "@angular/material/core";
import { forkJoin } from "rxjs";
import { ProgressStatus } from "src/app/_models/progress-status";
import { SignOffPopupComponent } from "../sign-off-popup/sign-off-popup.component";
import { DownloadPopupComponent } from "src/app/common/download-progress/download-progress.component";

@Component({
  selector: 'app-pas-manual-dataload',
  templateUrl: './pas-manual-dataload.component.html',
  styleUrls: ['./pas-manual-dataload.component.css'],
  animations: [
    trigger('rotatedState', [
      state('default', style({ transform: 'rotate(720deg)' })),
      transition('default => rotated', animate('800ms')),
      transition('rotated => default', animate('800ms')),
    ]),
  ],
})
export class PasManualDataloadComponent implements AfterViewInit {
  @Output() public downloadStatus: EventEmitter<ProgressStatus>;
  maualdatasearchform: FormGroup;
  // rejectedFile: any[] = [];
  loadedNoError: any[] = [];
  deleteFile: any[] = [];
  signOffFile: any;
  signedOFFdata: any;
  Rejecteddata: any;
  rejectedFile = false;
  uploadFile = false;
  roleId: any[] = []
  constructor(public dialog: MatDialog, public router: Router,
    private formBuilder: FormBuilder,
    private pasManualUploadService: PasmanualuploadService,
    private fileTypeService: ManualUploadService,
    private toastr: ToastrService) {
    this.downloadStatus = new EventEmitter<ProgressStatus>();
    this.maualdatasearchform = this.formBuilder.group({
      source_system: ['', Validators.required],
      file_type: ['', Validators.required],
      status: ['', Validators.required]
    });
    this.getUserData()
  }
  public loadingTemplate: TemplateRef<any>;
  public loading = false;
  @ViewChild('allSelected') private allSelected: MatOption;
  @ViewChild('allSelected2') private allSelected2: MatOption;
  @ViewChild('allSelected3') private allSelected3: MatOption;
  @ViewChild('allSelected4') private allSelected4: MatOption;

  //#region Declarations
  //#region booleans
  isSelectedDelete: boolean;
  isSelectedSingleToValidate: boolean;
  isSelectedSingleToDownload: boolean;
  isSelectedSingleToProcess: boolean;
  isSelectedSingleToSignOff: boolean;
  isSelectedSingleNoError: boolean = false;
  isSelectedSingleRejected: boolean = false;
  isReProcessFile: boolean = false;
  signedOFF = false;
  partialUpload = false;
  isPaginate: boolean
  statusddl: boolean = false;
  statusddl1: boolean = false;
  statusddl2: boolean = false;
  isProcessFile: boolean = false;
  dataloadfilter: boolean = false;
  public directionLinks: boolean = true;
  //#endregion
  //#region JSON Arrays
  TaxPeriodType: TaxModulePeriods;
  statusType: StatusTypeData;
  fileTypeData: FileTypeData;
  LoadType: LoadType;

  manualData: ManualData;
  file_type: any[] = [];
  sourceSystem: any[] = [];
  fileNames: any[] = [];
  fileIds: number[] = [];
  filesToValidate: number[] = [];
  filesToProcess: number[] = [];
  filesToSignOff: number[] = [];
  FileId: any[] = [];
  FileName: any[] = [];
  FileStatus: any[] = [];
  Status_Types: any[] = [];
  Tax_Period: any[] = [];
  File_Type: any[] = [];
  newItem: any[] = [];
  fileTypeIds: any = []
  statusTypesIds: any = []
  srcSymIds: any = []
  //#endregion
  //#region Other Data-type declaration
  processButtonText: string = 'Process';
  state: string = 'default';
  ID: any;
  fileID: any;
  fileName: any;
  newManualUpload = {
    FileID: 0,
    Page: 1,
    Size: 7,
    SearchText: "",
    status_type: [],
    tax_period: [],
    file_type: [],
    TaxModuleId: 0,
    TaxPeriodId: 0,
    SourceSystemIds: []
  }
  signOff = {
    file_id: 0,
    status: "",
    document_type_id: 0
  }
  public labels: any = {
    previousLabel: "< Prev",
    nextLabel: "Next >"
  };
  fileModel: FileModel;
  manualfiletypeDrop: any;
  //#endregion
  //#region Mat-table
  p: any;
  totalRecords: number = 7;
  size = 7;
  pageIndex = 1;
  currentPage: number = 1;
  totalPages: number;
  tableData: any[] = [];
  selection = new SelectionModel<any[]>(true, []);
  dataSource = new MatTableDataSource<any>(undefined);
  columns = [
    { columnDef: 'status_flag', header: 'select', cell: (element: any) => `${element.status_flag}` },
    { columnDef: 'file_name', header: 'File Name', cell: (element: any) => `${element.file_name}` },
    { columnDef: 'source_system', header: 'Source System', cell: (element: any) => `${element.SourceSystemName}` },
    { columnDef: 'file_type_val', header: 'File Type', cell: (element: any) => `${element.file_type_val}` },
    { columnDef: 'taxperiod', header: 'Tax Period', cell: (element: any) => `${element.taxperiod}` },
    { columnDef: 'file_landed_date', header: 'Landed Date', cell: (element: any) => `${element.file_landed_date}` },
    { columnDef: 'status', header: 'Status', cell: (element: any) => `${element.status}` },
  ];
  columnsToDisplay = this.columns.map(c => c.columnDef);
  //#endregion
  //#endregion

  //#region Toggle drop down list
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

*  toggleArrow2 is used to toggle dropdown arrow
.......................................................................................................
*/
  toggleArrow2() {
    this.statusddl2 = this.statusddl2 === true ? false : true;
  }
  //#endregion

  //#region Drop down list select

  /*  
......................................................................................................
* This is the  rotate function

*  rotate is used to roatet
.......................................................................................................
*/
  rotate() {
    this.state = this.state === 'default' ? 'rotated' : 'default';
    this.getManualUplaodData();
  }
  /*  
 ......................................................................................................
 * This is the toggleAllSourceSystem function
 
 *  rotatetoggleAllSourceSystem is used to toggle all source type
 .......................................................................................................
 */
  toggleAllSourceSystem() {
    if (this.allSelected.selected) {
      this.maualdatasearchform.controls.source_system
        .patchValue([...this.sourceSystem.map((item: any) => item), 0]);
    } else {
      this.maualdatasearchform.controls.source_system.patchValue([]);
    }
  }
  /*  
......................................................................................................
* This is the toggleSourceSystem function

*  rotatetoggleSourceSystem is used to toggle source type
.......................................................................................................
*/
  toggleSourceSystem() {
    if (this.allSelected.selected) {
      this.allSelected.deselect();
      return false;
    }
    if (this.maualdatasearchform.controls.source_system.value.length == this.sourceSystem.length)
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
      this.maualdatasearchform.controls.status
        .patchValue([...this.Status_Types.map((item: any) => item), 0]);
    } else {
      this.maualdatasearchform.controls.status.patchValue([]);
    }
  }
  /*  
......................................................................................................
* This is the toggleStatus function

* toggleStatus is used to toggle  status
.......................................................................................................
*/
  toggleStatus() {
    if (this.allSelected2.selected) {
      this.allSelected2.deselect();
      return false;
    }
    if (this.maualdatasearchform.controls.status.value.length == this.Status_Types.length)
      this.allSelected2.select();
    return true;
  }
  /*  
......................................................................................................
* This is the toggleAllFileType function

* toggleAllFileType is used to toggle  all file type
.......................................................................................................
*/
  toggleAllFileType() {
    if (this.allSelected4.selected) {
      this.maualdatasearchform.controls.file_type
        .patchValue([...this.File_Type.map((item: any) => item), 0]);
    } else {
      this.maualdatasearchform.controls.file_type.patchValue([]);
    }
  }
  /*  
......................................................................................................
* This is the toggleFileType function

* toggleFileType is used to toggle  file type
.......................................................................................................
*/
  toggleFileType() {
    if (this.allSelected4.selected) {
      this.allSelected4.deselect();
      return false;
    }
    if (this.maualdatasearchform.controls.file_type.value.length == this.File_Type.length)
      this.allSelected4.select();
    return true;
  }
  //#endregion

  //#region Get drop down data
  /*  
......................................................................................................
* This is the getAllDropDownData function

* getAllDropDownData is used to get all dropdown data
.......................................................................................................
*/
  getAllDropDownData() {
    this.loading = true;
    const sourceSystem = this.fileTypeService.getLookupdata('Source System');
    const status = this.fileTypeService.getLookupdata('PasStatus');
    const fileType = this.fileTypeService.getLookupdata('PasFileType');

    forkJoin([sourceSystem, status, fileType]).subscribe(result => {
      this.sourceSystem = result[0];

      let filedropdownvalue = JSON.parse(localStorage.getItem('PASmanualFilestatusDDL') || 'null')
      if (filedropdownvalue != null) {
        let defaultValues = this.sourceSystem.filter((id: any) => filedropdownvalue.SourceSystemIds.includes(id.ID));
        this.maualdatasearchform.controls['source_system'].setValue(defaultValues);
        if (filedropdownvalue.SourceSystemIds[0] == 0) {
          this.maualdatasearchform.controls['source_system'].setValue(0);
          this.toggleAllSourceSystem()
        }
      }else
      {
        this.maualdatasearchform.controls['source_system'].setValue(0);
        this.toggleAllSourceSystem()
      }

      this.Status_Types = result[1];
      let fileStatusdropdown = JSON.parse(localStorage.getItem('PASmanualFilestatusDDL') || 'null')
      if (fileStatusdropdown != null) {

        let defaultValues = this.Status_Types.filter((id: any) => fileStatusdropdown.status_type.includes(id.ID));

        this.maualdatasearchform.controls['status'].setValue(defaultValues);
        if (defaultValues.length == this.Status_Types.length) {
          this.maualdatasearchform.controls['status'].setValue(0);
          this.toggleAllStatus()
        }
      }else{
        this.maualdatasearchform.controls['status'].setValue(0);
          this.toggleAllStatus()
      }
      this.File_Type = result[2];
      let fileTypeDDL = JSON.parse(localStorage.getItem('PASmanualFilestatusDDL') || 'null')

      if (fileTypeDDL != null) {

        let defaultValues = this.File_Type.filter((id: any) => fileTypeDDL.file_type.includes(id.ID));
        this.maualdatasearchform.controls['file_type'].setValue(defaultValues);
        if (defaultValues.length == this.File_Type.length) {
          this.maualdatasearchform.controls['file_type'].setValue(0);
          this.toggleAllFileType()
        }
      }else
      {
        this.maualdatasearchform.controls['file_type'].setValue(0);
        this.toggleAllFileType()
      }
      this.getManualUplaodData();
      this.loading = false;
    }, (error) => {
      this.loading = false;
    })
  }
  //#endregion

  //#region Mat Table events and methods
  arrColorAmber = [1001, 1017, 1013, 1008, 1007, 1011, 1006, 1004, 1002]
  arrColorGreen = [1014, 1015, 1016, 1012,]
  arrColorRed = [1010, 1005, 1003]
  /*  
......................................................................................................
* This is the paginate function

* paginate is used to for pagination
.......................................................................................................
*/
  paginate(event: any) {
    this.isPaginate = true
    this.selectFilesForOperation()
    this.pageIndex = event;
    this.currentPage = event;
    this.getManualUplaodData()
    this.dataSource = new MatTableDataSource<any>(
      this.tableData.slice(event * this.size - this.size, event * this.size)
    );
    this.rearrangePaging();
  }
  /*  
......................................................................................................
* This is the rearrangePaging function

* rearrangePaging is used to for pagination
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
 
 * isAllSelected is used to check selected
 .......................................................................................................
 */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  /*  
 ......................................................................................................
 * This is the  masterToggle function
 
 *  masterToggle is used to toggle
 .......................................................................................................
 */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }
  /*  
......................................................................................................
* This is the  buttonVisibilityByStatus function

*  buttonVisibilityByStatus is used to enable disable button
.......................................................................................................
*/
  buttonVisibilityByStatus(file: any, temp: any) {
    this.filesToSignOff = [];
    this.filesToValidate = [];
    this.filesToProcess = [];
    if (file.status == 'Ready to process') {
      this.processButtonText = 'Process'
      this.isReProcessFile = false;
    }else{
      this.processButtonText = 'ReProcess'
    }
    if (file.status == 'Has Corrections') {
      this.processButtonText = 'Reprocess'
      this.isReProcessFile = true;
    }else
    {
      this.processButtonText = 'Process'
    }
    if (file.status == 'Partial Upload' || file.status == 'Has Corrections') {
      this.filesToValidate.push(file.file_id)
    }
    if (file.status == 'Ready to process' || file.status == 'Has Corrections') {
      this.filesToProcess.push(file.file_id)
    }
    if (file.status == 'Partial Upload' || file.status == 'Ready for Signoff') {
      this.filesToSignOff.push(file.file_id)
    }
  }
  /*  
......................................................................................................
* This is the buttonVisibilityBySelection function

* buttonVisibilityBySelection is used to enable disable button
.......................................................................................................
*/
  buttonVisibilityBySelection() {

    this.rejectedFile = false;
    this.buttonsvisibility();
    if (this.selection.selected.length === 1) {
      this.isSelectedSingleToDownload = true;
      this.signedOFFdata = this.selection.selected[0]
      debugger
      if (this.signedOFFdata.file_status_code == 1015 || this.signedOFFdata.file_status_code == 1016) {
        this.signedOFF = true
      }
      else {
        this.signedOFF = false
      }
      this.checkRejectedStatus()
    }
    else {
      this.isSelectedSingleToDownload = false;
      this.rejectedFile = false;
    }
    if (this.selection.selected.length === 1 && this.filesToProcess.length > 0) {
      this.isSelectedSingleToProcess = true;
    }
    else {
      this.isSelectedSingleToProcess = false;
    }
    this.isSelectedSingleToSignOff = false;
    if (this.selection.selected.length === 1 && this.filesToSignOff.length > 0) {
      this.isSelectedSingleToSignOff = true;
      this.signOffFile = this.selection.selected[0]
      if (this.signOffFile.file_status_code == 1006) {
        this.partialUpload = true
      } else {
        this.partialUpload = false
      }

    }
    else {
      this.isSelectedSingleToSignOff = false;
    }
  }

  private buttonsvisibility() {
    if (this.selection.selected.length == 1 && this.loadedNoError.length > 0) {
      this.isSelectedSingleNoError = true;
    } else {
      this.isSelectedSingleNoError = false;
    }

    if (this.selection.selected.length === 1 && this.filesToValidate.length > 0) {
      this.isSelectedSingleToValidate = true;
    }
    else {
      this.isSelectedSingleToValidate = false;
    }
  }

  checkRejectedStatus() {
    this.rejectedFile = false;
    this.Rejecteddata = this.selection.selected[0]
    if (this.Rejecteddata.file_status_code == 1003) {
      this.rejectedFile = true;
    }
    else {
      this.rejectedFile = false;
    }
  }
  /*  
......................................................................................................
* This is the selectFilesForOperation function

* selectFilesForOperation is used to delete
.......................................................................................................
*/
  selectFilesForOperation() {
    this.newItem = [];
    this.newItem = this.selection.selected
    this.fileNames = [];
    this.fileIds = [];
    this.loadedNoError = [];
    this.filesToValidate = [];
    this.filesToProcess = [];
    this.deleteFile = [];
    this.rejectedFile = false;
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
      this.isSelectedSingleToSignOff = false;
      this.isSelectedSingleNoError = false;

    }
    this.deleteVlidation()

    if (this.selection.selected.length === 1 && this.filesToValidate.length > 0) {
      this.isSelectedSingleToValidate = true;
    }
    else {
      this.isSelectedSingleToValidate = false;
    }
    if (this.selection.selected.length === 1) {
      this.isSelectedSingleToDownload = true;
      this.signedOFFdata = this.selection.selected[0]
      if (this.signedOFFdata.file_status_code == 1015 || this.signedOFFdata.file_status_code == 1016) {
        this.signedOFF = true
      }
      else {
        this.signedOFF = false
      }
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



  deleteVlidation() {
    let visibledelete = false;
    for (let file of this.newItem) {
      if (file.file_status_code == 1008 || file.file_status_code == 1007) {
        visibledelete = true;
        break;
      }
    }
    if (this.selection.selected.length > 0 && !visibledelete) {

      this.isSelectedDelete = true;
    }
    else {
      this.isSelectedDelete = false;
    }
    if (this.selection.selected.length > 0) {
      this.uploadFile = true;
    } else {
      this.uploadFile = false;
    }
  }
  /*  
 ......................................................................................................
 * This is the refresh function
 
 * refresh is used to refresh
 .......................................................................................................
 */

  refresh() {
    this.getManualUplaodData();
  }

  /*  
 ......................................................................................................
 * This is the getValidatedFormControlData function
 
 * getValidatedFormControlData is used to get validated Form cntrol Data
 .......................................................................................................
 */
  getValidatedFormControlData() {
    this.dataloadfilter = false;
    this.loading = true;
    this.srcSymIds = []
    this.fileTypeIds = []
    this.statusTypesIds = []
    if (this.maualdatasearchform.controls.source_system.value.length - 1 == this.sourceSystem.length) {
      this.srcSymIds = [];
      this.srcSymIds.push(0);
    } else {
      this.srcSymIds = [];
      let sourceSystemLength = this.maualdatasearchform.controls.source_system.value.filter((filterFileType: any) => filterFileType != 0).length
      for (var i = 0; i < sourceSystemLength; i++) {
        var id = this.maualdatasearchform.controls.source_system.value[i].ID;
        this.srcSymIds.push(id)
      }
    }

    let fileTypeLength = this.maualdatasearchform.controls.file_type.value.filter((filterLoadType: any) => filterLoadType != 0).length
    for (var k = 0; k < fileTypeLength; k++) {
      var id3 = this.maualdatasearchform.controls.file_type.value[k].ID;
      this.fileTypeIds.push(id3)
    }
    let statusLength = this.maualdatasearchform.controls.status.value.filter((filterStatus: any) => filterStatus != 0).length
    for (var j = 0; j < statusLength; j++) {
      var id2 = this.maualdatasearchform.controls.status.value[j].ID;
      this.statusTypesIds.push(id2)
    }
  }
  /*  
......................................................................................................
* This is the getManualUplaodData function

* getManualUplaodData is used to get manual upload data
.......................................................................................................
*/
  getManualUplaodData(): void {

    let taxModule = JSON.parse(localStorage.getItem('taxModuleHeader') || 'null')
    let taxPeriods = JSON.parse(localStorage.getItem('taxPeriodsHeader') || 'null')
    if ((this.maualdatasearchform.controls.source_system.status == 'INVALID')
      || (this.maualdatasearchform.controls.file_type.status == 'INVALID')
      || (this.maualdatasearchform.controls.status.status == 'INVALID')
      || taxModule == null
      || taxPeriods == null) {
      this.dataloadfilter = true;
      setTimeout(() => {
        this.toastr.error("Please select tax module, tax periods and data load filters.")
      }, 300);
    }
    else {
      this.getValidatedFormControlData()
      this.newManualUpload.SourceSystemIds = this.srcSymIds
      this.newManualUpload.file_type = this.fileTypeIds
      this.newManualUpload.status_type = this.statusTypesIds
      this.newManualUpload.Page = this.pageIndex
      this.newManualUpload.Size = this.size
      this.newManualUpload.TaxModuleId = JSON.parse(localStorage.getItem('taxModuleHeader') || 'null')
      this.newManualUpload.tax_period = JSON.parse(localStorage.getItem('taxPeriodsHeader') || 'null')
      this.newManualUpload.SearchText = "";
      localStorage.setItem('PASmanualFilestatusDDL', JSON.stringify(this.newManualUpload));
      this.pasManualUploadService.GetPasDataLoad(this.newManualUpload).subscribe(manualUploadresponse => {
        let response = manualUploadresponse
        this.tableData = response.data;
        this.totalRecords = response.data[0].totalrows;
        this.loading = false;
        this.selection.clear()
        this.selectFilesForOperation()
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
            this.getManualUplaodData();
          }
          else {
            this.dataloadfilter = true;
          }
        });
    }
  }
  //#endregion

  //#region Data load operation methods and Events
  /*  
 ......................................................................................................
 * This is the openDialog function
 
 * openDialog is used to open dialog
 .......................................................................................................
 */
  openDialog(): void {
    const dialogRef = this.dialog.open(UploadFilePopupComponent, {
      data: {
        from: 'pasManulaUpload'
      }, width: '36%'
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.getManualUplaodData();
      }
    });
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
        this.selection.clear()

      }
    });
  }
  /*  
 ......................................................................................................
 * This is the deleteFiles function
 
 * deleteFiles is used to  delete files
 .......................................................................................................
 */
  deleteFiles() {
    this.loading = true;
    this.fileTypeService.deleteFile(this.deleteFile).subscribe(response => {
      let newResponse = response
      if (newResponse.Statuscode == 200) {
        this.loading = false;
        this.toastr.success(newResponse.Message);
        this.selection.clear();
        this.getManualUplaodData();
        this.selectFilesForOperation()
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
  /*  
 ......................................................................................................
 * This is the openDialogprocess function
 
 * openDialogprocess is used to process files
 .......................................................................................................
 */
  openDialogprocess() {
    debugger
    if (this.isReProcessFile) {
      this.reProcessFile();
    }
    else {
      this.processFile();
    }
  }
  private processFile() {
    this.loading = true;
    this.fileTypeService.ProcessFile(this.fileIds[0], this.fileNames[0]).subscribe((response: any) => {
      let newResponse = response;
      if (newResponse.Statuscode == 200) {
        this.processFileSuccess();
      }
    },
      (error) => {
        this.processFileFailed(error);
      });
  }
  private reProcessFile() {
    this.loading = true;
    this.pasManualUploadService.ReprocessFile(this.newItem[0].document_type_id, this.fileIds[0]).subscribe((newresponse: any) => {
      let newResponse = newresponse;
      if (newResponse.Statuscode == 200) {
        this.processFileSuccess();
      }
    },
      (error) => {
        this.processFileFailed(error);
      });
  }
  private processFileFailed(error: any) {
    this.loading = false;
    setTimeout(() => {
      this.toastr.error(error.error.Message);
    }, 499);
  }

  private processFileSuccess() {
    this.loading = false;
    this.dialog.open(ProcessFilePopupComponent, {
      data: {
        text: this.processButtonText
      }, width: '40%'
    });
    this.getManualUplaodData();
    this.selection.clear();
    this.selectFilesForOperation();
  }

  /*  
 ......................................................................................................
 * This is the openDialogSignOff function
 
 * openDialogSignOff is used to open signof dialog
 .......................................................................................................
 */
  openDialogSignOff(): void {
    this.loading = true;
    this.pasManualUploadService.CheckIfFileHasMissingInformation(this.newItem[0].document_type_id, this.fileIds[0]).subscribe(response => {
      let newResponse = response;
      this.loading = false;
      if (newResponse.Statuscode == 200) {
        this.toastr.error("Please fix all missing information errors before siging off.")
      }
    }, (error) => {
      const dialogRef = this.dialog.open(SignOffPopupComponent, {
        width: '40%'
      });
      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        this.loading = false;
        if (confirmed) {
          this.signOffFiles();
          this.selection.clear()
          this.selectFilesForOperation()
          this.getManualUplaodData();
        }

      });
    })
  }
  /*  
 ......................................................................................................
 * This is the signOffFiles function
 
 * signOffFiles is used to signof files
 .......................................................................................................
 */
  signOffFiles() {

    this.loading = true;
    this.signOff.file_id = this.fileIds[0];
    this.signOff.status = this.newItem[0].file_status_code;
    this.signOff.document_type_id = this.newItem[0].document_type_id;
    this.pasManualUploadService.signOffFile(this.signOff).subscribe((response: any) => {
      let newResponse = response
      if (newResponse.Statuscode == 200) {
        this.loading = false;
        this.toastr.success(newResponse.Message);
        this.selection.clear();
        this.getManualUplaodData();
        this.selectFilesForOperation()
      }
    },
      (error) => {
        this.loading = false;
        setTimeout(() => {
          this.toastr.error(error.error.Message)
        }, 500);
      })
  }
  /*  
 ......................................................................................................
 * This is the downloadFile function
 
 * downloadFile is used to download files
 .......................................................................................................
 */
  downloadFile() {
    this.dialog.open(DownloadPopupComponent, {
      data: {
        fileId: this.fileIds[0],
        filename: this.fileNames[0]
      }, width: '250px',
    });
  }
  //#endregion

  ngAfterViewInit() {
    let fileStatusdropdown = JSON.parse(localStorage.getItem('PASmanualFilestatusDDL') || 'null')
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
 * This is the navigateToErrorValidation function
 
 * navigateToErrorValidation is used to download files
 .......................................................................................................
 */
  navigateToErrorValidation() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        "fileId": this.fileIds[0]
      }
    };
    this.router.navigate(['/pasmanualdataloadvalidation'], navigationExtras);
  }


  getUserData() {

    const user = JSON.parse(localStorage.getItem('onBordeduser') || '{}');
    this.roleId = user.data.role_id

  }

}
