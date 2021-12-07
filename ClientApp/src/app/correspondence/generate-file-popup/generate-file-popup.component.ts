import { Component, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ManualUploadService } from 'src/app/_services/manualUpload/manualupload.service';
import { CorrespondenceService } from 'src/app/_services/correspondence/correspondence.service';

@Component({
  selector: 'app-generate-file-popup',
  templateUrl: './generate-file-popup.component.html',
  styleUrls: ['./generate-file-popup.component.css']
})
export class GenerateFilePopupComponent {
  selectedFiles: FileList;
  currentFile: File;
  fileSelected = true;
  progress = 0;
  message = '';

  fileInfos: Observable<any>;

  statusddl: boolean = false;
  File_Types: any;
  fileTypeData = '';
  selectedfile: any;

  constructor(private correspondenceService : CorrespondenceService, private toastr: ToastrService, private manualUploadService: ManualUploadService, private dialogRef: MatDialogRef<GenerateFilePopupComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
  ) {
    if (data) {
      this.getFileTypeData()
    }

  }

  /*  
......................................................................................................
* This is the getFileTypeData function

* getFileTypeData is used to get file type
.......................................................................................................
*/
  getFileTypeData() {
     this.correspondenceService.getTypeEnvLookupdata('CorrespondenceEnv').subscribe((response: any) => {
      this.File_Types = response;
    })
  }
 /*  
......................................................................................................
* This is the setfile function

* setfile is used to set file type
.......................................................................................................
*/
  setfile(files: any) {
    this.selectedfile = files[0];
    this.fileSelected = false;
  }
   /*  
......................................................................................................
* This is the clearSelectedFile function

*  clearSelectedFile is used to clear file
.......................................................................................................
*/
  clearSelectedFile() {

    this.fileSelected = true;
  }

 /*  
......................................................................................................
* This is the upload function

* upload is used to upload 
.......................................................................................................
*/
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
  /*  
......................................................................................................
* This is the toggleArrow function

* toggleArrow is used to toggle dropdown arrow
.......................................................................................................
*/
  toggleArrow() {
    this.statusddl = this.statusddl === true ? false : true;
  }
}
