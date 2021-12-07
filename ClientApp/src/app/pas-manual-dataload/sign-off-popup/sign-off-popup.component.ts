import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-sign-off-popup',
  templateUrl: './sign-off-popup.component.html',
  styleUrls: ['./sign-off-popup.component.css']
})
export class SignOffPopupComponent {

  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
  private dialogRef: MatDialogRef<SignOffPopupComponent>) { }

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }
  onCloseClick(): void {
    this.dialogRef.close(false);
  }
}
