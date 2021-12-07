import { DatePipe } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-promote-file-popup',
  templateUrl: './promote-file-popup.component.html',
  styleUrls: ['./promote-file-popup.component.css']
})
export class PromoteFilePopupComponent implements OnInit {
  myDate = new Date();
  currentDate : any;
  currentTime:any;
  message:string;
  promoteType: string;
 
  constructor(private datePipe: DatePipe,private dialogRef: MatDialogRef<PromoteFilePopupComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,) {
      if (data) {
        this.promoteType = data.type;
      }
    this.currentDate = this.datePipe.transform(this.myDate, 'yyyy/MM/dd');
    this.currentTime = this.datePipe.transform(this.myDate, 'dd/MM/yyyy HH:mm:ss');
  }
   /*  
......................................................................................................
* This is the ngOnInit function

* ngOnInit is used to initialisation purpose
.......................................................................................................
*/
  ngOnInit(): void {
    var time=this.currentTime.split(' ')
    this.message=  `${this.promoteType} Process Started (${this.currentDate} @ ${time[1]})`
  }
   /*  
......................................................................................................
* This is the okprocessfile function

* okprocessfile is used to trigeer event after ok button pressed 
.......................................................................................................
*/
  okprocessfile(){
    this.dialogRef.close(true);
  }

}
