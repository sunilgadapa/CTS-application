import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-delete-popup',
  templateUrl: './delete-popup.component.html',
  styleUrls: ['./delete-popup.component.css']
})
export class DeletePopupComponent {
  users: string = ""
  message: string = "Are you sure?"
  confirmButtonText = "Yes"
  cancelButtonText = "Cancel"
  header="";
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<DeletePopupComponent>) {
    if (data) {  
         this.header=data.from;
         if(data.from=="User")
         {
           this.header="User"
         }else
         {
           this.header="Files"
         }
        var index = data.message.indexOf("?");
        var warning = data.message.substr(0, index);
        this.users = data.message.substr(index + 1);
        this.message = warning || this.message;
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
