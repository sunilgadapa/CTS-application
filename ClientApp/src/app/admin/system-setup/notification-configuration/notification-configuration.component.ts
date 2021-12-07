import { Component, OnInit, HostBinding, TemplateRef } from "@angular/core";
import { DialogPosition, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource, } from "@angular/material/table";
import { AssignRoleComponent } from "./assign-role/assign-role.component";
import { AddTemplateComponent } from "./add-template/add-template.component";
import { UsermanagmentService } from "../../../_services/userManagement/usermanagment.service";
import { NotificationconfigurationService } from "../../../_services/admin/notificationconfiguration.service";
import { ToastrService } from 'ngx-toastr';
import { SelectionModel } from "@angular/cdk/collections";
import { ConfirmPopupComponent } from "src/app/common/confirm-popup/confirm-popup.component";
@Component({
  selector: 'app-notification-configuration',
  templateUrl: './notification-configuration.component.html',
  styleUrls: ['./notification-configuration.component.css']
})
export class NotificationConfigurationComponent implements OnInit {
  public loadingTemplate: TemplateRef<any>;
  public loading = false;
  @HostBinding('@.disabled')
  dialogRef: MatDialogRef<AssignRoleComponent> | null;
  dialogRef1: MatDialogRef<AddTemplateComponent> | null;
  dataSource = new MatTableDataSource<any>(undefined);
  dataSource2 = new MatTableDataSource<any>(undefined);
  selection = new SelectionModel<any[]>(true, []);
  selection2 = new SelectionModel<any[]>(true, []);
  selectionUser = new SelectionModel<any>(true, []);
  selectionRole = new SelectionModel<any>(true, []);
  exp = true;
  totalSelectedRowdata = 0;
  newItem: any[] = [];
  userName: any[] = [];
  userRoles: any[] = [];
  statusddl: boolean = false;
  eventddl: boolean = false;
  templateDDl: boolean = false;
  isSelectedSaveChange: boolean;
  isSelectedSaveChange2: boolean;
  isRolePaging = false;
  public directionLinks: boolean = true;
  public roleLabels: any = {
    previousLabel: "",
    nextLabel: ""
  };
  public userLabels: any = {
    previousLabel: "",
    nextLabel: ""
  };
  getTemplateRequestData = {
    NotificationTypeId: 0,
    EventId: 0
  }
  selectedradio = "1"
  size = 7;
  pageIndex = 0;
  totalUserPages: number;
  totalRolePages: number;
  currentPage: number = 1;
  p: any;
  selectedType = 0;
  rows: any[] = [];
  taxModules: any[] = [];
  notificationTypes: any[] = [];
  taxData = {
    tax_id: 0
  }
  eventData: any[] = [];
  isTaxSelected = false;
  getUsers = {
    SearchBy: "",
    TaxIds: 0,
    EventIds: 0
  }
  taxId = 0;
  eventId: number = 0;
  templateFrom: any[] = [];
  tempalteSubject = "";
  templateBody = "";
  tableData: any[] = [];
  tableData2: any[] = [];
  columns = [
    { columnDef: 'StatusFlag', header: 'Active', cell: (element: any) => `${element.StatusFlag}` },
    { columnDef: 'Roles', header: 'Role', cell: (element: any) => `${element.Roles}` },
    { columnDef: 'strUserNames', header: 'User Name', cell: (element: any) => `${element.strUserNames}` },
  ];
  columnsToDisplay = this.columns.map(c => c.columnDef);
  columns2 = [
    { columnDef: 'StatusFlag', header: 'Active', cell: (element: any) => `${element.StatusFlag}` },
    { columnDef: 'UserId', header: 'User ID', cell: (element: any) => `${element.UserId}` },
    { columnDef: 'UserNames', header: 'User Name', cell: (element: any) => `${element.UserNames}` },
  ];
  columnsToDisplay2 = this.columns2.map(c => c.columnDef);
  templateType: any[] = [];
  templateTypeName = ""
  allTemplates: any[] = [];
  disableNotificationTypes = true;
  constructor(public dialog: MatDialog, private userManagementService: UsermanagmentService,
    private notificationConfigService: NotificationconfigurationService, private toastr: ToastrService) {
  }
  /*  
    * This is the ngOnInit function  
    * ngOnInit() is used to get all required data on page load event
  */
  ngOnInit(): void {
    this.getNotificationType()
    this.getTaxModuleData()
    if (localStorage.getItem('notificationDDL')) {
      let data = JSON.parse(localStorage.getItem('notificationDDL') || '{}')
      this.eventId = data.notificationEventDDL;
      this.taxData.tax_id = data.notificationTaxTypeDDL;
      this.taxId = data.notificationTaxTypeDDL;
      this.userManagementService.getLookupdata('Notification Type').subscribe((response: any) => {
        this.notificationTypes = response;
        this.notificationTypes = this.notificationTypes.filter(
          (data1: any) => data1.status_flag === true);
        const filteredTypes = this.notificationTypes.filter(x =>
          x.lookup_value_name == 'Dashboard'
        );
        this.selectedType = filteredTypes[0].lookup_value_id
        this.getTableData()
      })
      this.getMessagingEventData();
      this.isTaxSelected = true;
    }
  }
  /*  
    * This is the selectRow function    
    * @param event This is the checkbox selection event parameter
    * @param row This is the selected row parameter 
    * selectRow() is used to synchronize all button's visibility based on the row selction
  */
  selectRow(event: any, row: any) {
    this.userName = [];
    this.userName = row.StatusFlag;
    this.userRoles = row.UserNames;
    if (this.userName.length > 0) {
      this.isSelectedSaveChange = true;
    }
    else {
      this.isSelectedSaveChange = false;
    }
  }
  /*  
    * This is the paginate function
    * @param event This is the page number parameter
    * paginate is used to retrieve table records by page number
  */
  paginate(event: any) {
    this.pageIndex = event;
    this.currentPage = event;
    this.dataSource = new MatTableDataSource<any>(
      this.tableData.slice(event * this.size - this.size, event * this.size)
    );
    this.rearrangeRolePaging();
  }
  /*  
    * This is the paginate1 function
    * @param event This is the page number parameter
    * paginate1 is used to retrieve table records by page number
  */
  paginate1(event: any) {
    this.pageIndex = event;
    this.currentPage = event;
    this.dataSource2 = new MatTableDataSource<any>(
      this.tableData2.slice(event * this.size - this.size, event * this.size)
    );
    this.rearrangeUserPaging();
  }
  /*  
    * This is the rearrangeRolePaging function  
    * rearrangeRolePaging() is used to set prev and next button based on current page number 
  */
  rearrangeRolePaging() {
    if (this.currentPage == 1) {
      this.roleLabels.previousLabel = "";
    }
    else {
      this.roleLabels.previousLabel = "< Prev";
    }
    if (this.currentPage == this.totalRolePages) {
      this.roleLabels.nextLabel = "";
    }
    else {
      this.roleLabels.nextLabel = "Next >";
    }
  }
  /*  
    * This is the rearrangeUserPaging function  
    * rearrangeUserPaging() is used to set prev and next button based on current page number 
  */
  rearrangeUserPaging() {
    if (this.currentPage == 1) {
      this.userLabels.previousLabel = "";
    }
    else {
      this.userLabels.previousLabel = "< Prev";
    }
    if (this.currentPage == this.totalUserPages) {
      this.userLabels.nextLabel = "";
    }
    else {
      this.userLabels.nextLabel = "Next >";
    }
  }
  /*  
    * This is the openAssignRole function  
    * openAssignRole() is used to open popup to assign role for notification for specific tax type and event
  */
  openAssignRole() {
    if (this.eventId > 0) {
      this.dialogRef = this.dialog.open(AssignRoleComponent, {
        data: {
          selectedAction: this.selectedradio,
          eventId: this.eventId
        }, width: '40%',
      });
      this.dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.getTableData();
        }
      });
    } else {
      setTimeout(() => {
        this.toastr.error("Please select tax type and event")
      }, 500);
    }
  }
  /*  
    * This is the openAddTemplate function  
    * openAddTemplate() is used to open popup to add template for selected tax type, event and notification type
  */
  openAddTemplate() {
    if (this.eventId > 0) {
      const dialogPosition: DialogPosition = {
        right: '55%'
      };
      this.dialogRef1 = this.dialog.open(AddTemplateComponent, {
        data: {
          selectedAction: this.selectedradio,
          eventId: this.eventId,
          templateTpe: this.notificationTypes.filter(t => t.lookup_value_id == this.selectedType),
          allTemplates: this.allTemplates.filter((t: any) => !t.Status)
        },
        position: dialogPosition,
        width: '60%', height: '95%'
      });
      this.dialogRef1.afterClosed().subscribe(a => {
        this.getTemplate()
      });
    } else {
      setTimeout(() => {
        this.toastr.error("Please select tax type and event")
      }, 500);
    }
  }
  /* 
      * This is the toggleArrowTaxtype function  
      * toggleArrowTaxtype() is used to animate the tax type dropdown list arrow
  */
  toggleArrowTaxtype() {
    this.statusddl = this.statusddl === true ? false : true;
  }
  /* 
      * This is the toggleArrowEvent function  
      * toggleArrowEvent() is used to animate the messaging event dropdown list arrow
  */
  toggleArrowEvent() {
    this.eventddl = this.eventddl === true ? false : true;
  }
  /* 
      * This is the toggleArrowTemplate function  
      * toggleArrowTemplate() is used to animate the notification type dropdown list arrow
  */
  toggleArrowTemplate() {
    this.templateDDl = this.templateDDl === true ? false : true;
  }
  /*  
    * This is the selectTaxModules function 
    * @param event This is the checkbox selection event parameter    
    * selectTaxModules() is used to push selected tax modules in an array for further operations
  */
  selectTaxModules(event: any) {
    this.eventId = 0
    this.taxData.tax_id = event.value
    if (this.taxData.tax_id) {
      this.getMessagingEventData();
      this.isTaxSelected = true;
    }
  }
  /*  
    * This is the getTaxModuleData function     
    * getTaxModuleData() is used to make API CALL to get tax modules in tax type drop down list
  */
  getTaxModuleData() {
    this.loading = true;
    this.notificationConfigService.getEventAssociatedTaxData().subscribe((response: any) => {
      //Make HTTP call to get API call
      this.taxModules = response.data;
      this.loading = false;
    }, (error) => {
      this.loading = false;
      setTimeout(() => {
        this.toastr.error('Something went wrong')
      }, 500);
    })
  }
  /*  
    * This is the getNotificationType function     
    * getNotificationType() is used to make API CALL to get notification types in notification type drop down list
  */
  getNotificationType() {
    this.userManagementService.getLookupdata('Notification Type').subscribe((response: any) => {
      //Make HTTP call to get API call
      this.notificationTypes = response;
      this.notificationTypes = this.notificationTypes.filter(
        (data: any) => data.status_flag === true);
      const filteredTypes = this.notificationTypes.filter(x =>
        x.lookup_value_name == 'Dashboard'
      );
      this.selectedType = filteredTypes[0].lookup_value_id
    })
  }
  /*  
    * This is the getMessagingEventData function     
    * getMessagingEventData() is used to make API CALL to get messaging event in event type drop down list
  */
  getMessagingEventData() {
    this.notificationConfigService.getEvents(this.taxData).subscribe((response: any) => {
      //Make HTTP call to post API call
      this.eventData = response.data;
      this.eventData = this.eventData.filter(
        (data: any) => data.status_flag === true);
    })
  }
  /*  
    * This is the getTableData function     
    * getTableData() is used to make API CALL to get roles and users specific tax type and event type
  */
  getTableData() {
    this.tableData = []
    this.dataSource = new MatTableDataSource<any>(
    );
    this.tableData2 = []
    this.dataSource2 = new MatTableDataSource<any>(
    );
    this.allTemplates = []
    this.loading = true;
    let data = {
      notificationTaxTypeDDL: this.taxData.tax_id,
      notificationEventDDL: this.eventId
    }
    if (this.eventId > 0 && this.taxData.tax_id > 0) {
      localStorage.setItem('notificationDDL', JSON.stringify(data));
      this.getUsers.EventIds = this.eventId
      this.getUsers.TaxIds = this.taxData.tax_id
      this.getUsers.SearchBy = "role"
      this.notificationConfigService.getUserData(this.getUsers).subscribe((response: any) => {
        //Make HTTP call to post API call
        this.tableData = response.data;
        this.dataSource = new MatTableDataSource<any>(
          this.tableData.slice(0, this.size)
        );
        this.selection = new SelectionModel<any>(true, this.tableData.filter(t => t.StatusFlag == 1));
        this.totalRolePages = this.tableData.length / this.size;
        this.totalRolePages = Math.ceil(this.totalRolePages);
        this.rearrangeRolePaging();
        this.loading = false;
      }, (error) => {
        this.loading = false;
        this.setTimeoutForErrorMessage();
      })
      this.getUsers.SearchBy = "user"
      this.notificationConfigService.getUserData(this.getUsers).subscribe((response: any) => {
        //Make HTTP call to post API call
        this.tableData2 = response.data;
        this.dataSource2 = new MatTableDataSource<any>(
          this.tableData2.slice(0, this.size)
        );
        this.selection2 = new SelectionModel<any>(true, this.tableData2.filter(t => t.StatusFlag == "True"));
        this.totalUserPages = this.tableData2.length / this.size;
        this.totalUserPages = Math.ceil(this.totalUserPages);
        this.rearrangeUserPaging();
        this.loading = false;
      }, (error) => {
        this.setTimeoutForErrorMessage();
      })
      this.getTemplate();
      this.disableNotificationTypes = false;
    } else {
      this.loading = false;
      setTimeout(() => {
        this.toastr.error("Please select tax type and event")
      }, 500);
    }
  }
  private setTimeoutForErrorMessage() {
    this.loading = false;
    setTimeout(() => {
      this.toastr.error('Something went wrong');
    }, 500);
  }
  /*  
    * This is the getTemplate function     
    * getTemplate() is used to make API CALL to notification template specific tax type, event type and notification type
  */
  getTemplate() {
    this.loading = true;
    this.allTemplates = [];
    this.getTemplateRequestData.NotificationTypeId = this.selectedType;
    this.getTemplateRequestData.EventId = this.eventId;
    this.notificationConfigService.getTemplate(this.getTemplateRequestData).subscribe(data => {
      //Make HTTP call to post API call
      if (data.Statuscode == 200) {
        this.allTemplates = data.data;
        let response = data.data;
        let response2 = response.filter((t: any) => t.Status)[0].NotificationTemplate.split("MessageBody:");
        this.templateBody = response2;
        let from = response2[0].split("Subject:");
        this.tempalteSubject = from[0].split("From:");
        let sub = response2[0].split("MessageBody:");
        let sub2 = sub[0].split("Subject:");
        this.templateFrom = sub2
      }
      this.loading = false;
    }, (error) => {
      this.loading = false;
      this.allTemplates = [];
      this.templateBody = '';
      this.tempalteSubject = '';
      this.templateFrom = []
    })
  }
  /*  
    * This is the saveChanges function     
    * saveChanges() is used to make API CALL to save final changes
  */
  saveChanges() {
    const dialogRef = this.dialog.open(ConfirmPopupComponent, {
      width: '40%',
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.loading = true;
        let selectedRoleRows: any[] = [];
        for (let item of this.selection.selected) {
          selectedRoleRows.push(item);
        }
        let selectedRoleIds: number[] = [];
        for (let item of selectedRoleRows) {
          selectedRoleIds.push(parseInt(item.RoleIds));
        }
        let selectedUserRows: any[] = [];
        for (let item of this.selection2.selected) {
          selectedUserRows.push(item);
        }
        let selectedUserIds: any[] = [];
        for (let item of selectedUserRows) {
          selectedUserIds.push(item.Id);
        }
        let dataToSave = {
          RoleArray: selectedRoleIds,
          EventIds: this.eventId,
          Ids: selectedUserIds
        }
        this.notificationConfigService.saveNotificationChanges(dataToSave).subscribe(response => {
          //Make HTTP call to post API call
          this.getTableData();
          this.isSelectedSaveChange = false;
          this.loading = false;
        }, (error) => {
          this.loading = false;
          setTimeout(() => {
            this.toastr.error('Something went wrong')
          }, 459);
        });
      } else {
        this.isSelectedSaveChange = false;
        this.ngOnInit();
      }
    })
  }
  /*  
    * This is the assignType function     
    * assignType() is used to make API CALL to get template on notification type ddl change
  */
  assignType() {
    this.loading = true;
    if (this.eventId > 0 && this.taxData.tax_id > 0) {
      this.allTemplates = [];
      this.templateBody = "";
      this.templateType = this.notificationTypes.filter(t => t.lookup_value_id == this.selectedType);
      this.templateTypeName = this.templateType[0].lookup_value_name;
      this.getTemplateRequestData.NotificationTypeId = this.selectedType;
      this.getTemplateRequestData.EventId = this.eventId;
      this.notificationConfigService.getTemplate(this.getTemplateRequestData).subscribe(data => {
        //Make HTTP call to post API call
        if (data.Statuscode == 200) {
          this.allTemplates = data.data
          let response = data.data;
          let response2 = response.filter((t: any) => t.Status)[0].NotificationTemplate.split("MessageBody:");
          this.templateBody = response2;
          let from = response2[0].split("Subject:");
          this.tempalteSubject = from[0].split("From:");
          let sub = response2[0].split("MessageBody:");
          let sub2 = sub[0].split("Subject:");
          this.templateFrom = sub2
        }
        this.loading = false;
      }, (error) => {
        this.loading = false;
      })
    }
    else {
      setTimeout(() => {
        this.toastr.error("Please select tax type and event")
      }, 500);
    }
  }
  /*  
    * This is the highlightRowUser function     
    * highlightRowUser() is used to highlight the selected user
  */
  highlightRowUser(row: any) {
    this.selectionUser.clear();
    this.selectionUser.select(row)
  }
  /*  
    * This is the highlightRowRole function     
    * highlightRowRole() is used to highlight the selected user
  */
  highlightRowRole(row: any) {
    this.selectionRole.clear();
    this.selectionRole.select(row)
  }
}
