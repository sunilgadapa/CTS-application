import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from "@angular/core";
import { trigger, state, style, animate, transition } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { DeletePopupComponent } from '../../common/delete-popup/delete-popup.component';
import { AdduserComponent } from '../adduser/adduser.component';
import { MatDrawerContainer } from '@angular/material/sidenav';
import { SideNavItems } from "../../_models/sideNavItems";
import { Search } from "../../_models/search";
import { FormGroup, FormBuilder } from '@angular/forms';
import { UsermanagmentService } from "../../_services/userManagement/usermanagment.service";
import { MatPaginator } from "@angular/material/paginator";
import { Subscriber } from "rxjs";
import { SelectionModel } from "@angular/cdk/collections";
import { ToastrService } from "ngx-toastr";
import { AuthenticationService } from "../../_services/identity/authentication.service";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
@Component({
  selector: 'app-user-mananagement',
  templateUrl: './user-mananagement.component.html',
  styleUrls: ['./user-mananagement.component.css'],
  animations: [
    trigger('rotatedState', [
      state('default', style({ transform: 'rotate(720deg)' })),
      transition('default => rotated', animate('800ms')),
      transition('rotated => default', animate('800ms')),
    ]),
  ],
})
export class UserMananagementComponent implements OnInit {
  public loadingTemplate: TemplateRef<any>;
  public loading = false;
  usersearchform: FormGroup;
  isSelectedDelete: boolean;
  isSelectedAmmend: boolean;
  @ViewChild('appDrawer') appDrawer: ElementRef;
  status: any[] = [
    { name: 'Active', value: 'A' },
    { name: 'Inactive', value: 'I' }
  ];
  selectedItem: any[] = [];
  state: string = 'default';
  drawer: MatDrawerContainer;
  statusddl: boolean = false;
  userData: Array<any> = [];
  navItems: SideNavItems[];
  userName: any[] = [];
  UserIds: any[] = [];
  Userstatus: any;
  UserStatusdropdown: any;
  search: Search = { Page: 1, Size: 7, SearchText: '', Status: 'ALL' };
  subscription = new Subscriber();
  updateData: any[] = [];
  newItem: any[] = [];
  newSubscriptionData: any[] = [];
  currentPage: number = 1;
  userToUpdate: any[] = [];
  dataSource = new MatTableDataSource<any>(undefined);
  selection = new SelectionModel<any[]>(true, []);
  selection2 = new SelectionModel<any[]>(true, []);
  tableData: any[] = [];
  size = 7;
  totalPages: number;
  pageIndex = 0;
  p: any;
  randomSize = 0;
  public labels: any = {
    previousLabel: "< Prev",
    nextLabel: "Next >"
  };
  public directionLinks: boolean = true;
  alreadyDeletedUsers: any[] = []
  constructor(public dialog: MatDialog, private userManagementService: UsermanagmentService,
    private formBuilder: FormBuilder, private toastr: ToastrService,
    private authenticationService: AuthenticationService, private router: Router) { }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  ngOnInit(): void {
    if (localStorage.getItem('userMgntStatusDDL')) {
      let data = JSON.parse(localStorage.getItem('userMgntStatusDDL') || '{}')
      this.selectedItem = data;
      this.searchUsers();
    } else {
      this.getAllUsers()
    }
  }
  columns = [
    { columnDef: 'select', header: 'select', cell: (element: any) => `${element.select}` },
    { columnDef: 'UserName', header: 'User ID', cell: (element: any) => `${element.UserName}` },
    { columnDef: 'User', header: 'Given Name', cell: (element: any) => `${element.User}` },
    { columnDef: 'UserStatus', header: 'Status', cell: (element: any) => `${element.UserStatus}` },
    { columnDef: 'strRoleNames', header: 'Roles', cell: (element: any) => `${element.strRoleNames}` },
    { columnDef: 'strSrcSyms', header: 'Source Systems', cell: (element: any) => `${element.strSrcSyms}` },
    { columnDef: 'strFundEntities', header: 'Fund Entities', cell: (element: any) => `${element.strFundEntities}` },
  ];
  columnsToDisplay = this.columns.map(c => c.columnDef);
  /*  
  ......................................................................................................
    * This is the paginate function
    * @param event This is the page number parameter
    * paginate is used to retrieve table records by page number 
 ......................................................................................................
  */
  paginate(event: any) {
    this.pageIndex = event;
    this.currentPage = event;
    this.search.Page = this.pageIndex
    this.selection = new SelectionModel<any>(true, [])
    this.refresh()
    this.dataSource = new MatTableDataSource<any>(
      this.tableData.slice(event * this.size - this.size, event * this.size)
    );
    this.rearrangePaging();
  }
  /* 
  ...................................................................................................... 
    * This is the rearrangePaging function  
    * rearrangePaging() is used to set prev and next button based on current page number 
  ......................................................................................................
  */
  rearrangePaging() {
    if (this.currentPage == 1) {
      this.labels.previousLabel = "";
    }
    else {
      this.labels.previousLabel = "< Prev";
    }
    if (this.currentPage == this.totalPages) {
      this.labels.nextLabel = "";
    }
    else {
      this.labels.nextLabel = "Next >";
    }
  }
  /*  
  ......................................................................................................
    * This is the searchUsers function  
    * searchUsers() is used to search users based on active and inactive filter condition 
  ......................................................................................................
  */
  searchUsers() {
    this.pageIndex = 1
    this.currentPage = 1
    this.selection.clear();
    if (this.selectedItem != undefined) {
      this.search.Size = 7
      this.search.SearchText = ''
      this.search.Page = 1
      if (this.selectedItem.includes("A")) {
        this.search.Status = "A"
      }
      if (this.selectedItem.includes("I")) {
        this.search.Status = "I"
      }
      if (this.selectedItem.includes("A")) {
        if (this.selectedItem.includes("I")) {
          this.search.Status = "ALL"
        }
      }
      localStorage.setItem('userMgntStatusDDL', JSON.stringify(this.selectedItem));
      this.getAllUsers();
    }
    else {
      setTimeout(() => {
        this.toastr.error('Please select the status')
      }, 500);
    }
  }
  /*  
  ......................................................................................................
    * This is the openDeleteDialog function  
    * openDeleteDialog() is used to open confirm delete popup with selected users list
  ......................................................................................................
  */
  openDeleteDialog() {
    let result = this.newItem.filter(o1 => this.alreadyDeletedUsers.some(o2 => o1.UserName === o2.UserName));
    const user = JSON.parse(localStorage.getItem('onBordeduser') || '{}');
    if (result.length > 0) {
      setTimeout(() => {
        this.toastr.error('Selected user already deleted')
        this.selection.clear();
        this.refresh()
      }, 500);
    }
    else {
      if (this.userName.includes(user.data.UserName)) {
        setTimeout(() => {
          this.toastr.error('You can not delete your self')
        }, 500);
      } else {
        const dialogRef = this.dialog.open(DeletePopupComponent, {
          data: {
            from: 'User',
            message: `Are you sure you want to delete the selected user(s)?${this.userName.join(' , ')}`,
            buttonText: {
              ok: 'Yes',
              cancel: 'No'
            }
          }, width: '50%'
        });
        dialogRef.afterClosed().subscribe((confirmed: boolean) => {
          if (confirmed) {
            this.deleteUsers();
            this.search.Page = 1
            this.selection.clear()
            this.refresh();
          }
        });
      }
    }
  }
  /* 
  ...................................................................................................... 
    * This is the openInsertDialog function  
    * openInsertDialog() is used to open add user popup
  ......................................................................................................
  */
  openInsertDialog() {
    const dialogRef = this.dialog.open(AdduserComponent, { width: '50%' })
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.search.Page = 1
        this.refresh();
      }
    })
    this.selection.clear()
  }
  /*
  ......................................................................................................  
    * This is the openUpdateDialog function  
    * openUpdateDialog() is used to open update selected user popup
 ......................................................................................................
  */
  openUpdateDialog() {
    let result = this.newItem.filter(o1 => this.alreadyDeletedUsers.some(o2 => o1.UserName === o2.UserName));
    const user = JSON.parse(localStorage.getItem('onBordeduser') || '{}');
    if (result.length > 0) {
      setTimeout(() => {
        this.toastr.error('Selected user is Inactive')
      }, 500);
    } else {
      if (user.data.UserName == this.userToUpdate[0].UserName) {
        setTimeout(() => {
          this.toastr.error('You can not update your self')
        }, 500);
      } else {
        this.addUserPopup();
      }
    }
  }
  /*  
  ......................................................................................................
    * This is the addUserPopup function  
    * addUserPopup() is a privated method used in add/update user functionality
 ......................................................................................................
  */
  private addUserPopup() {
    const dialogRef = this.dialog.open(AdduserComponent, {
      data: {
        mode: "edit",
        updateData: this.userToUpdate
      }, width: '60%',
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {      
        this.alreadyDeletedUsers = [];
        this.newItem = [];
        this.selection.clear();
        this.refresh();
      }
    });
  }
  /* 
  ...................................................................................................... 
    * This is the getAllUsers function  
    * getAllUsers() is a intermediate function to get users based on filter condition
  ......................................................................................................
  */
  getAllUsers() {
    this.refresh();
  }
  /* 
  ...................................................................................................... 
    * This is the isAllSelected function  
    * isAllSelected() is used to check if all rows of mat table selectd
  ......................................................................................................
  */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  /*  
  ......................................................................................................
    * This is the masterToggle function  
    * masterToggle() is used to toggle select all checkbox if all table rows are selected
  ......................................................................................................
  */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }
  /*  
  ......................................................................................................
    * This is the deleteUsers function  
    * deleteUsers() is used to make API CALL to delete selected user
  ......................................................................................................
  */
  deleteUsers() {
    this.loading = true;
    this.userManagementService.deleteUsers(this.UserIds).subscribe(response => {
      //Make HTTP call to post API call
      let newResponse = response
      if (newResponse.Statuscode == 200) {
        this.loading = false;
        this.toastr.success(newResponse.Message);
        this.selection.clear();
        this.refresh()
      }
      else {
        setTimeout(() => {
          this.toastr.error(newResponse.Message);
        }, 500);
      }
    }, (error) => {
      this.loading = false;
      this.selection.clear();
      setTimeout(() => {
        this.toastr.error('Something went wrong')
      }, 500);
    })
  }
  /*
  ......................................................................................................  
      * This is the rotate function  
      * rotate() is used to animate the refresh grid button
  ......................................................................................................
  */
  rotate() {
    this.state = this.state === 'default' ? 'rotated' : 'default';
    this.searchUsers();
  }
  /*
  ......................................................................................................  
      * This is the userToUpdateAndDelete function  
      * userToUpdateAndDelete() is used to synchronize all button's visibility based on the row selction
  ......................................................................................................
  */
  userToUpdateAndDelete() {
    this.newItem = [];
    this.newItem = this.selection.selected
    this.userToUpdate = [];
    this.userName = [];
    this.UserIds = [];
    this.Userstatus = [];
    for (let user of this.newItem) {
      this.userToUpdate.push(user);
      this.userName.push(user.UserName);
      this.UserIds.push(user.UserId);
      this.Userstatus.push(user.UserStatus);
    }
    if (this.selection.selected.length > 0) {
      this.isSelectedDelete = true;
    }
    else {
      this.isSelectedDelete = false;
    }
    if (this.selection.selected.length === 1) {
      this.isSelectedAmmend = true;
    }
    else {
      this.isSelectedAmmend = false;
    }
  }
  /*
  ......................................................................................................  
       * This is the setCurrentPage function  
       * setCurrentPage() is used to set current page based on paginate event
  ...................................................................................................... 
  */
  setCurrentPage(page: any) {
    this.currentPage = page;
  }
  /* 
  ......................................................................................................
      * This is the toggleArrow function  
      * toggleArrow() is used to animate the status dropdown list arrow
  ......................................................................................................
  */
  toggleArrow() {
    this.statusddl = this.statusddl === true ? false : true;
  }
  /* 
  ......................................................................................................
      * This is the highlightRow function  
      * highlightRow() is used to highlight the selected row
  ......................................................................................................
  */
  highlightRow(row: any) {
    this.selection.toggle(row);
  }
  /* 
  ......................................................................................................
      * This is the refresh function  
      * refresh() is used to make API CALL to get users based on filter applied
  ......................................................................................................
  */
  refresh(): void {
    this.loading = true;
    this.userManagementService.getUsers(this.search).subscribe((user: any) => {
      //Make HTTP call to post API call
      this.loading = false;
      this.tableData = user.data;
      this.dataSource = new MatTableDataSource<any>(
        this.tableData.slice(0, this.size)
      );
      this.alreadyDeletedUsers = [];
      for (let userStatus of this.tableData) {
        var temp = userStatus.UserStatus.replace(/["']/g, "");
        var nameArr = temp.split(',');
        const unique = [...new Set(nameArr)]
        if (unique.includes('0')) {
          this.alreadyDeletedUsers.push(userStatus)
        }
      }
      this.randomSize = this.tableData[0].RowsAffected
      if (this.selection.selected.length > 0) {
        this.isSelectedDelete = true;
      }
      else {
        this.isSelectedDelete = false;
      }
      if (this.selection.selected.length === 1) {
        this.isSelectedAmmend = true;
      }
      else {
        this.isSelectedAmmend = false;
      }
      this.totalPages = this.randomSize / this.size;
      this.totalPages = Math.ceil(this.totalPages);
      this.rearrangePaging();
    },
      (error) => {
        this.loading = false;
        setTimeout(() => {
          this.toastr.error('Something went wrong')
        }, 500);
      });
  }
}
