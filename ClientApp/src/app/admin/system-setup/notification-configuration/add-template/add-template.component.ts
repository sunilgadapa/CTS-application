import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsermanagmentService } from '../../../../_services/userManagement/usermanagment.service';
import { NotificationconfigurationService } from '../../../../_services/admin/notificationconfiguration.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { ValidationsetupService } from 'src/app/_services/common/validationsetup.service';
@Component({
  selector: 'app-add-template',
  templateUrl: './add-template.component.html',
  styleUrls: ['./add-template.component.css']
})
export class AddTemplateComponent {
  templateType = "";
  from = "CTSadmin@OldMutual.com";
  subject = "";
  msgBody = "";
  effective_date: any = "";
  addtemplateRequestData = {
    NotificationTypeId: 0,
    EventId: 0,
    NotificationTemplate: "",
    EffectiveDate: ""
  }
  header = "Add a New Template";
  selectedIndex: number;
  allTemplates: any[] = [];
  dateType = "Effective Date: "
  isInActive = false;
  isInActivePrevious = true;
  dateCheckOut: any;
  today: any;
  temp:any[]=[]
  isSaveTemplateEnabled:boolean=true;
  datePlaceholder: any;
  constructor(private datePipe: DatePipe,
     private dialogRef: MatDialogRef<AddTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
      private userManagementService: UsermanagmentService,
      private notificationsService: NotificationconfigurationService,
      private toastr: ToastrService,
      public validation: ValidationsetupService) {
    this.datePlaceholder = this.validation.validationsArray.dateMetaData.datePlaceholder;
    this.templateType = data.templateTpe[0].lookup_value_name;
    this.addtemplateRequestData.EventId = data.eventId;
    this.addtemplateRequestData.NotificationTypeId = data.templateTpe[0].lookup_value_id;
    this.selectedIndex = -1;
    this.temp = data.allTemplates   
    if(this.temp.length==0){
      this.isInActive = true;
    }
    else{
      for (let k = 0; k < this.temp.length; k++) {
        {
          this.dateCheckOut = this.datePipe.transform(this.temp[k].ExpiryDate, "yyyy-MM-dd");
          this.today = this.datePipe.transform(new Date(), "yyyy-MM-dd");
          if (this.dateCheckOut > this.today) {
            this.allTemplates.push(this.temp[k])
          }
        }
      }
    }    
  }
  /*  
    * This is the ngOnInit function  
    * ngOnInit() is used to get all required data on page load event
  */
  onNoClick() {
    this.dialogRef.close();
  }
  /*  
    * This is the validate function  
    * validate() is used to enable/disable the save button based on the message body length
  */
  validate(){
    if(this.msgBody.length>0){
      this.isSaveTemplateEnabled=false;
    }
    else{
      this.isSaveTemplateEnabled=true;
    }    
  }
  /*  
    * This is the checkResponse function     
    * checkResponse() is used to check the response returned by more than one function
  */
  checkResponse(data:any){
    let response = data;
    if (response.Statuscode == 200) {
      this.toastr.success(response.Message);
      this.dialogRef.close(true);
    } else {
      setTimeout(() => {
        this.toastr.error(response.Message);
      }, 500);        
    }
  }
  /*  
    * This is the saveTemplate function     
    * saveTemplate() is used to make API CALL to save the template
  */
  saveTemplate() {
    if (this.effective_date != "") {
      this.addtemplateRequestData.EffectiveDate = this.effective_date;
      if (this.templateType != "Email") {
        if (this.msgBody != " ") {
          this.addtemplateRequestData.NotificationTemplate = "MessageBody:" + this.msgBody;
          this.notificationsService.saveTemplate(this.addtemplateRequestData).subscribe(data => {
            //Make HTTP call to post API call
           this.checkResponse(data)
          })
        }
        else {
          setTimeout(() => {
            this.toastr.error("Please enter template body")
          }, 500);           
        }
      }
      else {
        if (this.msgBody != "" && this.from != "" && this.subject != "") {
          this.addtemplateRequestData.NotificationTemplate = "From:" + this.from + " Subject:" + this.subject + " MessageBody:" + this.msgBody;
          this.notificationsService.saveTemplate(this.addtemplateRequestData).subscribe(data => {
            this.checkResponse(data)
          })
        }
        else {
          setTimeout(() => {
            this.toastr.error("Please enter the template body")
          }, 500);            
        }
      }
    } else {
      setTimeout(() => {
        this.toastr.error("Please select an effective date")
      }, 500);      
    }
  }
  /*  
    * This is the pageNavigation function     
    * pageNavigation() is used enable and disable the next and previous buttons based on current page number
  */
  pageNavigation(selectedIndex: number) {    
    if (selectedIndex === this.allTemplates.length - 1) {
      this.isInActive = true;
    }
    else {
      this.isInActive = false;
    }
    if (selectedIndex == -1) {
      this.isInActivePrevious = true;
    }
    else {
      this.isInActivePrevious = false;
    }
    if (selectedIndex > -1 && selectedIndex < this.allTemplates.length) {
      this.isInActivePrevious = false;
      this.header = "Template"
      this.dateType = "Expiry Date: "
      this.effective_date = this.datePipe.transform(this.allTemplates[selectedIndex].ExpiryDate, "yyyy-MM-dd")
      let messageBody = this.allTemplates[selectedIndex].NotificationTemplate.split("MessageBody:")
      this.msgBody = messageBody[1]
      if (this.templateType == 'Email') {
        let from = messageBody[0].split("Subject:");
        let tempalteSubject = from[0].split("From:");
        this.from = tempalteSubject[1]
        this.subject = from[1]
      }
    }
    else {
      this.header = "Add a New Template";
      this.dateType = "Effective Date: "
      this.effective_date = "";
      this.msgBody = ""
      this.from = ""
      this.subject = ""
    }
  }
  /*  
    * This is the next function     
    * next() is used navigate to next template
  */
  next() {
      ++this.selectedIndex;
      this.pageNavigation(this.selectedIndex) 
  }
  /*  
    * This is the previous function     
    * previous() is used navigate to previous template
  */
  previous() {
    --this.selectedIndex;
    this.pageNavigation(this.selectedIndex)
  }
}
