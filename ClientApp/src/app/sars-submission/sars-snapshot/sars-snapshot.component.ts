import { Component, OnInit, TemplateRef } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from "ngx-toastr";
import { MatTableDataSource } from "@angular/material/table";
import { DataSubmissionService } from "src/app/_services/dataSubmission/datasubmission.service";
import { ConfirmFilePopupComponent } from "../confirm-file-popup/confirm-file-popup.component";
import { MatDialog } from "@angular/material/dialog";
@Component({
  selector: 'app-sars-snapshot',
  templateUrl: './sars-snapshot.component.html',
  styleUrls: ['./sars-snapshot.component.css']
})
export class SarsSnapshotComponent implements OnInit {
  public loadingTemplate: TemplateRef<any>;
  public loading = false;
  selectedType: any = 'T';
  fileId: number = 0;
  dataSource = new MatTableDataSource<any>(undefined);
  dataSourceChild = new MatTableDataSource<any>(undefined)
  fileTable: any[];
  payload: any = {
    Page: 1,
    Size: 7,
    SearchText: "",
    status_type: [],
    fundentity_type: [],
    totalrows: 0,
    fileregion_type: [],
    sars_submission_id: 0
  }
  columnsFileTable = [
    { columnDef: 'file_name', header: 'File Name', cell: (element: any) => `${element.file_name}` },
    { columnDef: 'tax_number', header: 'Tax Number', cell: (element: any) => `${element.tax_number}` },
    { columnDef: 'fund_entity', header: 'Fund Entity', cell: (element: any) => `${element.fund_entity_name}` },
    { columnDef: 'status', header: 'Status', cell: (element: any) => `${element.status_name}` },
  ];
  columnsFileTableChild = [
    { columnDef: 'file_type', header: 'Select the File Type' },

  ];
  columnsToDisplayFileTable = this.columnsFileTable.map(c => c.columnDef);
  columnsToDisplayFileTableChild = this.columnsFileTableChild.map(c => c.columnDef);
  columns: Array<any>
  displayedColumns: Array<any>
  errorsData: any[];
  fileRegionList: any = [{ "ID": 382, "Name": "L" }, { "ID": 384, "Name": "N/A" }, { "ID": 383, "Name": "T" }];
  constructor(public dialog: MatDialog,
    public toastr: ToastrService, private dataSubmissionService: DataSubmissionService, private route: ActivatedRoute, public router: Router) {
    this.route.queryParams.subscribe(params => {
      let id = params["fileId"];
      if (id) {
        this.fileId = id
      }
    });
  }
 /*  
......................................................................................................
* This is the ngOnInit function

* ngOnInit is used to initialisation purpose
.......................................................................................................
*/
  ngOnInit(): void {
    this.getFile();
  }
 /*  
......................................................................................................
* This is the getFile function

* getFile is used to selected file details
.......................................................................................................
*/
  getFile() {
    this.payload.sars_submission_id = Number(this.fileId);
    this.dataSubmissionService.getSarsSubmissionData(this.payload).subscribe(response => {
      let newResponse = response;
      if (newResponse.Statuscode == 200) {
        this.fileTable = newResponse.data;
        this.selectedType = this.fileTable[0].file_region_id;
        this.dataSource = new MatTableDataSource<any>(
          this.fileTable);
        this.dataSourceChild = new MatTableDataSource<any>(
          this.fileTable);
      }
    })
  }
 /*  
......................................................................................................
* This is the navigateToSars function

*  navigateToSars is used to navigate sars submission screen
.......................................................................................................
*/
  navigateToSars() {
    this.router.navigate(['/sarssubmission']);
  }
 /*  
......................................................................................................
* This is the generateSnapshot function

* generateSnapshot is used to generate snapshot API call
.......................................................................................................
*/
  generateSnapshot() {
    this.loading = true;
    this.dataSubmissionService.generateSnapshot(this.fileId, this.selectedType).subscribe(response => {
      let newResponse = response;
      if (newResponse.Statuscode == 200) {
        this.loading = false;
        this.toastr.success(newResponse.Message);
        this.getFile();
      }
      else {
        this.toastr.error(newResponse.Message);
      }
    },
      (error) => {
        this.loading = false;
        this.toastr.error('Something went wrong')
      })
  }

     /*  
......................................................................................................
* This is the  openLogicalFileDialog  function

* openLogicalFileDialog is used to open sars snapshot dialog
.......................................................................................................
*/
openLogicalFileDialog(): void {
  this.loading = false;
  const logicalDialogRef = this.dialog.open(ConfirmFilePopupComponent, {
    data: {
      from: 'sarsSubmission',
      header: 'Generate Logical File',
      description : 'Logical File Process Started',
    }, width: '50%'
  });
  logicalDialogRef.afterClosed().subscribe((confirm: boolean) => {
    if (confirm) {
      this.generateSnapshot();
    
    }
  });
}

}
