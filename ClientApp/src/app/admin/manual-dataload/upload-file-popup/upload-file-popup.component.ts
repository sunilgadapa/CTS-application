import { Component, ElementRef, EventEmitter, Inject, Output, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ManualUploadService } from "../../../_services/manualUpload/manualupload.service";
import { ToastrService } from 'ngx-toastr';
import { ProgressStatus } from 'src/app/_models/progress-status';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-upload-file-popup',
  templateUrl: './upload-file-popup.component.html',
  styleUrls: ['./upload-file-popup.component.css']
})
export class UploadFilePopupComponent {
  selectedFiles: FileList;
  currentFile: File;
  fileSelected=true;
  progress = 0;
  message = '';

  fileInfos: Observable<any>;
  @Output() public uploadStatus: EventEmitter<ProgressStatus>;
  @ViewChild('inputFile') inputFile: ElementRef;
  @ViewChild('myInput') myInputVariable: ElementRef;
  statusddl: boolean = false;
  File_Types: any;
  fileTypeData= '';
  selectedfile: any;

  constructor(private toastr: ToastrService, private manualUploadService: ManualUploadService, private dialogRef: MatDialogRef<UploadFilePopupComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
  ) {
    if (data) {
      if (data.from == "pasManulaUpload") {
        this.getFileTypeData('PasFileType')
      }
      else if (data.from == "manualUpload") {
        this.getFileTypeData('FileType')
      }
    }
  }


  getFileTypeData(fileType: any) {
    this.manualUploadService.getLookupdata(fileType).subscribe((response: any) => {
      this.File_Types = response;
    })
  }

  setfile(files: any) {
    this.selectedfile = files[0];
    this.fileSelected=false;
  }
  clearSelectedFile()
  {
    this.myInputVariable.nativeElement.value = "";
    this.fileSelected=true;
  }
  // upload() {
  //   this.manualUploadService.uploadFile(this.fileTypeData, 241, this.selectedfile).subscribe(response => {
  //     let newResponse = response
  //     if (newResponse.Statuscode == 200) {
  //       this.toastr.success('File uploaded successfully')
  //       this.dialogRef.close();
  //     }
  //   },
  //   (error) => {
  //     this.toastr.error(error.error.Message)          
  //   })    
  // }
  // upload() {
  //   
  //   this.uploadStatus.emit({ status: ProgressStatusEnum.START });
  //   this.manualUploadService.uploadFile(this.fileTypeData, 241, this.selectedfile).subscribe(
  //     (data: any) => {
  //       if (data) {
  //         switch (data.type) {
  //           case HttpEventType.UploadProgress:
  //             this.uploadStatus.emit({ status: ProgressStatusEnum.IN_PROGRESS, percentage: Math.round((data.loaded / data.total) * 100) });
  //             console.log("🚀 ~ file: upload-file-popup.component.ts ~ line 74 ~ UploadFilePopupComponent ~ upload ~ uploadStatus", this.uploadStatus)
  //             break;
  //           case HttpEventType.Response:
  //             this.inputFile.nativeElement.value = '';
  //             this.uploadStatus.emit({ status: ProgressStatusEnum.COMPLETE });
  //             console.log("🚀 ~ file: upload-file-popup.component.ts ~ line 79 ~ UploadFilePopupComponent ~ upload ~ uploadStatus", this.uploadStatus)
  //             break;
  //         }
  //       }
  //     },
  //     error => {
  //       this.inputFile.nativeElement.value = '';
  //       this.uploadStatus.emit({ status: ProgressStatusEnum.ERROR });
  //     }
  //   );
  // }
  upload(): void {
    this.progress = 0;
    this.manualUploadService.uploadFile(this.fileTypeData, 241, this.selectedfile).subscribe(
      (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {     
          this.toastr.success('File uploaded successfully')   
          this.dialogRef.close(true);                
       }
      },
      err => {
        this.progress = 0;
         this.message = 'Could not upload the file!';
         setTimeout(() => {
          this.toastr.error(err.error.Message)  
        }, 500);         
        this.dialogRef.close(true);
       
      });
  }
  toggleArrow() {
    this.statusddl = this.statusddl === true ? false : true;
  }
}
