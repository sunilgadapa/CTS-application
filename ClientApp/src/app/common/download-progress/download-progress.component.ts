import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { ManualUploadService } from 'src/app/_services/manualUpload/manualupload.service';
import { ToastrService } from "ngx-toastr";
import { Download } from 'src/app/_services/common/download';
@Component({
  selector: 'app-download-popup',
  templateUrl: './download-progress.component.html',
  styleUrls: ['./download-progress.component.css']
})
export class DownloadPopupComponent {
  download$: Observable<Download>;
  downloaded: boolean = false;
  isCall: boolean = false;
  loading: boolean = false;


  constructor(
    private dialogRef: MatDialogRef<DownloadPopupComponent>, @Inject(MAT_DIALOG_DATA) private data: any, private fileTypeService: ManualUploadService, private toastr: ToastrService) {
    if (data) {
      this.isCall = false;
      this.downloaded = false;
      this.loading = true;
      this.download$ = this.fileTypeService.download(data.fileId, data.filename)

    }
  }

  move() {
    if (!this.isCall) {
      this.isCall = true;
      var i = 0;
      this.newMethod(i);
    }
  }
  
  private newMethod(i: number) {
    if (i == 0) {
      i = 1;
      var elem = document.getElementById('myBar');
      var per = document.getElementById('per');

      var width = 5;
      var id = setInterval(frame, 20);
      function frame() {
        if (width >= 90) {
          clearInterval(id);
          i = 0;
        } else {
          width++;
          if (elem) {
            elem.style.width = width + '%';
          }
          if (per) {
            per.innerHTML = width + '%';
          }
        }
      }
    }
    return i;
  }

  downloadDone(data: any, state: any) {
    if (data == '100' && state == 'DONE' && !this.downloaded) {
      this.downloaded = true;
      setTimeout(() => {
        this.toastr.success("File downloaded successfully");
        this.dialogRef.close();
      }, 1000);
    }
  }

}
