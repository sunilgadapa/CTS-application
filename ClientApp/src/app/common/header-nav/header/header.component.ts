import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AuthenticationService } from '../../../_services/identity/authentication.service';
import { SideNavItems } from 'src/app/_models/sideNavItems';
import { MsalUserService } from '../../../_services/identity/msaluser.service';
import { Router, NavigationEnd } from '@angular/router';
import { MatOption } from "@angular/material/core";
import { UsermanagmentService } from 'src/app/_services/userManagement/usermanagment.service';
import { NotificationService } from 'src/app/_services/notification/notification.service';
import { ConfigService } from 'src/app/_services/config/config.service';
import * as signalR from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';

import { ManualUploadService } from 'src/app/_services/manualUpload/manualupload.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public notificationCount: any="";
  public notificationResult: any[];
  public notificationResultById: any;
  public signalRBaseUrl:any;
  public notificationParams={
    Notification_Type:"",
    Notification_Status:0,
    Page:0,
    Size:0
  };

  public notificationArchiveParams={
    notificationId:0,
    isAllSelected:0,
    isArchiving:0
  };
  public errorMessage = '';
  maualdatasearchform: FormGroup;
  @ViewChild('allSelected3') private allSelected3: MatOption;
  public loadingTemplate: TemplateRef<any>;
  public loading = false;
  panelOpenState = false;
  TaxperiodDDL: any[] = []
  taxPeriods: any[] = []
  Tax_Period: any[] = [];
  Tax_modules: any[] = [];
  notificationData : any[]=[];
  active = 0;
  taxId: any;
  notification_status:any='0';
  notification_pref: any;
  showNotifications = 0;
  userName:any;
  redirectUrl=''
  TaxModules: any[] = [];
  statusddl1: boolean;
  statusddl2: boolean;
  statusddl3: boolean;
  statusddl4: boolean;
  selected = -1;
  navItems: SideNavItems[];
  headerShow = false;
  region = '';
  viewDocument=false;
  isExpanded = false;
  pageIndex = 1;
  size = 5000;
  statusddl: boolean = false;
  constructor(
    private userManagementService: UsermanagmentService,
    private authenticationService: AuthenticationService,
    private msalService: MsalUserService,
    private fileTypeService: ManualUploadService,
    private router: Router,
    private formBuilder: FormBuilder,
    private configService: ConfigService,
    private notificationService: NotificationService,
    private toastr: ToastrService) {
    
    let configData = this.configService.getConfig();
    this.signalRBaseUrl=configData.signalRBaseUrl;
    this.region = configData.env;
    this.maualdatasearchform = this.formBuilder.group({
      tax_module: ['', Validators.required],
      tax_period: ['', Validators.required]
    });
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/notonboarded') {
          this.headerShow = false;
        } else {
          this.headerShow = true;
          if (event.url === '/usermanagement' || event.url === '/dashboard') {
            this.viewDocument = true;
          }
        }
      }
    });

    this.userManagementService.getLookupdata('Tax Module').subscribe(data => {
      this.Tax_modules = data;
      this.Tax_modules = this.Tax_modules.filter(
        (filterData: any) => filterData.status_flag === true);

    })

  }

  /*  
.......................................................................................................
* This is the ngOnInit function

* ngOnInit() is used to get user data and nav list data
.......................................................................................................
*/
  ngOnInit(): void {
    
    this.getUserData();
    this.CreateSignalRConnection();
    this.getNavlistData();
  }
  /*  
.......................................................................................................
* This is the toggleArrow1 function

* toggleArrow1() is used to toggle dropdown
.......................................................................................................
*/
  toggleArrow1() {
    this.statusddl1 = this.statusddl1 === true ? false : true;
  }
  /*  
.......................................................................................................
* This is the toggleArrow2 function

* toggleArrow2() is used to toggle dropdown
.......................................................................................................
*/
  toggleArrow2() {
    this.statusddl2 = this.statusddl2 === true ? false : true;
  }
  /*  
.......................................................................................................
* This is the toggleArrow3 function

* toggleArrow3() is used to toggle dropdown
.......................................................................................................
*/
  toggleArrow3() {
    this.statusddl3 = this.statusddl3 === true ? false : true;
  }
  /*  
.......................................................................................................
* This is the toggleArrow4 function

* toggleArrow4() is used to toggle dropdown
.......................................................................................................
*/
toggleArrow4() {
  this.statusddl4 = this.statusddl4 === true ? false : true;
}
  /*  
.......................................................................................................
* This is the getUserData function

* getUserData() is used to get user data
.......................................................................................................
*/
  getUserData() {
      this.userName=this.msalService.getCurrentUserInfo();
  }

  /*  
.......................................................................................................
* This is the getList function

* getList() is used to get list
.......................................................................................................
*/
  getList() {
    if (this.active == 1) {
      this.active = 0;
    } else {
      this.active = 1;
    }
  }

  /*  
.......................................................................................................
* This is the getNotifications function

* getNotifications() is used to get notification
.......................................................................................................
*/
  showHideNotifications() {
    if (this.showNotifications == 1) {
      this.showNotifications = 0;
    } else {
      this.showNotifications = 1;
      this.getNotificationMessage(null);
    }
  }

  /*  
.......................................................................................................
* This is the getNavlistData function

* getNavlistData() is used to get nav list
.......................................................................................................
*/
  getNavlistData() {
    this.loading = true;
    this.authenticationService.getNavItems().subscribe(user => {
      this.navItems = user.data.ParentMenu
      this.redirectUrl = user.data.ParentMenu[0].route
      this.loading = false;

    },
      (error) => {
        this.redirectUrl = ''
        this.navItems = []
        this.loading = false;

      })
  }
  /*This function will initiate SignalR Connection*/
  CreateSignalRConnection()
  {
    this.getNotificationCount();
    const connection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl(this.signalRBaseUrl + 'notify')
      .build();

    connection.start().then(function () {
      console.log('SignalR Connected!');
    }).catch(function (err) {
      return console.error(err.toString());
    });

    connection.on("BroadcastMessage", () => {
      this.getNotificationCount();
    });
  }



  /*THis function will get the notification count when signalR broadcast any chnages*/
  getNotificationCount() {
    this.notificationService.getNotificationCount().subscribe(
      data => {
        if(data.Count>999)
        {
          this.notificationCount="999+";
        }
        else if(data.Count>99)
        {
          this.notificationCount="99+";
        }
        else if(data.Count>9)
        {
          this.notificationCount="9+";
        }
        
        else if(data.Count<10 && data.Count>0)
        {
          this.notificationCount=data.Count;
        }
        
        console.log("Notification",this.notificationCount);
      },
      error => this.errorMessage = error
    );
  }
  
  /*Get the notification message after clicking on bell  icon */
  getNotificationMessage(event: any) {
      if(event==null || event.value==null)
      {
        this.notificationParams.Notification_Status=0;
      }
      else{
        this.notificationParams.Notification_Status=parseInt(event.value) ;
      }
      this.notificationParams.Page=this.pageIndex;
      this.notificationParams.Size=this.size;
      this.notificationParams.Notification_Type="Dashboard";
      
      this.notificationService.getNotificationMessage(this.notificationParams).subscribe(
        data => {
            this.showNotifications = 1;
            this.notificationResult = data;
            console.log("NotificationResultData",data)
        },
        error => this.errorMessage = error
      );
  }
  
  /*This function is used for getting notification by id and update notification status */
  getNotificationByIdAndUpdate(row:any)
  {
    let notificationId:any=row.NotificationId;
    let selectedRowIndex:any;
    this.notificationService.getNotificationByIdAndUpdate(notificationId).subscribe(
      data => {
        this.notificationResultById = data;
        selectedRowIndex=this.notificationResult.findIndex(item=>item.NotificationId==row.NotificationId);
        this.notificationResult[selectedRowIndex].IsRead=true;
        console.log("notificationResultById",data)
      },
    error => this.errorMessage = error);
  }

  /* This function used for archive notification */
  archiveNotification(row:any,isArchive:any)
  {
    this.notificationArchiveParams.isAllSelected=0;
    this.notificationArchiveParams.isArchiving=isArchive;
    this.notificationArchiveParams.notificationId=row.NotificationId;
    this.notificationService.archiveNotifications(this.notificationArchiveParams).subscribe(data => {
      let response = data;
      let selectedRowIndex:any;
          if (response.Statuscode == 200) {
            
            selectedRowIndex=this.notificationResult.findIndex(item=>item.NotificationId==row.NotificationId);
            if(isArchive==0)
            {
              this.notificationResult[selectedRowIndex].IsArchive=false;
              this.toastr.success(response.Message);
            }
            else{
              this.notificationResult[selectedRowIndex].IsArchive=true;
              this.toastr.success(response.Message);
            }
            
          } else {
            setTimeout(() => {
              this.toastr.error(response.Message);
            }, 500);        
          }
        }
        );
  }
    /*  
.......................................................................................................
* This is the  Logout function

*  Logout() is used to logout session
.......................................................................................................
*/
  Logout() {
    this.msalService.logout()
  }


  toggleAllTaxPeriod() {

    if (this.allSelected3.selected) {
      this.maualdatasearchform.controls.tax_period
        .patchValue([...this.Tax_Period.map((item: any) => item), 0]);
    } else {
      this.maualdatasearchform.controls.tax_period.patchValue([]);
    }
  }

  toggleTaxPeriod() {
    if (this.allSelected3.selected) {
      this.allSelected3.deselect();
      return false;
    }
    if (this.maualdatasearchform.controls.tax_period.value.length == this.Tax_Period.length)
      this.allSelected3.select();
    return true;
  }
  /* 
        * This is the toggleArrowTaxtype function  
        * toggleArrowTaxtype() is used to animate the tax type dropdown list arrow
    */
  toggleArrowTaxtype() {
    this.statusddl = this.statusddl === true ? false : true;
  }


  /* 
        * This is the toggleArrowTaxtype function  
        * toggleArrowTaxtype() is used to animate the tax type dropdown list arrow
    */

  selectTaxModules() {
    localStorage.setItem('taxModuleHeader', JSON.stringify(this.taxId));
  }
  /* 
        * This is the toggleArrowTaxtype function  
        * toggleArrowTaxtype() is used to animate the tax type dropdown list arrow
    */
  selectTaxPeriods() {

    let taxPeriodIds = [];
    if (this.maualdatasearchform.controls.tax_period.value[0] != 0) {
      for (var tax of this.maualdatasearchform.controls.tax_period.value) {
        var id3 = tax.ID;
        taxPeriodIds.push(id3)
      }
    } else {
      taxPeriodIds.push(0)
    }

    localStorage.setItem('taxPeriodsHeader', JSON.stringify(taxPeriodIds));
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.fileTypeService.getLookupdata('TaxPeriod').subscribe(data => {
      this.Tax_Period = data;

      this.TaxperiodDDL = JSON.parse(localStorage.getItem('taxPeriodsHeader') || 'null')

      if (this.TaxperiodDDL != null) {

        let defaultValues = this.Tax_Period.filter((id: any) => this.TaxperiodDDL.includes(id.ID));
        this.maualdatasearchform.controls['tax_period'].setValue(defaultValues);

        if (this.TaxperiodDDL[0] == 0) {
          this.maualdatasearchform.controls['tax_period'].setValue(0);
          this.toggleAllTaxPeriod();
        }
      }

    })


    let taxModule = JSON.parse(localStorage.getItem('taxModuleHeader') || 'null')
    if (taxModule != null) {

      this.maualdatasearchform.controls['tax_module'].setValue(taxModule);
      this.taxId = taxModule
    }
  }

  
}