import { Component, OnInit,  Inject,  TemplateRef,Injector } from "@angular/core";
import { FormGroup, FormBuilder, Validators,  FormControl } from '@angular/forms';
import { MatDialog,  MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminSystemsetupService } from '../../../../_services/admin/adminsystemsetup.service';
import { UsermanagmentService } from "../../../../_services/userManagement/usermanagment.service";
import { ToastrService } from 'ngx-toastr';
import { ValidationsetupService } from "../../../../_services/common/validationsetup.service";
@Component({
  selector: 'app-add-validations',
  templateUrl: './add-validations.component.html',
  styleUrls: ['./add-validations.component.css']
})
export class AddValidationsComponent implements OnInit {
  domainSelected:number=1;
  public loadingTemplate: TemplateRef<any>;
  public loading = false;
  statusddl1: boolean = false;
  statusddl2: boolean = false;
  AddDomainValueValidation: FormGroup;
  domainValue: any;
  patternList: any[] = [];
  validationSaveRequest = {
    LookupValueId: 0,
    MinLength: 0,
    MaxLength: 0,
    PatternId: 0,
    LookupTypeId: 0
  }
  domainList: any[] = [];
  public validation: ValidationsetupService;
  private toastr: ToastrService;
  constructor(@Inject(MAT_DIALOG_DATA) private data: any, public dialogRef: MatDialogRef<AddValidationsComponent>, public dialog: MatDialog,
    public userManagementService: UsermanagmentService,
      private injector : Injector,
    public adminsystemsetupservice: AdminSystemsetupService, private formBuilder: FormBuilder) {
      this.validation = injector.get<ValidationsetupService>(ValidationsetupService);
      this.toastr = injector.get<ToastrService>(ToastrService);
    this.domainValue = data;
    this.adminsystemsetupservice.GetValidationRule(this.domainValue.DomainValue.lookup_value_id).subscribe(
      (response) => {
        this.AddDomainValueValidation.controls.maxLength.setValue(response.data[0].MaxLength);
        this.AddDomainValueValidation.controls.minLength.setValue(response.data[0].MinLength);
        this.AddDomainValueValidation.controls.pattern.setValue(response.data[0].PatternId);
        this.AddDomainValueValidation.controls.domain.setValue(response.data[0].LookupTypeId);
        if (response.data[0].LookupTypeId != null) {
          this.domainSelected=2;
          this.AddDomainValueValidation.controls['maxLength'].disable();
          this.AddDomainValueValidation.controls['minLength'].disable();
          this.AddDomainValueValidation.controls['pattern'].disable()
        } else {
          this.domainSelected=3;
          this.AddDomainValueValidation.controls['domain'].disable();
        }
      }
    )
  }

    /*  
.......................................................................................................
* This is the selectDomain function

* selectDomain() is used to select domain
.......................................................................................................
*/
  selectDomain() {
    this.domainSelected=2;
    this.AddDomainValueValidation.controls['maxLength'].disable();
    this.AddDomainValueValidation.controls['minLength'].disable();
    this.AddDomainValueValidation.controls['pattern'].disable()
  }

   /*  
.......................................................................................................
* This is the selectValidation function

* selectValidation() is used to select validation
.......................................................................................................
*/
  selectValidation() {
    this.domainSelected=3;
    this.AddDomainValueValidation.controls['domain'].disable();
  }

   /*  
.......................................................................................................
* This is the ngOnInit function

* ngOnInit() is used to build form and validation
.......................................................................................................
*/
  ngOnInit(): void {

    this.AddDomainValueValidation = this.formBuilder.group({
      maxLength: new FormControl('',
        [
          Validators.required,
          Validators.pattern(this.validation.validationsArray.domainAndReference.addValidation.maxLength.pattern),
          Validators.maxLength(this.validation.validationsArray.domainAndReference.addValidation.maxLength.maxLength),
          Validators.minLength(this.validation.validationsArray.domainAndReference.addValidation.maxLength.minLength)
        ]),
      minLength: new FormControl('',
        [
          Validators.required,
          Validators.pattern(this.validation.validationsArray.domainAndReference.addValidation.minLength.pattern),
          Validators.maxLength(this.validation.validationsArray.domainAndReference.addValidation.minLength.maxLength),
          Validators.minLength(this.validation.validationsArray.domainAndReference.addValidation.minLength.minLength)
        ]
      ),
      pattern: new FormControl('', Validators.required),
      domain: new FormControl('', Validators.required),
    })

  }

    /*  
.......................................................................................................
* This is the onNoClick function

* onNoClick() is used to close dialog box
.......................................................................................................
*/
  onNoClick() {
    this.dialogRef.close();
  }

      /*  
.......................................................................................................
* This is the toggleArrow1 function

* toggleArrow1() is used to toggle
.......................................................................................................
*/
  toggleArrow1() {
    this.statusddl1 = this.statusddl1 === true ? false : true;
  }
       /*  
.......................................................................................................
* This is the toggleArrow2 function

* toggleArrow2 is used to toggle
.......................................................................................................
*/
  toggleArrow2() {
    this.statusddl2 = this.statusddl2 === true ? false : true;
  }
       /*  
.......................................................................................................
* This is the f function

* f is used to catch form validations
.......................................................................................................
*/
  get f() {
    return this.AddDomainValueValidation.controls;
  }

       /*  
.......................................................................................................
* This is the ngAfterViewInit function

* ngAfterViewInit() is used to get validation type
.......................................................................................................
*/
  ngAfterViewInit() {
    this.adminsystemsetupservice.GetValidationType('pattern').subscribe(
      (response) => {
        this.patternList = response.data
      })

    this.adminsystemsetupservice.GetValidationType('domain').subscribe(
      (response) => {
        this.domainList = response.data
      })
  }
      /*  
.......................................................................................................
* This is the saveValidations function

* saveValidations() is used to save validations
.......................................................................................................
*/
  saveValidations() {
    this.loading = true;
      this.validationSaveRequest.LookupValueId = this.domainValue.DomainValue.lookup_value_id;
      this.validationSaveRequest.MaxLength = parseInt(this.AddDomainValueValidation.get('maxLength')?.value);
      this.validationSaveRequest.MinLength = parseInt(this.AddDomainValueValidation.get('minLength')?.value);
      this.validationSaveRequest.PatternId = parseInt(this.AddDomainValueValidation.get('pattern')?.value);
      this.validationSaveRequest.LookupTypeId = parseInt(this.AddDomainValueValidation.get('domain')?.value);
      this.adminsystemsetupservice.SaveValidationRule(this.validationSaveRequest).subscribe((response) => {
        if (response.Statuscode === 200) {
          this.loading = false;
          this.toastr.success(response.Message);
          this.dialogRef.close();
        }
      }, (error) => {
        this.loading = false;
      })
    
  }
}
