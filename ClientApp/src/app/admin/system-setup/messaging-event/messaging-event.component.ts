import { Component, OnInit,  Inject,  Output, EventEmitter, TemplateRef,Injector } from "@angular/core";
import { FormGroup, FormBuilder, Validators,  FormControl } from '@angular/forms';
import { MatDialog,  MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsermanagmentService } from "../../../_services/userManagement/usermanagment.service";
import { AdminSystemsetupService } from '../../../_services/admin/adminsystemsetup.service';
import { LookupData, MessageData } from "../../../_models/LookupData";
import { UserData } from '../../../_models/userData';
import { MessageEvent } from '../../../_models/user';
import { Router } from '@angular/router';
import { Subscriber } from "rxjs";
import { ToastrService } from 'ngx-toastr';
import { SelectionModel } from "@angular/cdk/collections";
import { TableData } from "src/app/_models/tableData";
import { MatTableDataSource } from "@angular/material/table";
import { ValidationsetupService } from "../../../_services/common/validationsetup.service";
import { ConfirmPopupComponent } from "src/app/common/confirm-popup/confirm-popup.component";

@Component({
  selector: 'app-messaging-event',
  templateUrl: './messaging-event.component.html',
  styleUrls: ['./messaging-event.component.css']
})
export class MessagingEventComponent implements  OnInit {

  constructor( public dialog: MatDialog, private userManagementService: UsermanagmentService,
    private toastr: ToastrService, public adminsystemsetupservice: AdminSystemsetupService,
   ) { }
  
  public loadingTemplate: TemplateRef<any>;
  public loading = false;
  state: string = 'default';  
  dialogRef: MatDialogRef<AddMessagingDialog> | null;
  dataSource = new MatTableDataSource<any>(undefined);
  p: any;      
  lookup: LookupData;
  newMessageData = {
    lookup_value_id: 0,
    tax_module_id: 5,
    Page: 1,
    Size: 7,
    SearchText: ""
  }
  intmessage: MessageEvent;
  isInvalid: boolean;
  labelError: string;
  Success: any;
  successMessage: any;
  userName: any[] = [];
  UserIds: any[] = [];
  subscription = new Subscriber();
  statusddl: boolean = false;
  statusddl1: boolean = false;
  statusddl2: boolean = false;
  statusddl3: boolean = false;  
  Tax_modules: any;
  totalSelectedRowdata = 0;
  newItem: any[] = [];
  GetMessagDataData: any[] = [];
  sendtaxsystem = "";
  isSavechangesSelect: boolean;
  editFlag = 1;
  isSelectedAddEvent: boolean;
  isSelectedSaveChange: boolean;
  isEditAddEvent: boolean;
  pageIndex = 0;
  size = 7;
  messageTaxdrop: any;
  selection = new SelectionModel<any[]>(true, []);

  @Output() dropdownEvent = new EventEmitter<any>();
  totalRowdata = 0;
  tableData: any[] = [];
  columns = [
    { columnDef: 'status_flag', header: 'Active', cell: (element: any) => `${element.status_flag}` },
    { columnDef: 'messaging_event', header: 'Messaging Event', cell: (element: any) => `${element.messaging_event}` },
    { columnDef: 'messaging_event_description', header: 'Messaging Event Type', cell: (element: any) => `${element.message_event_type}` },
    { columnDef: 'editmessage', header: 'Amend', cell: (element: any) => `${element.edit}` },
  ];
  columnsToDisplay = this.columns.map(c => c.columnDef);
   /*  
.......................................................................................................
* This is the ngOnInit function 

* ngOnInit() used to initalising form and validation
.......................................................................................................
*/
  ngOnInit(): void {
    
    this.messageTaxdrop = localStorage.getItem('MessageTaxName');
 
    this.getTaxModuleData();
    this.GetMessageEventData();
    this.subscription.add(this.adminsystemsetupservice.CTSEvents.subscribe(x => {
      this.lookup = x;
    }));

    this.adminsystemsetupservice.editdmessage.subscribe(x => {

      this.lookup = x;
      if (this.editFlag == 1) {
        this.editFlag = 0;
        this.openDialog();
      }
    });
  }
    /*  
.......................................................................................................
* This is the dropselected function 

* dropselected() used to drop selected
.......................................................................................................
*/
  dropselected(event: any, row: any) {
    this.dropdownEvent.emit(row);
  }
      /*  
.......................................................................................................
* This is the SelectCurrentPage function 

* SelectCurrentPage() used to drop select current page
.......................................................................................................
*/
  SelectCurrentPage(event: any) {
    this.pageIndex = event;
    this.newMessageData.Page = this.pageIndex

    this.selection = new SelectionModel<any>(true, [])
    this.GetMessageEventData()

  }
      /*  
.......................................................................................................
* This is the toggleArrow1 function 

* toggleArrow1() used to toggle arrow
.......................................................................................................
*/
  toggleArrow1() {
    this.statusddl1 = this.statusddl1 === true ? false : true;
  }
       /*  
.......................................................................................................
* This is the AddSourcePop function 

* AddSourcePop() used to add source
.......................................................................................................
*/
  AddSourcePop() {
    if (this.newMessageData.lookup_value_id > 0) {
      this.dialogRef = this.dialog.open(AddMessagingDialog, {
        data: {
          taxdata: this.newMessageData.lookup_value_id
        }, width: '35%'
      });
      this.dialogRef.afterClosed().subscribe(result => {
        this.GetMessageEventData()
      });
    } else {
      setTimeout(() => {
        this.toastr.error("Select Tax Type");
      }, 500);
     
    }
  }
/*  
.......................................................................................................
* This is the openDialog function 

* openDialog() used to open dialog
.......................................................................................................
*/
  openDialog() {
    this.isEditAddEvent = true;
    if (this.newMessageData.lookup_value_id > 0) {
      if(this.dialog.openDialogs.length==0){
      const dialogRef = this.dialog.open(AddMessagingDialog, {
        data: {
          isUpdate: "edit",
          taxdata: this.newMessageData.lookup_value_id,
          message: "Error!!!",
          lookup: this.lookup,
        }, width: '35%'
      });
      dialogRef.afterClosed().subscribe(result => {
        this.GetMessageEventData()
        this.editFlag = 1;
      });
    }
    } else {
      setTimeout(() => {
        this.toastr.error("Select Tax Type to Amend");
      }, 500);
   
    }
  }
/*  
.......................................................................................................
* This is the getTaxModuleData function 

* getTaxModuleData() used to get tax module data
.......................................................................................................
*/
  getTaxModuleData() {
    this.loading = true;
    this.userManagementService.getLookupdata('Tax Module').subscribe((response: any) => {
      this.Tax_modules = response;
      this.loading = false;
      this.Tax_modules = this.Tax_modules.filter(
        (data: any) => data.status_flag === true);
      if (this.messageTaxdrop != undefined) {
        this.newMessageData.lookup_value_id = parseInt(this.messageTaxdrop);
        this.GetMessageEventData();
      }
    }, (error) => {
      this.loading = false;
      setTimeout(() => {
        this.toastr.error('Something went wrong')
      }, 500);         
    })
  }
  /*  
.......................................................................................................
* This is the  SelectcheckBoxChnage function 

* SelectcheckBoxChnage() used to set check box 
.......................................................................................................
*/
  SelectcheckBoxChnage(selection: SelectionModel<TableData>) {
    this.newItem = [];
    this.newItem = selection.selected
    this.userName = [];
    this.UserIds = [];
    for (let user of this.newItem) {
      this.userName.push(user.UserName);
      this.UserIds.push(user.messaging_event_id);
    }
    if (this.userName.length > 0 || this.totalSelectedRowdata>0) {
      this.isSelectedSaveChange = true;
    }
    else {
      this.isSelectedSaveChange = false;
    }
  }
   /*  
.......................................................................................................
* This is the  SaveMessagingEvent function 

* SaveMessagingEvent() used to save message event
.......................................................................................................
*/
  SaveMessagingEvent() {

    const dialogRef = this.dialog.open(ConfirmPopupComponent, {
     
      width: '40%',
     
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
    const taxId = this.newMessageData.lookup_value_id;
    this.lookup.ids = this.UserIds;
    this.lookup.tax_module_id = taxId;
    this.lookup.Page = this.newMessageData.Page;
    this.lookup.Size = this.size;
    this.lookup.totalselectedrows = this.totalSelectedRowdata;
    //HTTP API Call
    this.adminsystemsetupservice.PostMessagingEvent(this.lookup).subscribe(
      (response) => {
        if (response.Statuscode === 200) {
          this.Success = true;
          this.toastr.success(response.Message);
          this.isSelectedSaveChange = false;
          setTimeout(() => {
            this.Success = false;
            this.successMessage = '';
          }, 1500);
        }
      },
      (error) => {
        this.isInvalid = true;
        this.labelError = error.error.Message;
      }
    );
      }else
      {
        this.isSelectedSaveChange = false;
        this.ngOnInit();
      }
    })

  }

/*  
.......................................................................................................
* This is the GetMessageEventData function 

* GetMessageEventData() used to get message data
.......................................................................................................
*/
  GetMessageEventData() {
    this.loading = true;
    this.newMessageData.tax_module_id = this.newMessageData.lookup_value_id;
    this.newMessageData.Size = 7;
    this.newMessageData.SearchText = "";
    this.adminsystemsetupservice.GetMessageDataById(this.newMessageData).subscribe(miscellanoudata => {
      let response = miscellanoudata;
      if (response.Statuscode == 200) {
        localStorage.setItem('MessageTaxName', this.newMessageData.tax_module_id.toString());
        this.tableData = miscellanoudata.data;
        this.totalRowdata = this.tableData[0].totalrows
        this.totalSelectedRowdata = this.tableData[0].totalselectedrows
        this.loading = false;
      }
      else {
        this.tableData = [];
      }
    }, (error) => {
      this.loading = false;
      this.tableData = [];
    });
  }

}

@Component({
  selector: 'demo-jazz-dialog',
  templateUrl: './addmessageEvent.html',
  styleUrls: ['./messaging-event.component.css']
})
export class AddMessagingDialog {
  public loadingTemplate: TemplateRef<any>;
  public loading = false;
  hide = true;
  model: any = {};
  IsErrorVisible: boolean = true;
  public showPasswordOnPress: boolean = false;
  MessagingForm: FormGroup;
  submitted = false;
  userData: UserData;
  lookup: LookupData;
  isInvalid: boolean;
  labelError: string;
  messaging: MessageData;
  Success: any;
  tax_iddata: any
  successMessage: any;
  intmessage: MessageEvent;
  Tax_modules: any[] = [];
  GetMessagDataData: any[] = [];
  isUpdatebtn: boolean = false;
  textChanged: boolean = false; 
  private toastr: ToastrService;
  public validation: ValidationsetupService;
  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<AddMessagingDialog>,  private injector : Injector,
    public adminsystemsetupservice: AdminSystemsetupService, private userManagementService: UsermanagmentService,
    public router: Router, @Inject(MAT_DIALOG_DATA) private data: any, ) {
      this.validation = injector.get<ValidationsetupService>(ValidationsetupService);
      this.toastr = injector.get<ToastrService>(ToastrService);
    if (data) {
      if (data.isUpdate == 'edit') {
        this.isUpdatebtn = true;
        this.messaging = data.lookup.row;
      }
      this.tax_iddata = data.taxdata;
    this.textChanged=false;
    }
  }

   /*  
.......................................................................................................
* This is the ngOnInit function 

* ngOnInit() used to initalising form and validation
.......................................................................................................
*/

  ngOnInit() {
    this.getTaxModuleData()
    this.MessagingForm = this.formBuilder.group({
      messaging_event: new FormControl('',

        [
          Validators.required,
          Validators.pattern(this.validation.validationsArray.messagingEvent.addMessagingEvent.messagingEventName.pattern),
          Validators.minLength(this.validation.validationsArray.messagingEvent.addMessagingEvent.messagingEventName.minLength),
          Validators.maxLength(this.validation.validationsArray.messagingEvent.addMessagingEvent.messagingEventName.maxLength)
        ]

      ),
      message_event_type: new FormControl('',
        [
          Validators.required,
          Validators.pattern(this.validation.validationsArray.messagingEvent.addMessagingEvent.messagingEventType.pattern),
          Validators.minLength(this.validation.validationsArray.messagingEvent.addMessagingEvent.messagingEventType.minLength),
          Validators.maxLength(this.validation.validationsArray.messagingEvent.addMessagingEvent.messagingEventType.maxLength)
        ]

      ),
      messaging_event_description: new FormControl('',
        [

          Validators.pattern(this.validation.validationsArray.messagingEvent.addMessagingEvent.messagingEventDescription.pattern),
          Validators.minLength(this.validation.validationsArray.messagingEvent.addMessagingEvent.messagingEventDescription.minLength),
          Validators.maxLength(this.validation.validationsArray.messagingEvent.addMessagingEvent.messagingEventDescription.maxLength)
        ]
      )
    });
    this.MessagingForm.controls.messaging_event.setValue(this.messaging.messaging_event);
    this.MessagingForm.controls.message_event_type.setValue(this.messaging.message_event_type);
    this.MessagingForm.controls.messaging_event_description.setValue(this.messaging.messaging_event_description);
    this.MessagingForm.valueChanges.subscribe(() => {
      this.textChanged= true;
    })
  }

 /*  
.......................................................................................................
* This is the f function 

* f() used to set form status
.......................................................................................................
*/
  get f() {
    return this.MessagingForm.controls;
  }
  /*  
.......................................................................................................
* This is the getTaxModuleData function 

* getTaxModuleData() used to get tax module data
.......................................................................................................
*/
  getTaxModuleData() {
    this.userManagementService.getLookupdata('Tax Module').subscribe((response: any) => {
      this.Tax_modules = response;
      this.Tax_modules = this.Tax_modules.filter(
        (data: any) => data.status_flag === true);
    })
  }
/*  
.......................................................................................................
* This is the AddMessageEvent function 

* AddMessageEvent() used to add message event
.......................................................................................................
*/
  AddMessageEvent() {
    this.loading = true;
    this.submitted = true;
    this.messaging = this.messaging ? this.messaging : this.MessagingForm.value;
    if (this.MessagingForm.invalid) {
      this.isInvalid = true;
    } else {
      this.messaging.messaging_event_id = (this.messaging.messaging_event_id?.toString() == undefined) ? 0 : this.messaging.messaging_event_id;
      this.messaging.tax_module_id = this.tax_iddata;
      this.messaging.messaging_event = this.MessagingForm.get('messaging_event')?.value;
      this.messaging.message_event_type = this.MessagingForm.get('message_event_type')?.value;
      this.messaging.messaging_event_description = this.MessagingForm.get('messaging_event_description')?.value;
      this.adminsystemsetupservice.AddMessagingEvent(this.messaging).subscribe(
        (response) => {
          if (response.Statuscode === 200) {
            this.Success = true;
            this.loading = false;
            this.toastr.success(response.Message)
            setTimeout(() => {
              this.Success = false;
              this.successMessage = '';
              this.onNoClick();
            }, 500);
          }
        },
        (error) => {
          this.loading = false;
          this.isInvalid = true;
          this.labelError = error.error.Message;
        }
      );
    }
  }
  /*  
.......................................................................................................
* This is the onNoClick function 

* onNoClick() used to close dialog
.......................................................................................................
*/
  onNoClick() {
    this.dialogRef.close();
  }
}
