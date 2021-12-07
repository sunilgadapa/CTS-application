import { Component, OnInit, ViewChild, Inject,  TemplateRef,Injector  } from "@angular/core";
import { FormGroup, FormBuilder, Validators,  FormControl } from '@angular/forms';
import { MatDialog,  MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminSystemsetupService } from '../../../../_services/admin/adminsystemsetup.service';
import { UsermanagmentService } from "../../../../_services/userManagement/usermanagment.service";
import { ToastrService } from 'ngx-toastr';
import { AddDomainValu } from '../../../../_models/domainRef';
import { MatOption } from "@angular/material/core";
import { ValidationsetupService } from "../../../../_services/common/validationsetup.service";

@Component({
  selector: 'app-add-domain-allowed-value',
  templateUrl: './add-domain-allowed-value.component.html',
  styleUrls: ['./add-domain-allowed-value.component.css']
})
export class AddDomainAllowedValueComponent implements OnInit {
  public loadingTemplate: TemplateRef<any>;
  public loading = false;
  statusddl: boolean = false;
  addDomainValue: AddDomainValu;
  submitted = false;
  isInvalid: boolean;
  Tax_modules: any;
  Success: any;
  successMessage: any;
  labelError: string;
  isUpdatebtn: boolean = false;
  messaging: AddDomainValu;
  AddDomainValueForm: FormGroup;
  tableData: any[] = [];
  Domain_iddata: any;
  Domain_data: any;
  domainsubFlag:any;
  Gotlookup_type_id = 0;
  Gotlookup_value_id = 0;
  tax_module_ids: any[] = [];
  taxdata: number
  textChanged: boolean=false;
  subFlag=false;
public validation: ValidationsetupService;
private toastr: ToastrService;
  constructor(@Inject(MAT_DIALOG_DATA) private data: any, public dialogRef: MatDialogRef<AddDomainAllowedValueComponent>, public dialog: MatDialog,
    public userManagementService: UsermanagmentService,
   private injector : Injector,
    public adminsystemsetupservice: AdminSystemsetupService, private formBuilder: FormBuilder) {
      this.validation = injector.get<ValidationsetupService>(ValidationsetupService);
      this.toastr = injector.get<ToastrService>(ToastrService);
    if (data) {
      this.textChanged = false;
      if (data.isUpdate == 'edit') {
        this.isUpdatebtn = true;
        this.addDomainValue = data.lookup;
        this.Domain_data = data.lookup;

this.domainsubFlag=data.DomainValues
        if (this.Domain_data.tax_module_ids != null) {
          var temp2 = this.Domain_data.tax_module_ids.replace(/["']/g, "");
          var nameArr2 = temp2.split(',');
          for (let roleId of nameArr2) {
            this.tax_module_ids.push(parseInt(roleId))
          }
        }

      } else {
        console.log(data.DomainValues);
        this.Domain_data = data.DomainValues;
        this.domainsubFlag=data.DomainValues
      }
    }

  }
  @ViewChild('allSelected') private allSelected: MatOption;

   /*  
.......................................................................................................
  * This is the ngOnInit function

  * ngOnInit function used for initaliasing form and validations
.......................................................................................................
*/ 
  ngOnInit() {
    this.getTaxModuleData();
if(this.domainsubFlag.submission_domain_flag)
{
  this.subFlag=true;
  this.AddDomainValueForm = this.formBuilder.group({
    lookup_value_name: new FormControl('',
      [
        Validators.required,
        Validators.pattern(this.validation.validationsArray.domainAndReference.addDomainValue.domainValueName.pattern),
        Validators.maxLength(this.validation.validationsArray.domainAndReference.addDomainValue.domainValueName.maxLength),
        Validators.minLength(this.validation.validationsArray.domainAndReference.addDomainValue.domainValueName.minLength)
      ]),
    lookup_value_alias: new FormControl('',
      [
        Validators.required,
        Validators.pattern(this.validation.validationsArray.domainAndReference.addDomainValue.reference_Code.pattern),
        Validators.maxLength(this.validation.validationsArray.domainAndReference.addDomainValue.reference_Code.maxLength),
        Validators.minLength(this.validation.validationsArray.domainAndReference.addDomainValue.reference_Code.minLength)
      ]
    ),
    tax_module_id: new FormControl('', Validators.required),
    lookup_value_description: new FormControl('',
      [
  
        Validators.pattern(this.validation.validationsArray.domainAndReference.addDomainValue.domainValueDiscription.pattern),
        Validators.maxLength(this.validation.validationsArray.domainAndReference.addDomainValue.domainValueDiscription.maxLength),
        Validators.minLength(this.validation.validationsArray.domainAndReference.addDomainValue.domainValueDiscription.minLength)
      ]
    ),
    SARS_mapping_code: new FormControl('',
      [Validators.required,
      Validators.pattern(this.validation.validationsArray.domainAndReference.addDomainValue.SARS_Mapping.pattern),
      Validators.maxLength(this.validation.validationsArray.domainAndReference.addDomainValue.SARS_Mapping.maxLength),
      Validators.minLength(this.validation.validationsArray.domainAndReference.addDomainValue.SARS_Mapping.minLength)
      ]
    ),

  });
}else
{
  this.subFlag=false;
  this.AddDomainValueForm = this.formBuilder.group({
    lookup_value_name: new FormControl('',
      [
        Validators.required,
        Validators.pattern(this.validation.validationsArray.domainAndReference.addDomainValue.domainValueName.pattern),
        Validators.maxLength(this.validation.validationsArray.domainAndReference.addDomainValue.domainValueName.maxLength),
        Validators.minLength(this.validation.validationsArray.domainAndReference.addDomainValue.domainValueName.minLength)
      ]),
    lookup_value_alias: new FormControl('',
      [
        Validators.required,
        Validators.pattern(this.validation.validationsArray.domainAndReference.addDomainValue.reference_Code.pattern),
        Validators.maxLength(this.validation.validationsArray.domainAndReference.addDomainValue.reference_Code.maxLength),
        Validators.minLength(this.validation.validationsArray.domainAndReference.addDomainValue.reference_Code.minLength)
      ]
    ),
    tax_module_id: new FormControl('', Validators.required),
    lookup_value_description: new FormControl('',
      [
  
        Validators.pattern(this.validation.validationsArray.domainAndReference.addDomainValue.domainValueDiscription.pattern),
        Validators.maxLength(this.validation.validationsArray.domainAndReference.addDomainValue.domainValueDiscription.maxLength),
        Validators.minLength(this.validation.validationsArray.domainAndReference.addDomainValue.domainValueDiscription.minLength)
      ]
    ),
    SARS_mapping_code: new FormControl('',
      [
      Validators.pattern(this.validation.validationsArray.domainAndReference.addDomainValue.SARS_Mapping.pattern),
      Validators.maxLength(this.validation.validationsArray.domainAndReference.addDomainValue.SARS_Mapping.maxLength),
      Validators.minLength(this.validation.validationsArray.domainAndReference.addDomainValue.SARS_Mapping.minLength)
      ]
    ),

  });
}
   
    this.AddDomainValueForm.controls.lookup_value_alias.setValue(this.addDomainValue.lookup_value_alias);
    this.AddDomainValueForm.controls.lookup_value_name.setValue(this.addDomainValue.lookup_value_name);
    this.AddDomainValueForm.controls.tax_module_id.setValue(this.addDomainValue.tax_module_id);
    this.AddDomainValueForm.controls.lookup_value_description.setValue(this.addDomainValue.lookup_value_description);
    this.AddDomainValueForm.controls.SARS_mapping_code.setValue(this.addDomainValue.SARS_mapping_code);
    setTimeout(()=>{                          
      this.AddDomainValueForm.valueChanges.subscribe(() => {
        this.textChanged= true;
      })
    }, 2000);
  }

   /*  
.......................................................................................................
  * This is the f function

  * f function used for validation trigre
.......................................................................................................
*/
  get f() {
    return this.AddDomainValueForm.controls;
  }

    /*  
.......................................................................................................
  * This is the AddDomainValue function

  * AddDomainValue function used to set domain values
.......................................................................................................
*/
  AddDomainValue() {
    this.loading = true;
     this.submitted = true;
    this.addDomainValue = this.addDomainValue ? this.addDomainValue : this.AddDomainValueForm.value;
    if (this.AddDomainValueForm.invalid) {
      this.isInvalid = true;
    }
    this.addDomainValue.lookup_type_id = this.Domain_data.lookup_type_id;
    this.addDomainValue.lookup_value_id = (this.addDomainValue.lookup_value_id?.toString() == undefined) ? 0 : this.addDomainValue.lookup_value_id;
    this.addDomainValue.tax_module_id = this.tax_module_ids;
    this.addDomainValue.lookup_value_alias = this.AddDomainValueForm.get('lookup_value_alias')?.value;
    this.addDomainValue.lookup_value_name = this.AddDomainValueForm.get('lookup_value_name')?.value;
    this.addDomainValue.lookup_value_description = this.AddDomainValueForm.get('lookup_value_description')?.value;
    this.addDomainValue.SARS_mapping_code = this.AddDomainValueForm.get('SARS_mapping_code')?.value;
    
    if (this.AddDomainValueForm.valid) {
      this.adminsystemsetupservice.AddaddDomainValueEvent(this.addDomainValue).subscribe(
        (response) => {
          if (response.Statuscode === 200) {
            this.loading = false;
            this.Success = true;
            this.dialogRef.close();
            this.toastr.success(response.Message);          
          }
        },
        (error) => {
          this.loading = false;
          this.isInvalid = true;
          setTimeout(() => {
            this.toastr.error(error.error.Message); 
          }, 500);              
          this.dialogRef.close();
        }
      );
    }
  }

   /*  
.......................................................................................................
  * This is the getTaxModuleData function

  * getTaxModuleData function used for HTTP API call to get tax module data
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
  * This is the onNoClick function

  * onNoClick function used to close dialog box
.......................................................................................................
*/
  onNoClick() {
    this.dialogRef.close();
  }

  /*  
.......................................................................................................
  * This is the toggleArrow function

  * toggleArrow() function used to switch select dropdown arrow
.......................................................................................................
*/
  toggleArrow() {
    this.statusddl = this.statusddl === true ? false : true;
  }

   /*  
.......................................................................................................
  * This is the toggleAllFileType function

  * toggleAllFileType() function used to toggle all file types
.......................................................................................................
*/
  toggleAllFileType() {

    if (this.allSelected.selected) {
      this.AddDomainValueForm.controls.tax_module_id
        .patchValue([...this.Tax_modules.map((item: any) => item.lookup_value_id), 0]);
    } else {
      this.AddDomainValueForm.controls.tax_module_id.patchValue([]);
    }
  }
  /*  
.......................................................................................................
  * This is the  tossleFileTyp function

  *  tossleFileTyp function used to tossle all file types
.......................................................................................................
*/
  tossleFileType() {
    if (this.allSelected.selected) {
      this.allSelected.deselect();
      return false;
    }
    if ( this.AddDomainValueForm.controls.tax_module_id.value.length == this.Tax_modules.length)
      this.allSelected.select();
    return true;
  }


}
