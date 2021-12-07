import { Component, OnInit, Inject, TemplateRef,Injector } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AdminSystemsetupService } from '../../../../_services/admin/adminsystemsetup.service';
import { ToastrService } from 'ngx-toastr';
import { ValidationsetupService } from "../../../../_services/common/validationsetup.service";
import { UsermanagmentService } from "src/app/_services/userManagement/usermanagment.service";
import { DatePipe } from "@angular/common";
import { PasmanualuploadService } from "src/app/_services/manualUpload/pasmanualupload.service";
@Component({
  selector: 'app-add-taxperiod',
  templateUrl: './add-taxperiod.component.html',
  styleUrls: ['./add-taxperiod.component.css']
})
export class AddTaxperiodComponent implements OnInit {
  taxModules: any[] = [];
  statusddl: boolean = false;
  statusddl1: boolean = false;
  addTaxData = {
    FileId: 0,
    TaxPeriodId: 0,
    TaxTypeId: 0,
    TaxYear: 0,
    TaxPeriodTypeId: 0,
    TaxPeriodDescription: "Test API 5",
    SubmissionStartDate: '',
    SubmissionEndDate: '',
    LandingStartDate: '',
    LandingEndDate: ''
  }
  taxPeriodTypes: any[] = [];
  taxPeriodType: any;
  public loadingTemplate: TemplateRef<any>;
  public loading = false;
  hide = true;
  datePlaceholder: any;
  model: any = {};
  IsErrorVisible: boolean = true;
  registerForm: FormGroup;
  submitted = false;
  taxYear_readonly = false;
  taxId: any;
  fileId: number;
  lookup: any;
  isInvalid: boolean;
  isUpdatebtn: boolean = false;
  lookup_value_id?: number;
  Success: any;
  successMessage: any;
  textChanged: boolean = false;
  toastr:ToastrService;
  validation:ValidationsetupService;
  adminsystemsetupservice:AdminSystemsetupService;
  constructor(
    private datePipe: DatePipe,
    private userManagementService: UsermanagmentService,
    private formBuilder: FormBuilder, public dialogRef: MatDialogRef<AddTaxperiodComponent>,
    public pasManualUploadService: PasmanualuploadService,
    private injector : Injector,
    @Inject(MAT_DIALOG_DATA) private data: any) {
      this.toastr = injector.get<ToastrService>(ToastrService);
      this.validation= injector.get<ValidationsetupService>(ValidationsetupService);
      this.adminsystemsetupservice= injector.get<AdminSystemsetupService>(AdminSystemsetupService);
      this.datePlaceholder = this.validation.validationsArray.dateMetaData.datePlaceholder;
    this.userManagementService.getLookupdata('Tax Module').subscribe(response => {
      //Make HTTP call to get API call
      this.taxModules = response;
      this.loading = false;
    }, (error) => {
      this.loading = false;
      setTimeout(() => {
        this.toastr.error('Something went wrong')
      }, 500);
    })

    this.userManagementService.getLookupdata('TaxPeriodType').subscribe(response => {
      this.taxPeriodTypes = response
    })

    this.registerForm = this.formBuilder.group({
      Tax_Module: new FormControl('',
        [
          Validators.required,

        ]),
      Submission_Type: new FormControl('',
        [
          Validators.required,

        ]),
      Tax_Year: new FormControl('',
        [
          Validators.required,
          Validators.pattern(this.validation.validationsArray.taxPeriod.addTaxPeriod.taxYear.pattern),
          Validators.minLength(this.validation.validationsArray.taxPeriod.addTaxPeriod.taxYear.minLength),
          Validators.maxLength(this.validation.validationsArray.taxPeriod.addTaxPeriod.taxYear.maxLength)
        ]),
      Tax_Period_Description: new FormControl('',
        [
          Validators.required,
          Validators.pattern(this.validation.validationsArray.taxPeriod.addTaxPeriod.description.pattern),
          Validators.minLength(this.validation.validationsArray.taxPeriod.addTaxPeriod.description.minLength),
          Validators.maxLength(this.validation.validationsArray.taxPeriod.addTaxPeriod.description.maxLength)
        ]
      ),
      Submission_Period1: new FormControl('',
        [
          Validators.required,

        ]),
      Submission_Period2: new FormControl('',
        [
          Validators.required,

        ]),
      Landing_Period1: new FormControl('',
        [
          Validators.required,

        ]),
      Landing_Period2: new FormControl('',
        [
          Validators.required,

        ]),
    });

    if (data) {
      if (data.isUpdate == 'edit') {
        this.isUpdatebtn = true;
        this.lookup = data.lookup.row;
        this.registerForm.controls.Tax_Year.setValue(this.lookup.TaxYear);
        this.registerForm.controls.Tax_Period_Description.setValue(this.lookup.TaxPeriodDescription);
        this.registerForm.controls.Landing_Period2.setValue(this.datePipe.transform(this.lookup.LandingEndDate, "yyyy-MM-dd"));
        this.registerForm.controls.Landing_Period1.setValue(this.datePipe.transform(this.lookup.LandingStartDate, "yyyy-MM-dd"));
        this.registerForm.controls.Submission_Period2.setValue(this.datePipe.transform(this.lookup.SubmissionEndDate, "yyyy-MM-dd"));
        this.registerForm.controls.Submission_Period1.setValue(this.datePipe.transform(this.lookup.SubmissionStartDate, "yyyy-MM-dd"));
        this.taxId = this.lookup.TaxTypeId;
        this.taxPeriodType = this.lookup.TaxPeriodTypeId;
        this.addTaxData.TaxPeriodId = this.lookup.TaxPeriodId;
        this.textChanged = false;
      }
      else if (data.isUpdate == 'addmissinginfo') {
        this.registerForm.controls.Tax_Year.setValue(data.lookup.MissingLookupValueName);
        this.taxYear_readonly = true
        this.fileId = data.fileId
      }

    }
  }

  ngOnInit() {

    setTimeout(() => {
      this.registerForm.valueChanges.subscribe(() => {
        this.textChanged = true;
      })
    }, 3000);
  }

  /*  
  ......................................................................................................
  * This is the f function
  
  * f is used to get status of Form
  .......................................................................................................
  */
  get f() {
    return this.registerForm.controls;
  }

  /*  
  .......................................................................................................
  * This is the addTaxPeriod function
  
  * addTaxPeriod is used to save the tax period
  .......................................................................................................
  */
  addTaxPeriod() {
    this.loading = true;
    this.submitted = true;

    if (this.registerForm.invalid) {
      this.isInvalid = true;
    }
    this.addTaxData.TaxYear = this.registerForm.get('Tax_Year')?.value;
    this.addTaxData.TaxPeriodDescription = this.registerForm.get('Tax_Period_Description')?.value;
    this.addTaxData.LandingEndDate = this.datePipe.transform(this.registerForm.get('Landing_Period2')?.value, "dd/MM/yyyy")!;
    this.addTaxData.LandingStartDate = this.datePipe.transform(this.registerForm.get('Landing_Period1')?.value, "dd/MM/yyyy")!;
    this.addTaxData.SubmissionStartDate = this.datePipe.transform(this.registerForm.get('Submission_Period1')?.value, "dd/MM/yyyy")!;
    this.addTaxData.SubmissionEndDate = this.datePipe.transform(this.registerForm.get('Submission_Period2')?.value, "dd/MM/yyyy")!;
    this.addTaxData.TaxTypeId = this.taxId;
    this.addTaxData.TaxPeriodTypeId = this.taxPeriodType
    this.addTaxData.FileId = this.fileId;
    if (this.taxYear_readonly) {
      this.AddTaxPeriodFromMissingInformation();
    }
    else {
      this.AddTaxPeriodFromSystemSetup();
    }
  }

  private AddTaxPeriodFromSystemSetup() {
    this.adminsystemsetupservice.AddEditTaxPeriodData(this.addTaxData).subscribe(
      (response) => {
        if (response.Statuscode === 200) {
          this.Success = true;
          this.loading = false;
          this.toastr.success(response.Message); 
          this.dialogRef.close();
        }
      }, (error) => {
        this.ErrorWhenAddingSrcSym(error);
      }
    );
  }

  private AddTaxPeriodFromMissingInformation() {
    this.pasManualUploadService.AddMissingTaxPeriodData(this.addTaxData,
    ).subscribe(
      (response) => {
        if (response.Statuscode === 200) {
          if (response.data == 1) {
            this.toastr.error(response.Message);
          }
          else {
            this.toastr.success(response.Message);
          }
          this.Success = true;
          this.loading = false;
          this.dialogRef.close();
        }
      },
      (error) => {
        this.ErrorWhenAddingSrcSym(error);
      }
    );
  }
  private ErrorWhenAddingSrcSym(error: any) {
    this.isInvalid = true;
    this.loading = false;
    setTimeout(() => {
      this.toastr.error(error.error.Message);
    }, 500);
    this.dialogRef.close();
  }
  /*  
  .......................................................................................................
  * This is the onNoClick function
  
  * onNoClick is used to close the pop up
  .......................................................................................................
  */
  onNoClick() {
    this.dialogRef.close();
  }

  toggleArrowTaxtype() {
    this.statusddl = this.statusddl === true ? false : true;
  }

  toggleArrowsubmitype() {
    this.statusddl1 = this.statusddl1 === true ? false : true;
  }
}
