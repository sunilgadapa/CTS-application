import { Component, OnInit,  Inject,  TemplateRef } from "@angular/core";
import { FormGroup, FormBuilder, Validators,  FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscriber } from "rxjs";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddDomainAllowedValueComponent } from "./add-domain-allowed-value/add-domain-allowed-value.component";
import { AdminSystemsetupService } from '../../../_services/admin/adminsystemsetup.service';
import { ToastrService } from 'ngx-toastr';
import { SelectionModel } from "@angular/cdk/collections";
import { MatTableDataSource, } from "@angular/material/table";
import { TableData } from "src/app/_models/tableData";
import { AddNewDomain } from '../../../_models/domainRef';
import { LookupData , MisclookupData} from "../../../_models/LookupData";
import { ValidationsetupService } from "../../../_services/common/validationsetup.service";
import { AddValidationsComponent } from "./add-validations/add-validations.component";
@Component({
  selector: 'app-domain-references',
  templateUrl: './domain-references.component.html',
  styleUrls: ['./domain-references.component.css']
})
export class DomainReferencesComponent implements  OnInit {

  constructor( public dialog: MatDialog,
    
    private toastr: ToastrService, public adminsystemsetupservice: AdminSystemsetupService) { }
  public loadingTemplate: TemplateRef<any>;
  public loading = false;
  state: string = 'default';
  dialogRef: MatDialogRef<AddnewDomain> | null;
  dialogRef1: MatDialogRef<AddDomainAllowedValueComponent> | null;
  dataSource2 = new MatTableDataSource<any>(undefined);
  p: any;
  p1: any;
  selection2 = new SelectionModel<any[]>(true, []);
  selection3 = new SelectionModel<any>(true, []);
  subscription = new Subscriber();
  addDomainName: AddNewDomain;
  MisclookupData1: any[] = [];
  lookup: LookupData;
  MisclookupData: MisclookupData;
  newItem: any[] = [];
  totalSelectedRowdata = 0;
  totalRecords: number = 7;
  tableData2: any[] = [];
  look2data: any[] = [];
  GetLook: any
  UserIds: any[] = [];
  taxId: any[] = [];
  Success: any;
  successMessage: any;
  isInvalid: boolean;
  isRadioSaveChange: boolean;
  isSelectedSaveChange: boolean;
  isSelectedDomainValue: boolean;
  username: string
  lookupalias: string;
  labelError: string;
  Gotlookup_type_id: number
  GetLookIduser: number
  GetLookTaxid: number
  totalRowdata = 0;
  pageIndex = 1;
  pageIndexDomainValue = 1;
  currentPage: number=1;
  totalPages: number;
  public directionLinks: boolean = true;
  selection = new SelectionModel<any[]>(true, []);
  public labels: any = {
    previousLabel: "< Prev",
    nextLabel: "Next >"
  };
  size = 7;
  saveDomainRefData = {
    Ids: {},
    lookup_type_name: "",
    page: 0,
    size:0,
    totalselectedrows:0
  }
  getDomainvalue = {
    lookup_type_id: 0,
    Page: 1,
    Size: 7,
    SearchText: ""
  }
  getDomainName = {
    Page: 1,
    Size: 7,
    SearchText: "",
    lookup_type:""
  }
  columns = [
    { columnDef: 'status_flag', header: 'Active', cell: (element: any) => `${element.status_flag}` },
    { columnDef: 'lookup_type', header: 'Domain name', cell: (element: any) => `${element.lookup_type}` },
    { columnDef: 'lookup_value_alias', header: 'Domain Alias', cell: (element: any) => `${element.lookup_value_alias}` },
    { columnDef: 'lookup_type_description', header: 'Domain Description', cell: (element: any) => `${element.lookup_type_description}` },
    { columnDef: 'validation_flag', header: 'Validation Domain', cell: (element: any) => `${element.validation_flag}` },
    { columnDef: 'submission_domain_flag', header: 'Submission Domain', cell: (element: any) => `${element.submission_domain_flag}` },

    { columnDef: 'radio', header: 'Select', cell: (element: any) => `${element.radio}` },
    { columnDef: 'edit_domain', header: 'Amend', cell: (element: any) => `${element.edit}` },
  ];
  columnsToDisplay = this.columns.map(c => c.columnDef);
  tableData: any;


  columns1 = [
    { columnDef: 'status_flag', header: 'Active', cell: (element: any) => `${element.status_flag}` },
    { columnDef: 'Reference_Code', header: 'Reference_Code', cell: (element: any) => `${element.lookup_value_alias}` },
    { columnDef: 'lookup_value_name', header: 'Name', cell: (element: any) => `${element.lookup_value_name}` },
    { columnDef: 'lookup_value_description', header: 'Description', cell: (element: any) => `${element.lookup_value_description}` },
    { columnDef: 'tax_module_name', header: 'Tax Type', cell: (element: any) => `${element.tax_module_names}` },
    { columnDef: 'SARS_mapping_code', header: 'SARS Mapping', cell: (element: any) => `${element.SARS_mapping_code}` },
    { columnDef: 'editvalidation', header: 'Validation', cell: (element: any) => `${element.editvalidation}` },
    { columnDef: 'newedit', header: 'Amend', cell: (element: any) => `${element.newedit}` },
  ];
  columnsToDisplay1 = this.columns1.map(c => c.columnDef);
      /*  
.......................................................................................................
* This is the ngOnInit function

* ngOnInit() is used to get domian referance name and open dialog
.......................................................................................................
*/
  ngOnInit(): void {    
    this.GetDomainRefNameData();

    this.subscription.add(this.adminsystemsetupservice.CTSEvents.subscribe(x => {
      this.lookup = x;
    }));

    this.subscription.add(this.adminsystemsetupservice.editdomain.subscribe(x => {
      this.lookup = x;
      this.openDialog(1);
    }));
    this.subscription.add(this.adminsystemsetupservice.neweditdtax.subscribe(x => {
      this.lookup = x;
      this.openDialog2(1);
    }));
    
  }
  
      /*  
.......................................................................................................
* This is the SelectCurrentPage function

* @param selection is Selection model 

* SelectCurrentPage() is used to set current page
.......................................................................................................
*/
  SelectCurrentPage(event: any) {
    this.pageIndex = event;
    this.getDomainName.Page = this.pageIndex

    this.selection = new SelectionModel<any>(true, [])
    this.GetDomainRefNameData()

  }

       /*  
.......................................................................................................
* This is the AddSourcePop function

* AddSourcePop() is used to add source pop
.......................................................................................................
*/
  AddSourcePop() {
    if(this.dialog.openDialogs.length==0){
    this.dialogRef = this.dialog.open(AddnewDomain, { width: '40.62%' });
    this.dialogRef.afterClosed().subscribe(result => {
      this.GetDomainRefNameData()
    });
  }
  }

/*  
.......................................................................................................
* This is the AddDomainValuePop function

* AddDomainValuePop() is used to add domain value
.......................................................................................................
*/
  AddDomainValuePop() {
    if (this.GetLookIduser > 0) {
      if(this.dialog.openDialogs.length==0){
      const dialogRef = this.dialog.open(AddDomainAllowedValueComponent, {
        data: {
          DomainValues: this.GetLook,
        }, width: '40.62%'
      });
      dialogRef.afterClosed().subscribe(result => {
        this.GetDomainRefValues()
      });
    }
    } else {
      setTimeout(() => {
        this.toastr.error("Select Domain to Add")
      }, 500);              
  }
  }

  /*  
.......................................................................................................
* This is the openDialog function

* openDialog() is used to open dialog
.......................................................................................................
*/
  openDialog(event: any) {
    if(this.dialog.openDialogs.length==0){
    const dialogRef = this.dialog.open(AddnewDomain, {
      data: {
        isUpdate: "edit",
        message: "Error!!!",
        DomainValues: this.GetLook,
        lookup: this.lookup,
      }, width: '40.63%',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.GetDomainRefNameData()
    });
  }
  }

    /*  
.......................................................................................................
* This is the highlightRow function

* highlightRow() is used to highlight row
.......................................................................................................
*/

  highlightRow(row: any) {
    this.selection3.clear();
    this.selection3.select(row)
  }

    /*  
.......................................................................................................
* This is the openDialog2 function

* openDialog2() is used to open dialog
.......................................................................................................
*/
  openDialog2(row: any) {
    this.lookup = row;
    if(this.dialog.openDialogs.length==0){
    const dialogRef = this.dialog.open(AddDomainAllowedValueComponent, {
      data: {
        isUpdate: "edit",
        message: "Error!!!",
        lookup: this.lookup,
        DomainValues: this.GetLook,
      }, width: '50%',
    });
    dialogRef.afterClosed().subscribe(result => {
      this.GetDomainRefValues()
    });
  }

  }

    /*  
.......................................................................................................
* This is the openValidationDialog function

* openValidationDialog() is used to open validation dialog
.......................................................................................................
*/
  openValidationDialog(row: any) {
    if(this.dialog.openDialogs.length==0){
    const dialogRef = this.dialog.open(AddValidationsComponent, {
      data: {


        DomainValue: row,
      }, width: '40.62%',
    });
    dialogRef.afterClosed().subscribe(result => {
      this.GetDomainRefValues()
    });
  }

  }

    /*  
.......................................................................................................
* This is the SelectcheckBoxChnage function

* SelectcheckBoxChnage() is used to selection check box change
.......................................................................................................
*/
  SelectcheckBoxChnage(selection: SelectionModel<TableData>) {
    this.newItem = [];
    this.newItem = selection.selected
    if (this.newItem.length > 0) {
      this.isSelectedDomainValue = true;
    }
    else {
      this.isSelectedDomainValue = false;
    }
    this.UserIds = [];
    for (let user of this.newItem) {
      this.UserIds.push(user.lookup_type_id);
      this.username = user.lookup_type
      this.GetLookIduser = user.lookup_type_id;
      this.GetLookTaxid = user.tax_module_id;
      this.lookupalias = user.lookup_value_name;

    }
    if (this.username.length > 0 || this.totalSelectedRowdata>0) {
      this.isSelectedSaveChange = true;
    }
    else {
      this.isSelectedSaveChange = false;
    }

    if (this.username.length > 0) {
      this.isSelectedDomainValue = true;
    }
    else {
      this.isSelectedDomainValue = false;
    }

  }
   /*  
.......................................................................................................
* This is the selectedDomainValues function

* selectedDomainValues() is used to selection domain values
.......................................................................................................
*/
  selectedDomainValues() {
    this.newItem = [];
    this.newItem = this.selection2.selected
     this.UserIds = [];
    for (let user of this.newItem) {
      this.UserIds.push(user.lookup_value_id);
      this.username = user.lookup_type
      this.GetLookIduser = user.lookup_type_id;
      this.GetLookTaxid = user.tax_module_id;
      this.lookupalias = user.lookup_value_name;

    }
    if (this.newItem.length > 0 || this.totalSelectedRowdata>0) {
      this.isSelectedDomainValue = true;
    }
    else {
      this.isSelectedDomainValue = false;
    }
  }
   /*  
.......................................................................................................
* This is the GetDomainRefNameData function

* GetDomainRefNameData() is used to get domain ref name data
.......................................................................................................
*/
  GetDomainRefNameData() {
      this.loading = true;
    this.getDomainName.Size = 7;
    this.getDomainName.SearchText = "";
    this.getDomainName.lookup_type = "Domain Definition";
    this.adminsystemsetupservice.GetDomainRefNameById(this.getDomainName).subscribe(DoaminRefNamedata => {
      this.tableData = DoaminRefNamedata.data;
      this.totalRowdata = this.tableData[0].totalrows
      this.totalSelectedRowdata = this.tableData[0].totalselectedrows
      this.Gotlookup_type_id = this.tableData.lookup_type_id;
      this.loading = false;
    }, (error) => {
      this.loading = false;
    });
  }
     /*  
.......................................................................................................
* This is the SelectRadioChnage function

* SelectRadioChnage() is used to select radio box
.......................................................................................................
*/
  SelectRadioChnage(row: any) {
    this.GetLook = row;
    this.GetLookIduser = row.lookup_type_id;
    this.GetDomainRefValues()
       if (this.GetLookIduser > 0) {
      this.isRadioSaveChange = true;
    }
    else {
      this.isRadioSaveChange = false;
    }

  }

       /*  
.......................................................................................................
* This is the GetDomainRefValues function

* GetDomainRefValues() is used to get domain referance values
.......................................................................................................
*/
  GetDomainRefValues() {
      this.loading = true;
      this.getDomainvalue.lookup_type_id = this.GetLookIduser;
      this.getDomainvalue.Page = this.pageIndexDomainValue;
      this.getDomainvalue.Size = 7;
      this.getDomainvalue.SearchText = "";
      this.getDomainvalue.SearchText = "";
      // HTTP API call
      this.adminsystemsetupservice.GetDomainValuesById(this.getDomainvalue).subscribe(DoaminRefNamedata => {
      this.tableData2 = DoaminRefNamedata.data;
      
      this.totalSelectedRowdata = this.tableData2[0].totalselectedrows
      this.totalRecords = this.tableData2[0].totalrows
      let response = DoaminRefNamedata;
      if (response.Statuscode == 200) {
        this.tableData2 = DoaminRefNamedata.data;
        this.dataSource2 = new MatTableDataSource<any>(
          this.tableData2.slice(0, this.size)
        );
        this.selection2 = new SelectionModel<any>(true, this.tableData2.filter(t => t.status_flag));
        this.totalPages=this.tableData2[0].totalrows/this.size;
        this.totalPages=Math.ceil(this.totalPages);
        this.rearrangePaging();
        this.loading = false;
      }
      else {
        this.tableData2 = [];
        this.dataSource2 = new MatTableDataSource<any>(
          this.tableData2.slice(0, this.size)
        );
        this.loading = false;
      }
    }, (error) => {
      this.tableData2 = [];
      this.dataSource2 = new MatTableDataSource<any>(
        this.tableData2.slice(0, this.size)
      );
      this.loading = false;
    });
  }

/*  
.......................................................................................................
* This is the SaveDomainRefName function

* SaveDomainRefName() is used to save domain refrance name
.......................................................................................................
*/
  SaveDomainRefName() {
    this.loading = true;
    this.lookup.ids = this.UserIds;
    this.lookup.lookup_type_name = "Domain Definition";
    this.lookup.Page = this.pageIndex;
    this.lookup.Size = this.size;
    this.lookup.totalselectedrows = this.totalSelectedRowdata;
    this.adminsystemsetupservice.SaveDomainRefName(this.lookup).subscribe(
      (response) => {
        if (response.Statuscode === 200) {
          this.loading = false;
          this.Success = true;
          this.isSelectedSaveChange = false;
          this.toastr.success(response.Message);
          this.GetDomainRefNameData()
        }
      },
      (error) => {
        this.loading = false;
        this.isInvalid = true;
        this.labelError = error.error.Message;
      }
    );
  }

   /*  
.......................................................................................................
* This is the SaveDataDomainRefValues function

* SaveDataDomainRefValues() is used to save domain refrance values
.......................................................................................................
*/
  SaveDataDomainRefValues() {
    this.loading = true;
    this.saveDomainRefData.Ids = this.UserIds;
    this.saveDomainRefData.lookup_type_name = this.GetLookIduser.toString();
    this.saveDomainRefData.page = this.pageIndexDomainValue;
    this.saveDomainRefData.size = this.size;
    this.saveDomainRefData.totalselectedrows = this.totalSelectedRowdata;
    //HTTP API call
    this.adminsystemsetupservice.SaveDomainReValues(this.saveDomainRefData).subscribe(
      (response) => {
        if (response.Statuscode === 200) {
          this.loading = false;
          this.Success = true;
          this.isSelectedDomainValue = false;
          this.GetDomainRefValues()
          this.toastr.success(response.Message);
        }
      },
      (error) => {
        this.loading = false;
        this.isInvalid = true;
      }
    );
  }
   /*  
.......................................................................................................
* This is the paginate1 function

* @param selection is Selection model 

* paginate1() is used to set paginate
.......................................................................................................
*/
  paginate1(event: any) {
    this.pageIndexDomainValue = event;
    this.currentPage=event;
    this.GetDomainRefValues()
    this.dataSource2 = new MatTableDataSource<any>(
      this.tableData2.slice(event * this.size - this.size, event * this.size)
    );
    this.rearrangePaging();
  }
  /*  
.......................................................................................................
* This is the  rearrangePaging function 

* rearrangePaging() used to rearranging page
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

}


@Component({
  selector: 'add-domain-dialog',
  templateUrl: './addNew-domain.html',
  styleUrls: ['./domain-references.component.css']
})
export class AddnewDomain {
  public loadingTemplate: TemplateRef<any>;
  public loading = false;
  addDomainName: AddNewDomain;
  submitted = false;
  isInvalid: boolean;
  Success: any;
  successMessage: any;
  labelError: string;
  isUpdatebtn: boolean = false;
  Alias_readonly: boolean = false;
  messaging: AddNewDomain;
  AddDomainRefForm: FormGroup;
  textChanged: boolean = false;
  GetDomain:any;
  constructor(private formBuilder: FormBuilder, public adminsystemsetupservice: AdminSystemsetupService,
     public dialogRef: MatDialogRef<AddnewDomain>, private toastr: ToastrService, public router: Router, @Inject(MAT_DIALOG_DATA) private data: any, public validation: ValidationsetupService) {
    if (data) {
      if (data.isUpdate == 'edit') {
        this.isUpdatebtn = true;
        this.Alias_readonly = true;
      }
      this.addDomainName = data.lookup.row;
      this.textChanged = false;
    }
  }
    /*  
.......................................................................................................
* This is the ngOnInit function 

* ngOnInit() used to build form and set validations
.......................................................................................................
*/
  ngOnInit() {
    this.AddDomainRefForm = this.formBuilder.group({
      lookup_type: new FormControl('',
        [
          Validators.required,
          Validators.pattern(this.validation.validationsArray.domainAndReference.addDomain.domainName.pattern),
          Validators.maxLength(this.validation.validationsArray.domainAndReference.addDomain.domainName.maxLength),
          Validators.minLength(this.validation.validationsArray.domainAndReference.addDomain.domainName.minLength)
        ]
      ),
      lookup_value_alias: new FormControl('',
        [
          Validators.required,
          Validators.pattern(this.validation.validationsArray.domainAndReference.addDomain.domainAlias.pattern),
          Validators.maxLength(this.validation.validationsArray.domainAndReference.addDomain.domainAlias.maxLength),
          Validators.minLength(this.validation.validationsArray.domainAndReference.addDomain.domainAlias.minLength)
        ]
      ),
      lookup_type_description: new FormControl('',
        [
          Validators.pattern(this.validation.validationsArray.domainAndReference.addDomain.domainDescription.pattern),
          Validators.maxLength(this.validation.validationsArray.domainAndReference.addDomain.domainDescription.maxLength),
          Validators.minLength(this.validation.validationsArray.domainAndReference.addDomain.domainDescription.minLength)
        ]
      ),
      submission_domain_flag: new FormControl('',),
      validation_domain_flag: new FormControl('',)
    });
    if(this.isUpdatebtn)
    {
      this.AddDomainRefForm.controls.lookup_type.setValue(this.addDomainName.lookup_type);
      this.AddDomainRefForm.controls.lookup_value_alias.setValue(this.addDomainName.lookup_value_alias);
      this.AddDomainRefForm.controls.lookup_type_description.setValue(this.addDomainName.lookup_type_description);
      this.AddDomainRefForm.controls.submission_domain_flag.setValue(this.addDomainName.submission_domain_flag);
      this.AddDomainRefForm.controls.validation_domain_flag.setValue(this.addDomainName.validation_flag);
    }else{
      this.AddDomainRefForm.controls.validation_domain_flag.setValue(false);
      this.AddDomainRefForm.controls.submission_domain_flag.setValue(false);
    }
    
     
                           
      this.AddDomainRefForm.valueChanges.subscribe((value) => {
         
        this.textChanged= true;
      })
  
  }
     /*  
.......................................................................................................
* This is the validate function 

* validate() used to text change trigre
.......................................................................................................
*/
  validate(){
     
    this.textChanged= true;
  }

       /*  
.......................................................................................................
* This is the f function 

* f() used to build form status and validations
.......................................................................................................
*/
  get f() {
    return this.AddDomainRefForm.controls;
  }
       /*  
.......................................................................................................
* This is the AddDomainRefName function 

* AddDomainRefName() used to add domain refrance name
.......................................................................................................
*/
  AddDomainRefName() {
    
    this.loading = true;
    this.submitted = true;
    this.addDomainName = this.addDomainName ? this.addDomainName : this.AddDomainRefForm.value;
    if (this.AddDomainRefForm.invalid) {
      this.isInvalid = true;
    }
    this.addDomainName.lookup_type_id = (this.addDomainName.lookup_type_id?.toString() == "") ? 0 : this.addDomainName.lookup_type_id;
    this.addDomainName.lookup_type="Domain Definition";
    this.addDomainName.submission_domain_flag = this.AddDomainRefForm.get('submission_domain_flag')?.value;
    this.addDomainName.validation_flag = this.AddDomainRefForm.get('validation_domain_flag')?.value;
    this.addDomainName.lookup_name = this.AddDomainRefForm.get('lookup_type')?.value;
    this.addDomainName.lookup_value_alias = this.AddDomainRefForm.get('lookup_value_alias')?.value;
    this.addDomainName.lookup_type_description = this.AddDomainRefForm.get('lookup_type_description')?.value;
    this.adminsystemsetupservice.AddDomainRefData(this.addDomainName).subscribe(
      (response) => {
        if (response.Statuscode === 200) {
          this.loading = false;
          this.Success = true;
          this.dialogRef.close();
          this.toastr.success(response.Message);
        }else if(response.Statuscode === 300)
        {
          setTimeout(() => {
            this.toastr.error(response.Message);
          }, 500);             
        }
      },
      (error) => {
        this.loading = false;
        this.isInvalid = true;
        setTimeout(() => {
          this.toastr.error(error.error.Message); 
        }, 500);              
        this.dialogRef.close();
      
        this.labelError = error.error.Message;
      }
    );
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