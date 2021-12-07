import { Component, OnInit, Inject, TemplateRef,Injector } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminSystemsetupService } from '../../../../_services/admin/adminsystemsetup.service';
import { LookupData } from "../../../../_models/LookupData";
import { UserData } from '../../../../_models/userData';
import { Router } from '@angular/router';
import { Subscriber } from "rxjs";
import { ToastrService } from 'ngx-toastr';
import { ValidationsetupService } from "../../../../_services/common/validationsetup.service";
import { PasmanualuploadService } from "src/app/_services/manualUpload/pasmanualupload.service";


@Component({
  selector: 'app-add-product-code',
  templateUrl: './add-product-code.component.html',
  styleUrls: ['./add-product-code.component.css']
})
export class AddProductCodeComponent implements OnInit {
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
  srcName_readonly = false;
  Success: any;
  successMessage: any;
  isUpdatebtn: boolean = false;
  subscription = new Subscriber();
  textChanged: boolean = false;
  fileId: number;
  toastr:ToastrService;
  validation:ValidationsetupService;
  adminsystemsetupservice:AdminSystemsetupService;
  constructor(private injector : Injector,private formBuilder: FormBuilder, public dialogRef: MatDialogRef<AddProductCodeComponent>, public pasManualUploadService: PasmanualuploadService, 
    public router: Router, @Inject(MAT_DIALOG_DATA) private data: any) {
      this.toastr = injector.get<ToastrService>(ToastrService);
      this.validation= injector.get<ValidationsetupService>(ValidationsetupService);
      this.adminsystemsetupservice= injector.get<AdminSystemsetupService>(AdminSystemsetupService);
      this.registerForm = this.formBuilder.group({
      lookup_value_name: new FormControl('',
        [
          Validators.required,
          Validators.pattern(this.validation.validationsArray.productCode.addProductCode.productCodeName.pattern),
          Validators.minLength(this.validation.validationsArray.productCode.addProductCode.productCodeName.minLength),
          Validators.maxLength(this.validation.validationsArray.productCode.addProductCode.productCodeName.maxLength)
        ]
      ),
      lookup_value_description: new FormControl('',
        [
          Validators.pattern(this.validation.validationsArray.productCode.addProductCode.productCodeDescription.pattern),
          Validators.minLength(this.validation.validationsArray.productCode.addProductCode.productCodeDescription.minLength),
          Validators.maxLength(this.validation.validationsArray.productCode.addProductCode.productCodeDescription.maxLength)
        ]
      )
    });
    if (data) {
      if (data.isUpdate == 'edit') {
        this.lookup = data.lookup.row;
        this.registerForm.controls.lookup_value_name.setValue(this.lookup.lookup_value_name);
        this.registerForm.controls.lookup_value_description.setValue(this.lookup.lookup_value_description);
        this.isUpdatebtn = true;
      } else if (data.isUpdate == 'addmissinginfo') {
        this.registerForm.controls.lookup_value_name.setValue(data.lookup.MissingLookupValueName);
        this.srcName_readonly = true
        this.fileId = data.fileId
      }

      this.textChanged = false;
    }
  }

  /*  
  .......................................................................................................
  * This is the ngOnInit function
  
  * ngOnInit is used to build a form and validations 
  .......................................................................................................
  */
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
  * This is the addProductCode function
  
  * addProductCode is used to add the product codes
  .......................................................................................................
  */
  addProductCode() {
    this.loading = true;
    this.submitted = true;
    this.lookup = this.lookup ? this.lookup : this.registerForm.value;
    if (this.registerForm.invalid) {
      this.isInvalid = true;
    } else {
      this.lookup.lookup_value_id = (this.lookup.lookup_value_id?.toString() == "") ? 0 : this.lookup.lookup_value_id;
      this.lookup.lookup_type_name = 'Product';
      this.lookup.lookup_value_name = this.registerForm.get('lookup_value_name')?.value;
      this.lookup.lookup_value_description = this.registerForm.get('lookup_value_description')?.value;
      if (this.srcName_readonly) {
        this.SaveProductFromAddMissingInfo();
      }
      else {
        this.SaveProductFromSystemSetup();
      }
    }
  }

  private SaveProductFromAddMissingInfo() {
    this.pasManualUploadService.AddMissingInformation(this.lookup.lookup_value_name,
      this.lookup.lookup_value_description,
      this.lookup.lookup_type_name,
      this.fileId,'').subscribe(
        (response) => {
          if (response.Statuscode === 200) {
            if (response.data == 1) {
              this.toastr.warning(response.Message);
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

  private SaveProductFromSystemSetup() {
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

}

