import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-confirm-popup',
  templateUrl: './confirm-popup.component.html',
  styleUrls: ['./confirm-popup.component.css']
})
export class ConfirmPopupComponent {

  constructor(
  private dialogRef: MatDialogRef<ConfirmPopupComponent>) { }
   /*  
.......................................................................................................
* This is the onConfirmClick function

* onConfirmClick() is used to close confirm dialog box
.......................................................................................................
*/
  onConfirmClick(): void {
    this.dialogRef.close(true);
  }
   /*  
.......................................................................................................
* This is the onCloseClick function

* onCloseClick() is used to close confirm dialog box on close icon
.......................................................................................................
*/
  onCloseClick(): void {
    this.dialogRef.close(false);
  }
}
