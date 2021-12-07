import {
  Component, OnInit
} from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { ToastrService } from "ngx-toastr";
import { SelectionModel } from "@angular/cdk/collections";
import { DashboardService } from "src/app/_services/dashboard/dashboard.service";

export interface PeriodicElement {
  Dataname: string;
  source: string;
  status: string;
  datetime: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {


  constructor(private toastr: ToastrService,
    private dashboardService: DashboardService) {
    this.getUserData()
  }
  columns = [
    { columnDef: 'SOURCE_SYSTEM', header: 'Source', cell: (element: any) => `${element.SOURCE_SYSTEM}` },
    { columnDef: 'FILE_NAME', header: 'File Name', cell: (element: any) => `${element.FILE_NAME}` },
    { columnDef: 'DISPLAY_STATUS', header: 'Status', cell: (element: any) => `${element.DISPLAY_STATUS}` },
    { columnDef: 'last_updated_date', header: 'Date and Time', cell: (element: any) => `${element.last_updated_date}` },
  ];
  columnsToDisplay = this.columns.map(c => c.columnDef);

  Data: PeriodicElement[] = [
    { source: 'IT3F', Dataname: 'File-XY27456AWE.txt', status: 'Partial Load', datetime: '09 November 11:23pm' },
    { source: 'IT3F', Dataname: 'File-BR234HY.csv', status: 'Rejected', datetime: '12 October 3:23pm' },
    { source: 'IT3F', Dataname: 'File-TR234HY.txt', status: 'pending', datetime: '19 March 12:23pm' },
    { source: 'IT3F', Dataname: 'File-ET234HY.csv', status: 'Technical Error', datetime: '23 December 11:23pm' },
    { source: 'IT3F', Dataname: 'File-XY27456SER.txt', status: 'Partial Load', datetime: '12 October 3:23pm' },
    { source: 'IT3F', Dataname: 'File-BR234HY.csv', status: 'Rejected', datetime: '09 November 11:23pm' },
    { source: 'IT3F', Dataname: 'File-BRM234DRT.txt', status: 'pending', datetime: '12 October 3:23pm' },
    { source: 'IT3F', Dataname: 'File-MMRM234DRT.txt', status: 'Approved', datetime: '30 October 3:23pm' },
  ];
  displayedColumns: string[] = ['source', 'Data Load File Name', 'status', 'Date and Time'];




  DataSarss: any[] = [
    { tax_module: 'IT3F', subfilename: 'File-XY27456AWE.txt', sars_res: 'Rejected', datetime: '09 November 11:23pm' },
    { tax_module: 'IT3F', subfilename: 'File-XY27456AWE.txt', sars_res: 'Partial upload by SARS', datetime: '09 November 11:23pm' },
    { tax_module: 'IT3F', subfilename: 'File-XY27456AWE.txt', sars_res: 'Duplicate Record', datetime: '09 November 11:23pm' },
    { tax_module: 'IT3F', subfilename: 'File-XY27456AWE.txt', sars_res: 'Duplicate Record', datetime: '09 November 11:23pm' },
    { tax_module: 'IT3F', subfilename: 'File-XY27456AWE.txt', sars_res: 'Partial upload by SARS', datetime: '09 November 11:23pm' },
    { tax_module: 'IT3F', subfilename: 'File-XY27456AWE.txt', sars_res: 'Rejected', datetime: '09 November 11:23pm' },
    { tax_module: 'IT3F', subfilename: 'File-XY27456AWE.txt', sars_res: 'Rejected', datetime: '09 November 11:23pm' },

  ];
  displayedColumnssars: string[] = ['Tax Module', 'Submission File Name', 'SARS Response Description', 'Date Response Received'];
  dataSourcesrs = new MatTableDataSource<any>(this.DataSarss);
  public directionLinks: boolean = true;
  public labels: any = {
    previousLabel: "< Prev",
    nextLabel: "Next >"
  };
  size = 7
  pageIndex = 1
  p: any
  user: any
  roleId = ''
  randomSize = 0
  totalItems = 0
  totalPages: number;
  dataLoadRecentErrorsTableData: any[] = []
  dataSource = new MatTableDataSource<any>(undefined)
  green: string = '#6EAB42'
  red: string = '#C1282D'
  orange: string = '#E98523'
  panelOpenState = false
  panelOpenState2 = false
  data: Array<any> = [
    {
      fundEntity: 'SAFAF',
      fileLoaded: this.green,
      promoted: this.red,
      logicalFile: this.green,
      test: this.orange,
      live: this.green,
      sarsResponse: this.orange,
      certificateGenerated: this.green,
      eFillingCompleted: this.orange,
      dueDate: this.red,
    },
    {
      fundEntity: 'SISRAN',
      fileLoaded: this.red,
      promoted: this.green,
      logicalFile: this.orange,
      test: this.green,
      live: this.orange,
      sarsResponse: this.green,
      certificateGenerated: this.orange,
      eFillingCompleted: this.green,
      dueDate: this.orange,
    },
    {
      fundEntity: 'FCRAPF',
      fileLoaded: this.green,
      promoted: this.orange,
      logicalFile: this.green,
      test: this.orange,
      live: this.red,
      sarsResponse: this.orange,
      certificateGenerated: this.green,
      eFillingCompleted: this.orange,
      dueDate: this.red,
    },
    {
      fundEntity: 'FCRAPF',
      fileLoaded: this.orange,
      promoted: this.red,
      logicalFile: this.orange,
      test: this.red,
      live: this.orange,
      sarsResponse: this.red,
      certificateGenerated: this.orange,
      eFillingCompleted: this.green,
      dueDate: this.orange,
    },
  ];

  paginateDataLoadErrors(event: any) {
    debugger
    this.pageIndex = event;   
    this.getDataLoadRecentErrors()      
    this.rearrangePaging()
  }
  rearrangePaging() {
    debugger
    if (this.pageIndex == 1) {
      this.labels.previousLabel = "";
    }
    else {
      this.labels.previousLabel = "< Prev";
    }
    if (this.pageIndex == this.totalPages) {
      this.labels.nextLabel = "";
    }
    else {
      this.labels.nextLabel = "Next >";
    }
  }
  /*  
.......................................................................................................
* This is the ngOnInit function

* ngOnInit() is used set data in data table
.......................................................................................................
*/
  ngOnInit() {
    this.getDataLoadRecentErrors()
  }

  /*  
  ......................................................................................................
  * This is the getDataLoadRecentErrors function
  * @param PageNumber is a page number
  * @param Size is a page size
  * getDataLoadRecentErrors is used to get the data load recent errors
  .......................................................................................................
  */
  getDataLoadRecentErrors() {
    this.dashboardService.getDataLoadRecentErrors(this.pageIndex, this.size).subscribe(response => {
      //Make HTTP call to GET API call
      this.dataLoadRecentErrorsTableData = response.data
      this.totalItems = response.data[0].totalItems
      this.dataSource = new MatTableDataSource<any>(
        this.dataLoadRecentErrorsTableData.slice(0, this.size)
      );
      this.totalPages = this.totalItems / this.size;
      this.totalPages = Math.ceil(this.totalPages);
      this.rearrangePaging();
    }, (error) => {
      debugger
      console.log('error got',error)
    })
  }
  /*  
.......................................................................................................
* This is the paginate function

* @param event is page no selected on grid

* paginate() is used set pagination wise data
.......................................................................................................
*/
  paginate(event: any) {
    //this.pageIndex = event;
    // this.dataSource = new MatTableDataSource<PeriodicElement>(
    //   this.Data.slice(event * this.size - this.size, event * this.size)
    // );
  }

  /*  
.......................................................................................................
* This is the getUserData function

* getUserData() is used get user data
.......................................................................................................
*/
  getUserData() {

    const user = JSON.parse(localStorage.getItem('onBordeduser') || '{}');
    this.user = user.data.User;
    this.roleId = user.data.role_id

  }
}
