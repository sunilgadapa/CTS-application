import { Component, OnInit, Inject, TemplateRef,Injector } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AdminSystemsetupService } from '../../../../_services/admin/adminsystemsetup.service';
import { LookupData } from "../../../../_models/LookupData";
import { UserData } from '../../../../_models/userData';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ValidationsetupService } from "../../../../_services/common/validationsetup.service";
import { PasmanualuploadService } from "src/app/_services/manualUpload/pasmanualupload.service";


@Component({
  selector: 'app-addtaxsourcecode',
  templateUrl: './addtaxsourcecode.component.html',
  styleUrls: ['./addtaxsourcecode.component.css']
})
export class AddtaxsourcecodeComponent implements OnInit {
  misc_value_id: any;
  statusddl: boolean = false;
  public loadingTemplate: TemplateRef<any>;
  public loading = false;
  hide = true;
  model: any = {};
  IsErrorVisible: boolean = true;
  public showPasswordOnPress: boolean = false;
  registerForm: FormGroup;
  submitted = false;
  userData: UserData;
  lookup: LookupData;
  isInvalid: boolean;
  labelError: string;
  isUpdatebtn: boolean = false;
  lookup_value_id?: number;
  Success: any;
  successMessage: any;
  DropdownData: any[] = [];
  textChanged: boolean = false;
  fileId: number;
  taxSourceCode_readonly = false;
  toastr:ToastrService;
  validation:ValidationsetupService;
  adminsystemsetupservice:AdminSystemsetupService;
  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<AddtaxsourcecodeComponent>,
    public pasManualUploadService: PasmanualuploadService,
    private injector : Injector,
    public router: Router, @Inject(MAT_DIALOG_DATA) private data: any) {
      this.toastr = injector.get<ToastrService>(ToastrService);
      this.validation= injector.get<ValidationsetupService>(ValidationsetupService);
      this.adminsystemsetupservice= injector.get<AdminSystemsetupService>(AdminSystemsetupService);
    let lookup_type_name = "SARS_INCOME_SOURCE_CODE"
    this.adminsystemsetupservice.GetMisseDropValues(lookup_type_name, "").subscribe(dropdownpdata => {
      this.DropdownData = dropdownpdata.data;
    });

    this.registerForm = this.formBuilder.group({
      lookup_value_name: new FormControl('',
        [
          Validators.required,
          Validators.pattern(this.validation.validationsArray.taxSourceCode.addTaxSourceCode.taxSourceCodeName.pattern),
          Validators.minLength(this.validation.validationsArray.taxSourceCode.addTaxSourceCode.taxSourceCodeName.minLength),
          Validators.maxLength(this.validation.validationsArray.taxSourceCode.addTaxSourceCode.taxSourceCodeName.maxLength)
        ]),
      misc_value: new FormControl('',
        [
          Validators.required,
        ]),
      lookup_value_description: new FormControl('',
        [
          Validators.minLength(this.validation.validationsArray.taxSourceCode.addTaxSourceCode.Description.minLength),
          Validators.maxLength(this.validation.validationsArray.taxSourceCode.addTaxSourceCode.Description.maxLength)
        ]
      )
    });
    if (data) {
      if (data.isUpdate == 'edit') {
        this.isUpdatebtn = true;
      } else if (data.isUpdate == 'addmissinginfo') {
        this.registerForm.controls.lookup_value_name.setValue(data.lookup.MissingLookupValueName);
        this.taxSourceCode_readonly = true
        this.fileId = data.fileId
      }
      this.lookup = data.lookup.row;
      this.textChanged = false;
    }
  }

  ngOnInit() {


    if (this.isUpdatebtn) {
      this.registerForm.controls.misc_value.disable();
    }

    this.registerForm.controls.misc_value.setValue(parseInt(this.lookup.misc_value));
    this.registerForm.controls.lookup_value_name.setValue(this.lookup.lookup_value_name);
    this.registerForm.controls.lookup_value_description.setValue(this.lookup.lookup_value_description);
    setTimeout(() => {
      this.registerForm.valueChanges.subscribe(() => {
        this.textChanged = true;
      })
    }, 300);
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
  * This is the TaxModuledata function
  
  * TaxModuledata is used to save the tax moudle
  .......................................................................................................
  */
  TaxModuledata() {
    this.loading = true;
    this.submitted = true;
    this.lookup = this.lookup ? this.lookup : this.registerForm.value;
    if (this.registerForm.invalid) {
      this.isInvalid = true;
    }
    this.lookup.lookup_value_id = (this.lookup.lookup_value_id?.toString() == undefined) ? 0 : this.lookup.lookup_value_id;
    this.lookup.lookup_type_name = 'Tax Source Code';
    this.lookup.lookup_value_name = this.registerForm.get('lookup_value_name')?.value;
    this.lookup.lookup_value_description = this.registerForm.get('lookup_value_description')?.value;
    let miscValue = this.registerForm.get('misc_value')?.value;
    this.lookup.misc_value = miscValue.toString();
    if (this.taxSourceCode_readonly) {
      this.SaveSourceCodeFromAddMissingInfo();
    }
    else {
      this.SaveSourceCodeFromSystemSetup();
    }
  }
  private SaveSourceCodeFromAddMissingInfo() {
    this.pasManualUploadService.AddMissingInformation(this.lookup.lookup_value_name,
      this.lookup.lookup_value_description,
      this.lookup.lookup_type_name,
      this.fileId,this.lookup.misc_value).subscribe(
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
          this.ErrorWhenAddingSrcCode(error);
        }
      );
  }

  private SaveSourceCodeFromSystemSetup() {
    this.adminsystemsetupservice.PostLookupdata(this.lookup).subscribe(
      (response) => {
        if (response.Statuscode === 200) {
          this.Success = true;
          this.loading = false;
          this.toastr.success(response.Message);
          this.dialogRef.close();
        }
      },
      (error) => {
        this.ErrorWhenAddingSrcCode(error);
      }
    );
  }

  private ErrorWhenAddingSrcCode(error: any) {
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
}
