import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-process-file-popup',
  templateUrl: './process-file-popup.component.html',
  styleUrls: ['./process-file-popup.component.css']
})
export class ProcessFilePopupComponent implements OnInit {
  myDate = new Date();
  currentDate: any;
  currentTime: any;
  message: string;
  text: string;

  constructor(private datePipe: DatePipe,
    private dialogRef: MatDialogRef<ProcessFilePopupComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,) {
    this.currentDate = this.datePipe.transform(this.myDate, 'yyyy/MM/dd');
    this.currentTime = this.datePipe.transform(this.myDate, 'dd/MM/yyyy HH:mm:ss');
    this.text = data.text;
  }
  ngOnInit(): void {
    var time = this.currentTime.split(' ')
    this.message = `File ${this.text} Started (${this.currentDate} @ ${time[1]})`
  }
  okprocessfile() {
    this.dialogRef.close(true);
  }

}
