import { Component, OnInit,  Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { SelectionModel } from "@angular/cdk/collections";
import { MatTableDataSource, } from "@angular/material/table";
import { TableData } from "../../_models/tableData";
import { MatDialog } from '@angular/material/dialog';
import { EntityPopupComponent } from '../entity-popup/entity-popup.component';
import { AdminSystemsetupService } from '../../_services/admin/adminsystemsetup.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit, OnChanges {
  editdomain = new Subject<any>();
  @Input() tableData: any[];
  @Input() columns: any;
  @Input() columnsToDisplay: any;
  @Input() isSelectAllEnabled?: boolean = true;

  @Input() totalRowdata?: number;

  @Output() newItemEvent = new EventEmitter<any>();
  @Output() newRadioEvent = new EventEmitter<any>();
  @Output() newEditEvent = new EventEmitter<any>();
  @Output() cerrentPageEvent = new EventEmitter<any>();
  @Output() newUserEvent = new EventEmitter<any>();
  @Output() clickRadiobtn = new EventEmitter<any>();

  objectKeys = Object.keys;
  objectValues = Object.values;
  
  dataSource = new MatTableDataSource<TableData>(undefined);
  selection = new SelectionModel<TableData>(true, []);

  selection2 = new SelectionModel<TableData>(true, []);
  public directionLinks: boolean = true;
  public labels: any = {
    previousLabel: "",
    nextLabel: ""
  };
  size = 7;
  pageIndex = 0;
  totalPages: number;
  currentPage: number=1;
  p: any;
  rows: any[] = [];
  rowData: any[] = [];
  newItem: any[] = [];
  totalRowdatapage: any;
  constructor(public dialog: MatDialog, private adminsystemsetup: AdminSystemsetupService) {
   
  }
      /*  
.......................................................................................................
* This is the ngOnInit function

* ngOnInit() is used set data table data
.......................................................................................................
*/
  ngOnInit() { 
    this.dataSource = new MatTableDataSource<TableData>(
      this.tableData.slice(0, this.size)
    );
  }
      /*  
.......................................................................................................
* This is the editabletax function

* @param event is page no selected on grid

* paginateeditabletax() is used to edit tax module
.......................................................................................................
*/
  editabletax(event: any,row:any){
    this.adminsystemsetup.editdtaxModule.next({ row: row });
  }


  editTaxPeriod(event: any,row:any){
    this.adminsystemsetup.editdtaxperiod.next({ row: row });
  }


  editTaxSrcCode(event: any,row:any){
    this.adminsystemsetup.editTaxSrcCode.next({ row: row });
  }
      /*  
.......................................................................................................
* This is the editablesrc function

* @param event is page no selected on grid

* editablesrc() is used to edit table src
.......................................................................................................
*/

  editablesrc(event: any,row:any){
    
    this.adminsystemsetup.editdtaxsrc.next({ row: row });
  }
      /*  
.......................................................................................................
* This is the editablemessage function

* @param event is page no selected on grid

*  editablemessage() is used to edit message
.......................................................................................................
*/
  editablemessage(event: any,row:any){
    this.adminsystemsetup.editdmessage.next({ row: row });
  }
      /*  
.......................................................................................................
* This is the editsubmitFund function

* @param event is page no selected on grid

* editsubmitFund() is used to submit fund
.......................................................................................................
*/
  editsubmitFund(event:any,row:any)
  {
    this.adminsystemsetup.submitFund.next({ row: row });
  }
      /*  
.......................................................................................................
* This is the editable function

* @param event is page no selected on grid

* editable() is used to edit table
.......................................................................................................
*/
  editable(event: any, row: any) {
   this.adminsystemsetup.editdtax.next({ row: row });
    this.adminsystemsetup.clickRadiobtn.next({ row: row });

  }
    /*  
.......................................................................................................
* This is the editableDomain function

* @param event is page no selected on grid

* paginateeditableDomain() is used to edit domain
.......................................................................................................
*/
  editableDomain(event: any, row: any){
    this.adminsystemsetup.editdomain.next({ row: row });
  }
      /*  
.......................................................................................................
* This is the neweditable function

* @param event is page no selected on grid

* neweditable() is used to new edit table
.......................................................................................................
*/
  neweditable(event: any, row: any) {
  
    this.adminsystemsetup.neweditdtax.next({ row: row });
  }
      /*  
.......................................................................................................
* This is the radiochecked function

* @param event is page no selected on grid

* radiochecked() is used to set radio checked
.......................................................................................................
*/
  radiochecked(event: any, row: any) {
    this.adminsystemsetup.clickRadiobtn.next({ row: row });
    this.newRadioEvent.emit(row);
  }
      /*  
.......................................................................................................
* This is the selectUser function

* @param event is page no selected on grid

* selectUser() is used to select user
.......................................................................................................
*/
  selectUser() {
    this.newUserEvent.emit(this.selection);
  }
      /*  
.......................................................................................................
* This is the highlightRow function

* highlightRow() is used to high light row
.......................................................................................................
*/
  highlightRow(row: any) {  
    this.selection2.clear();
    this.selection2.select(row)    
  }
       /*  
.......................................................................................................
* This is the selectRow function

* selectRow() is used to select row
.......................................................................................................
*/
  selectRow(event: any, row: any) {
    if (event.checked)
      this.newItemEvent.emit(row);
    this.adminsystemsetup.CTSEvents.next({ row: row });
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {

    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: TableData): string {
    if (!row) {

      return `${this.isAllSelected() ? "select" : "deselect"} all`;
    }
    return `${this.selection.isSelected(row) ? "deselect" : "select"
      } row ${row.userId + 1}`;
  }
      /*  
.......................................................................................................
* This is the paginate function

* @param event is page no selected on grid

* paginate() is used set pagination wise data
.......................................................................................................
*/
  paginate(event: any) {
    this.pageIndex = event;
    this.currentPage=event;
    this.cerrentPageEvent.emit(event);
    this.dataSource = new MatTableDataSource<TableData>(
      this.tableData.slice(event * this.size - this.size, event * this.size)
    );
    this.rearrangePaging();
  }

      /*  
.......................................................................................................
* This is the rearrangePaging function

* rearrangePaging() is used set pagination wise data
.......................................................................................................
*/
  rearrangePaging()
  {
    if(this.currentPage==1)
    {
      this.labels.previousLabel="";
    }
    else
    {
      this.labels.previousLabel="< Prev";
    }
    if(this.currentPage==this.totalPages) 
    {
      this.labels.nextLabel="";
    }
    else
    {
      this.labels.nextLabel="Next >";
    }
  }
      /*  
.......................................................................................................
* This is the  openDialog1 function

* openDialog1() is used to open dialog
.......................................................................................................
*/
  openDialog1(from: any, row: any) {
    this.dialog.open(EntityPopupComponent, {
      data: {
        from: from,
        rowData: row,
      }, width: '80%'
    });
  }
  /*  
.......................................................................................................
* This is the  ngOnChanges function

* ngOnChanges() is used to filter table data
.......................................................................................................
*/
  ngOnChanges() {
    if (this.tableData) {
      this.dataSource = new MatTableDataSource<TableData>(
        this.tableData.slice(0, this.size)
      );
     
      this.selection = new SelectionModel<any>(true, this.tableData.filter(t => t.status_flag));
     if(this.tableData.length>0)
     {
      this.totalPages=this.tableData[0].totalrows/this.size;
      this.totalPages=Math.ceil(this.totalPages);
      this.rearrangePaging();
     }
    }
  }
}
