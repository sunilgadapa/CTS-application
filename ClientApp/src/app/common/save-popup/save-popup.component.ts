import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-save-popup',
  templateUrl: './save-popup.component.html',
  styleUrls: ['./save-popup.component.css']
})
export class SavePopupComponent {
  message: string = "Are you sure?"
  confirmButtonText = "Yes"
  cancelButtonText = "Cancel"
  header="";
  description: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<SavePopupComponent>) {
    if (data) {  
       this.header = data.header;
       this.message = data.message;
       this.description = data.description;
        if (data.buttonText) {
          this.confirmButtonText = data.buttonText.ok || this.confirmButtonText;
          this.cancelButtonText = data.buttonText.cancel || this.cancelButtonText;
        }      
    }
  }
  /*  
.......................................................................................................
* This is the onConfirmClick function

* onConfirmClick is used to close dialog box
.......................................................................................................
*/
  onConfirmClick(): void {
    this.dialogRef.close(true);
  }
   /*  
.......................................................................................................
* This is the onCloseClick function

* onCloseClick() is used to close dialog box
.......................................................................................................
*/
  onCloseClick(): void {
    this.dialogRef.close(false);
  }
}
