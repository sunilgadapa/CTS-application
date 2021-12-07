import { Component, ElementRef, EventEmitter, Inject, Output, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ManualUploadService } from "../../_services/manualUpload/manualupload.service";
import { ToastrService } from 'ngx-toastr';
import { ProgressStatus } from 'src/app/_models/progress-status';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-upload-e-filling-popup',
  templateUrl: './upload-e-filling-popup.component.html',
  styleUrls: ['./upload-e-filling-popup.component.css']
})
export class UploadEFilePopupComponent {
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
  
  selectedfile: any;

  constructor(private toastr: ToastrService, private manualUploadService: ManualUploadService, private dialogRef: MatDialogRef<UploadEFilePopupComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
  ) {
    
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
  
  upload(): void {
    this.progress = 0;
    this.manualUploadService.uploadFile(1,241, this.selectedfile).subscribe(
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
  
}
