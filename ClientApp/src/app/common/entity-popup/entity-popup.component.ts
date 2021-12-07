import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { LookupData } from "../../../app/_models/LookupData";
import { AdminSystemsetupService } from '../../_services/admin/adminsystemsetup.service';
import { MatTableDataSource, } from "@angular/material/table";
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { SelectionModel } from "@angular/cdk/collections";
import { LookupMiscData } from '../../_models/LookupMiscData';
import { ValidationsetupService } from "../../_services/common/validationsetup.service";
import * as moment from 'moment';

@Component({
  selector: 'app-entity-popup',
  templateUrl: './entity-popup.component.html',
  styleUrls: ['./entity-popup.component.css'],
})

export class EntityPopupComponent implements OnInit {
  //#region Declaration-Misc Data
  reponse: any;
  validationResponse: any;
  miscValidationForm: FormGroup;
  validationForMissc: any[] = [];
  misscDll: any[] = [];
  misscValueDll: any[] = []
  legalValueDll: any[] = []
  legalDll: any[] = [];
  emailDll: any[] = [];
  contactDll: any[] = [];
  miscDataLoad = 0;
  validationForLegal: any[] = [];
  validationForEmail: any[] = [];
  validationForContact: any[] = [];
  addresstype: any = '02';
  addresstypearray: any[] = [];
  suburb: any;
  city: any;
  province: any;
  country: any
  MisclookupData: any[] = [];
  isInvalid: boolean;
  labelError: string;
  lookup: any[] = [];
  GetmissData = {
    contact_id: 0,
    Page: 1,
    Size: 7,
    SearchText: null,
  }
  Success: any;
  successMessage: any;
  miscellanoudata: any[] = [];
  GetmisilionusData: any
  tabledata: any[] = []
  MymissDatable: any[] = [];
  GroupedMiscDatatable: any[] = [];
  GroupedLegalDatatable: any[] = [];
  GroupedEmailDatatable: any[] = [];
  GroupedContactDatatable: any[] = [];
  Miscellanousdata = new MatTableDataSource<any>(undefined);
  MiscData: LookupMiscData;
  newMisData = {
    contact_id: 0,
    contact_type: '',
    Page: 1,
    Size: 0,
    SearchText: ''
  }
  columnsMiscData = [
    { columnDef: 'Miscellanous Data', header: 'Miscellanous Data', cell: (element: any) => `${element.lookup_value_id}` },
    { columnDef: 'value', header: 'Value', cell: (element: any) => `${element.value}` },
    { columnDef: 'Effective Date', header: 'Effective Date', cell: (element: any) => `${element.effective_date}` },
    { columnDef: 'Expiry Date', header: 'Expiry Date', cell: (element: any) => `${element.expiry_date}` },
  ];
  ColumnsToDisplayMiscData = this.columnsMiscData.map(c => c.columnDef);
  MiscellanousSource: any[] = []
  DropdownData: LookupData[];
  selectedradio = '1';
  public directionLinks: boolean = true;
  public EmailLabels: any = {
    previousLabel: "",
    nextLabel: ""
  };
  public ContactLabels: any = {
    previousLabel: "",
    nextLabel: ""
  };
  public legalDataLabels: any = {
    previousLabel: "",
    nextLabel: ""
  };
  public missLabels: any = {
    previousLabel: "",
    nextLabel: ""
  };
  public labels: any = {
    previousLabel: "< Prev",
    nextLabel: "Next >"
  };
  size = 7;
  pageIndex = 1;
  PageIndexMissData = 1;
  currentEmailPage: number = 1;
  currentLegalDataPage: number = 1;
  currentMissPage: number = 1;
  totalEmailPages: number;
  totalLegalDataPages: number;
  totalMissPages: number;
  currentContactPage: number = 1;
  totalContactPages: number;
  a: any;
  from = ""
  rowData: any;
  cont_id: any;
  counter = 0;
  //#endregion
  //#region Declaration-Legal Data
  ctrLegalData = 0;
  ddlLegalData: any[] = [];
  pageIndexLegalData = 1;
  b: any;
  legalDataTable: any[] = [];
  legalDataSource = new MatTableDataSource<any>(undefined);
  newLegalData = {
    contact_id: 0,
    contact_type: '',
    Page: 1,
    Size: 0,
    SearchText: ''
  }
  columnsLegalData = [
    { columnDef: 'lookup_value_id', header: 'Legal Data', cell: (element: any) => `${element.lookup_value_id}` },
    { columnDef: 'value', header: 'Value', cell: (element: any) => `${element.value}` },
    { columnDef: 'effectiveDate', header: 'Effective Date', cell: (element: any) => `${element.effectiveDate}` },
    { columnDef: 'expiryDate', header: 'Expiry Date', cell: (element: any) => `${element.expiryDate}` },
  ];
  columnsToDisplayLegalData = this.columnsLegalData.map(c => c.columnDef);
  //#endregion
  //#region Declaration-Communication Data
  //#region Declaration-Communication Data-Email Data
  ctrEmailData = 0;
  ddlEmail: any[] = [];
  pageIndexEmailData = 1;
  c: any;
  EmailDataTable: any[] = [];
  EmailDataSource = new MatTableDataSource<any>(undefined);
  AddressDataSource = new MatTableDataSource<any>(undefined);
  newEmailData = {
    contact_id: 0,
    contact_type: '',
    Page: 1,
    Size: 0,
    SearchText: ''
  }
  columnsEmailData = [
    { columnDef: 'lookup_value_id', header: 'E-Mail', cell: (element: any) => `${element.lookup_value_id}` },
    { columnDef: 'value', header: 'Value', cell: (element: any) => `${element.value}` },
    { columnDef: 'effectiveDate', header: 'Effective Date', cell: (element: any) => `${element.effectiveDate}` },
    { columnDef: 'expiryDate', header: 'Expiry Date', cell: (element: any) => `${element.expiryDate}` },
  ];
  columnsToDisplayEmailData = this.columnsEmailData.map(c => c.columnDef);
  //#endregion
  //#region Declaration-Communication Data-Contact Number
  ctrContactData = 0;
  ddlContact: any[] = [];
  pageIndexContactData = 1;
  d: any;
  contactDataTable: any[] = [];
  contactDataSource = new MatTableDataSource<any>(undefined);
  newContactData = {
    contact_id: 0,
    contact_type: '',
    Page: 1,
    Size: 0,
    SearchText: ''
  }
  columnsContactData = [
    { columnDef: 'lookup_value_id', header: 'Contact', cell: (element: any) => `${element.lookup_value_id}` },
    { columnDef: 'country_code', header: 'Country Code', cell: (element: any) => `${element.country_code}` },
    { columnDef: 'value', header: 'Value', cell: (element: any) => `${element.value}` },
    { columnDef: 'effectiveDate', header: 'Effective Date', cell: (element: any) => `${element.effectiveDate}` },
    { columnDef: 'expiryDate', header: 'Expiry Date', cell: (element: any) => `${element.expiryDate}` },
  ];
  columnsToDisplayContactData = this.columnsContactData.map(c => c.columnDef);
  //#endregion
  //#region Declaration-Communication Data-Address
  selectedAddress = new SelectionModel<any>(true, []);
  statusddl: any[] = [];
  statusddlcity: boolean = false;
  statusddlcountry: boolean = false;
  statusddlProvince: boolean = false;
  statusddlSubUrb: boolean = false;
  addressForm: FormGroup;
  addressData: any[] = [];
  columnAddressData = [
    { columnDef: 'addressType', header: 'AddressType', cell: (element: any) => `${element.address_type_id}` },
    { columnDef: 'effectiveDate', header: 'Effective Date', cell: (element: any) => `${element.ddMMyyyyEffective}` },
    { columnDef: 'expiryDate', header: 'Expiry Date', cell: (element: any) => `${element.ddMMyyyyExpiry}` },
    { columnDef: 'ViewDetails', header: '', cell: (element: any) => `${element.viewDetails}` },
  ]
  columnsToDisplayAddressData = this.columnAddressData.map(c => c.columnDef);
  address = {
    lookup_value_id: 0,
    address_id: 0,
    unit_number: '',
    street_number: '',
    complex_name: "",
    city: "",
    suburb: "",
    province: "",
    country: "",
    postal_code: '',
    address_type_id: 0,
    effective_date: "",
    expiry_date: "",
    contact_type_id: "",
    address_type: "",
    address_type_alias: "",
    address_line1: "",
    address_line2: "",
    address_line3: "",
    ddMMyyyyEffective: ''
  };
  saveAddress = {
    lookup_value_id: 0,
    address_id: 0,
    unit_number: 0,
    street_number: 0,
    complex_name: "",
    city: "",
    suburb: "",
    province: "",
    country: "",
    postal_code: 0,
    address_type_id: 0,
    effective_date: "",
    expiry_date: "",
    contact_type_id: "",
    address_type: "",
    address_type_alias: "",
    address_line1: "",
    address_line2: "",
    address_line3: ""
  };
  selectedAddressIndex = -1;
  physicalAddress: any[] = [];
  postalAddress: any[] = [];
  AdresstypeData: any[] = [];
  ddlCityData: any[] = []
  ddlCountryData: any[] = []
  ddlProvinceData: any[] = []
  ddlSubUrbData: any[] = []
  activeAddressData: any
  inactiveAddressData: any
  selectedIndex = -1;
  isInActive = false;
  isInActivePrevious = true;
  //#endregion
  //#endregion
  datePlaceholder: any;
  addressTypeLayout = '00'
  constructor(
    private dialogRef: MatDialogRef<EntityPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    public adminsystemsetupservice: AdminSystemsetupService,
    private datePipe: DatePipe, private toastr: ToastrService, public validation: ValidationsetupService,
  ) {
    this.datePlaceholder = this.validation.validationsArray.dateMetaData.datePlaceholder;
    this.from = data.from;
    this.rowData = data.rowData
    this.getMiscDataDropDownValues();
    this.GetMiscellanousData();
    if (this.from == 'src' || this.from == "tax" || this.from == "productCode" || this.from=="taxSrcCode") {
      this.selectedradio = '3';
    }
    else if (this.from == 'subent' || this.from == "funent") {
      this.GetAddressTypeData();
      this.getLegalDropDownValues();
      this.getLegalData();
      this.getEmailDropDownValues();
      this.getEmailData();
      this.getContactDropDownValues()
      this.getContactData();
      this.getAddressData()
      this.rowData = data.rowData;
      if (this.from == 'funent') {
        this.addressTypeLayout = '00';
        this.address.address_type_alias = 'FUND POSTAL ADDRESS'
      } else {
        this.addressTypeLayout = '00';
        this.address.address_type_alias = 'POSTAL ADDRESS'
      }
    }
  }

  /*  
  .......................................................................................................
    * This is the ngOnInit function

    * ngOnInit is use build addresss form as default Posta address 
  .......................................................................................................
  */
  ngOnInit(): void {
    this.addressForm = this.formBuilder.group({
      address_type_id: new FormControl('', Validators.required),
      unit_number: new FormControl('',
        [
          Validators.pattern(this.validation.validationsArray.fundANdSubAddress.unitNumber.pattern),
          Validators.minLength(this.validation.validationsArray.fundANdSubAddress.unitNumber.minLength),
          Validators.maxLength(this.validation.validationsArray.fundANdSubAddress.unitNumber.maxLength)
        ]
      ),
      complex_name: new FormControl('',
        [
          Validators.pattern(this.validation.validationsArray.fundANdSubAddress.complexName.pattern),
          Validators.minLength(this.validation.validationsArray.fundANdSubAddress.complexName.minLength),
          Validators.maxLength(this.validation.validationsArray.fundANdSubAddress.complexName.maxLength)
        ]
      ),
      street_name: new FormControl('',
        [
          Validators.pattern(this.validation.validationsArray.fundANdSubAddress.streetName.pattern),
          Validators.minLength(this.validation.validationsArray.fundANdSubAddress.streetName.minLength),
          Validators.maxLength(this.validation.validationsArray.fundANdSubAddress.streetName.maxLength)
        ]
      ),
      city_id: new FormControl('',),
      postal_code: new FormControl('',
        [
          Validators.required,
          Validators.pattern(this.validation.validationsArray.fundANdSubAddress.postalCode.pattern),
          Validators.minLength(this.validation.validationsArray.fundANdSubAddress.postalCode.minLength),
          Validators.maxLength(this.validation.validationsArray.fundANdSubAddress.postalCode.maxLength)
        ]
      ),
    });
    this.address.address_id = 0;
  }

  /*  
  ......................................................................................................
  * This is the f function
  
  * f is used to get status of Form
  .......................................................................................................
  */
  get f() {
    return this.addressForm.controls;
  }
  //#region Common
  /*  
......................................................................................................
* This is the toggleArrow function

* toggleArrow is used to get the status of DDL (open ,closed)
.......................................................................................................
*/
  toggleArrow(k: any) {
    this.statusddl[k] = this.statusddl[k] === true ? false : true;
  }
  toggleArrow1() {
    this.statusddlcity = this.statusddlcity === true ? false : true;
  }
  toggleArrow2() {
    this.statusddlcountry = this.statusddlcountry === true ? false : true;
  }
  toggleArrow3() {
    this.statusddlProvince = this.statusddlProvince === true ? false : true;
  }
  toggleArrow4() {
    this.statusddlSubUrb = this.statusddlSubUrb === true ? false : true;
  }
  //#endregion
  //#region Communication Data
  //#region Communication Data-Address

  /*  
......................................................................................................
* This is the GetAddressTypeData function

* GetAddressTypeData is used to get the address type DDL values based on from which page popup get opened
.......................................................................................................
*/
  GetAddressTypeData() {
    let lookup_type_name = ''
    if (this.from == 'subent') {
      lookup_type_name = "Addr_Submitting Entity"
    }
    else if (this.from == "funent") {
      lookup_type_name = "Addr_Fund Entity"
    }
    this.adminsystemsetupservice.GetMisseDropValues(lookup_type_name, "").subscribe(dropdownpdata => {
      this.AdresstypeData = dropdownpdata.data;
    });
  }

  /*  
 ......................................................................................................
 * This is the setPhysicalAddressLayout function
 
 * @param dllValue is selected value on address type DDL
 
 * setPhysicalAddressLayout is used to set address from layout to Physical
 .......................................................................................................
 */
  setPhysicalAddressLayout(dllValue: any) {
    this.addressTypeLayout = '01'
    if (dllValue.lookup_value_alias == 'PHYSICAL ADDRESS') {
      this.address.address_type_alias = 'PHYSICAL ADDRESS'
    } else {
      this.address.address_type_alias = 'FUND PHYSICAL ADDRESS'
    }
    this.addressForm = this.formBuilder.group({
      address_type_id: new FormControl('', Validators.required),
      unit_number: new FormControl('',
        [
          Validators.pattern('[0-9]*'),
          Validators.minLength(this.validation.validationsArray.fundANdSubAddress.unitNumber.minLength),
          Validators.maxLength(this.validation.validationsArray.fundANdSubAddress.unitNumber.maxLength)
        ]
      ),
      complex_name: new FormControl('',
        [
          Validators.pattern(this.validation.validationsArray.fundANdSubAddress.complexName.pattern),
          Validators.minLength(this.validation.validationsArray.fundANdSubAddress.complexName.minLength),
          Validators.maxLength(this.validation.validationsArray.fundANdSubAddress.complexName.maxLength)
        ]
      ),
      street_name: new FormControl('',
        [
          Validators.pattern(this.validation.validationsArray.fundANdSubAddress.streetName.pattern),
          Validators.minLength(this.validation.validationsArray.fundANdSubAddress.streetName.minLength),
          Validators.maxLength(this.validation.validationsArray.fundANdSubAddress.streetName.maxLength)
        ]
      ),
      street_number: new FormControl('', [
        Validators.pattern(this.validation.validationsArray.fundANdSubAddress.postalCode.pattern)]),
      suburb_id: new FormControl('',),
      city_id: new FormControl('',),
      postal_code: new FormControl('',
        [
          Validators.pattern(this.validation.validationsArray.fundANdSubAddress.postalCode.pattern),
          Validators.minLength(this.validation.validationsArray.fundANdSubAddress.postalCode.minLength),
          Validators.maxLength(this.validation.validationsArray.fundANdSubAddress.postalCode.maxLength)
        ]
      )
    });
  }

  /*  
  ......................................................................................................
  * This is the setAddressLayout function
  
  * @param row is selected row on address grid
  
  * @param value is selected value on address type DDL
  
  * @param k is selected index on address grid
  
  * setAddressLayout is used to set address from layout to Postal
  .......................................................................................................
  */
  setAddressLayout(row: any, value: any, k: any) {
    for (let dllValue of this.AdresstypeData) {
      if (value == dllValue.lookup_value_id) {
        if (dllValue.lookup_value_alias == 'PHYSICAL ADDRESS' || dllValue.lookup_value_alias == 'FUND PHYSICAL ADDRESS') {
          this.setPhysicalAddressLayout(dllValue);
        } else if (
          dllValue.lookup_value_alias == 'POSTAL ADDRESS' || dllValue.lookup_value_alias == 'FUND POSTAL ADDRESS') {
          this.addressTypeLayout = '02';
          if (dllValue.lookup_value_alias == 'POSTAL ADDRESS') {
            this.address.address_type_alias = 'POSTAL ADDRESS'
          } else {
            this.address.address_type_alias = 'FUND POSTAL ADDRESS'
          }
          this.addressForm = this.formBuilder.group({
            address_type_id: new FormControl('', Validators.required),
            unit_number: new FormControl('',
              [
                Validators.pattern(this.validation.validationsArray.fundANdSubAddress.unitNumber.pattern),
                Validators.minLength(this.validation.validationsArray.fundANdSubAddress.unitNumber.minLength),
                Validators.maxLength(this.validation.validationsArray.fundANdSubAddress.unitNumber.maxLength)
              ]
            ),
            complex_name: new FormControl('',
              [
                Validators.pattern(this.validation.validationsArray.fundANdSubAddress.complexName.pattern),
                Validators.minLength(this.validation.validationsArray.fundANdSubAddress.complexName.minLength),
                Validators.maxLength(this.validation.validationsArray.fundANdSubAddress.complexName.maxLength)
              ]
            ),
            street_name: new FormControl('',
              [
                Validators.pattern(this.validation.validationsArray.fundANdSubAddress.streetName.pattern),
                Validators.minLength(this.validation.validationsArray.fundANdSubAddress.streetName.minLength),
                Validators.maxLength(this.validation.validationsArray.fundANdSubAddress.streetName.maxLength)
              ]
            ),
            city_id: new FormControl(''),
            postal_code: new FormControl('',
              [
                Validators.required,
                Validators.pattern(this.validation.validationsArray.fundANdSubAddress.postalCode.pattern),
                Validators.minLength(this.validation.validationsArray.fundANdSubAddress.postalCode.minLength),
                Validators.maxLength(this.validation.validationsArray.fundANdSubAddress.postalCode.maxLength)
              ]
            ),
          });
        }
      }
    }
    this.assignaddress(row, k);
  }


  /*  
......................................................................................................
* This is the assignaddress function

* @param row is selected row on address grid

* @param i is selected index on address grid

* assignaddress is used to set address from layout to Postal
.......................................................................................................
*/
  assignaddress(row: any, i: any) {
    this.selectedAddress.clear();
    this.selectedAddress.select(row)
    this.selectedAddressIndex = i;
    if (row.address_type_alias == 'PHYSICAL ADDRESS' || row.address_type_alias == 'FUND PHYSICAL ADDRESS') {
      this.addressTypeLayout = '01';
      this.addressForm = this.formBuilder.group({
        address_type_id: new FormControl('', Validators.required),
        unit_number: new FormControl('',
          [
            Validators.pattern('[0-9]*'),
            Validators.minLength(this.validation.validationsArray.fundANdSubAddress.unitNumber.minLength),
            Validators.maxLength(this.validation.validationsArray.fundANdSubAddress.unitNumber.maxLength)
          ]
        ),
        complex_name: new FormControl('',
          [
            Validators.pattern(this.validation.validationsArray.fundANdSubAddress.complexName.pattern),
            Validators.minLength(this.validation.validationsArray.fundANdSubAddress.complexName.minLength),
            Validators.maxLength(this.validation.validationsArray.fundANdSubAddress.complexName.maxLength)
          ]
        ),
        street_name: new FormControl('',
          [
            Validators.pattern(this.validation.validationsArray.fundANdSubAddress.streetName.pattern),
            Validators.minLength(this.validation.validationsArray.fundANdSubAddress.streetName.minLength),
            Validators.maxLength(this.validation.validationsArray.fundANdSubAddress.streetName.maxLength)
          ]
        ),
        street_number: new FormControl('', [
          Validators.pattern(this.validation.validationsArray.fundANdSubAddress.postalCode.pattern)]),
        suburb_id: new FormControl('',),
        city_id: new FormControl('',),
        postal_code: new FormControl('',
          [
            Validators.pattern(this.validation.validationsArray.fundANdSubAddress.postalCode.pattern),
            Validators.minLength(this.validation.validationsArray.fundANdSubAddress.postalCode.minLength),
            Validators.maxLength(this.validation.validationsArray.fundANdSubAddress.postalCode.maxLength)
          ]
        ),
      });
      this.assignFormData(row);
    } else if (row.address_type_alias == 'POSTAL ADDRESS' || row.address_type_alias == 'FUND POSTAL ADDRESS') {
      this.addressTypeLayout = '02';
      this.addressForm = this.formBuilder.group({
        address_type_id: new FormControl('', Validators.required),
        unit_number: new FormControl('',
          [
            Validators.pattern(this.validation.validationsArray.fundANdSubAddress.unitNumber.pattern),
            Validators.minLength(this.validation.validationsArray.fundANdSubAddress.unitNumber.minLength),
            Validators.maxLength(this.validation.validationsArray.fundANdSubAddress.unitNumber.maxLength)
          ]
        ),
        complex_name: new FormControl('',
          [
            Validators.pattern(this.validation.validationsArray.fundANdSubAddress.complexName.pattern),
            Validators.minLength(this.validation.validationsArray.fundANdSubAddress.complexName.minLength),
            Validators.maxLength(this.validation.validationsArray.fundANdSubAddress.complexName.maxLength)
          ]
        ),
        street_name: new FormControl('',
          [
            Validators.pattern(this.validation.validationsArray.fundANdSubAddress.streetName.pattern),
            Validators.minLength(this.validation.validationsArray.fundANdSubAddress.streetName.minLength),
            Validators.maxLength(this.validation.validationsArray.fundANdSubAddress.streetName.maxLength)
          ]
        ),
        city_id: new FormControl(''),
        postal_code: new FormControl('',
          [
            Validators.required,
            Validators.pattern(this.validation.validationsArray.fundANdSubAddress.postalCode.pattern),
            Validators.minLength(this.validation.validationsArray.fundANdSubAddress.postalCode.minLength),
            Validators.maxLength(this.validation.validationsArray.fundANdSubAddress.postalCode.maxLength)
          ]
        ),
      });
      this.assignFormDataPostal(row);
    }
  }

  /*  
  ......................................................................................................
  * This is the SaveAddressData function
  
  * SaveAddressData is used to save address 
  .......................................................................................................
  */
  SaveAddressData() {
    let addlength = this.selectedAddressIndex;
    this.saveAddress.address_id = this.AddressDataSource.data[addlength].address_id;
    let dateValidate = 0;
    if (this.addressTypeLayout == '01') {
      this.saveAddress.address_line1 = this.addressForm.get('complex_name')?.value;
    this.saveAddress.address_line2 = this.addressForm.get('street_name')?.value;
    this.saveAddress.street_number = parseInt(this.addressForm.get('street_number')?.value);
    this.saveAddress.suburb = this.addressForm.get('suburb_id')?.value;
    this.saveAddress.unit_number = parseInt(this.addressForm.get('unit_number')?.value);
    this.saveAddress.city = this.addressForm.get('city_id')?.value;
    this.saveAddress.country = '';
    this.saveAddress.province = '';
    this.saveAddress.postal_code = parseInt(this.addressForm.get('postal_code')?.value);
    }
    else {
      this.saveAddress.address_line2 = this.addressForm.get('complex_name')?.value;
      this.saveAddress.address_line3 = this.addressForm.get('street_name')?.value;
      this.saveAddress.address_line1 = this.addressForm.get('unit_number')?.value;
      this.saveAddress.city = this.addressForm.get('city_id')?.value;
      this.saveAddress.country = '';
      this.saveAddress.postal_code = parseInt(this.addressForm.get('postal_code')?.value);
    }
    this.saveAddress.contact_type_id = this.rowData.lookup_value_id;
    this.saveAddress.effective_date = this.datePipe.transform(this.AddressDataSource.data[addlength].ddMMyyyyEffective, "dd/MM/yyyy")!;
    this.saveAddress.expiry_date = this.datePipe.transform(this.AddressDataSource.data[addlength].ddMMyyyyExpiry, "dd/MM/yyyy")!;
    this.saveAddress.address_type_id = this.AddressDataSource.data[addlength].address_type_id;
    this.saveAddress.address_type_alias = this.AddressDataSource.data[addlength].address_type_alias;
    var d1 = this.datePipe.transform(this.addressForm.get('effective_date')?.value, "dd/MM/yyyy")!;
    var d2 = this.datePipe.transform(this.addressForm.get('expiry_date')?.value, "dd/MM/yyyy")!
    const difference = moment(d2, "DD/MM/YYYY HH:mm:ss").diff(moment(d1, "DD/MM/YYYY HH:mm:ss"))
    if (difference < 1) {
      setTimeout(() => {
        this.toastr.error('Effective date should be smaller than Expiry Date');
      }, 500);
    }
    else if (this.addressForm.valid) {
      this.checkForValidAddress();

    }
    else {
      setTimeout(() => {
        this.toastr.error('Please fill the all details');
      }, 500);
    }
  }

  private checkForValidAddress() {
    let validAddress = true;
    for (let add of this.addressData) {
      if (this.saveAddress.address_type_alias == add.address_type_alias) {
        if (add.address_id != 0) {
          let efecdateold = this.datePipe.transform(add.ddMMyyyyEffective, "dd/MM/yyyy");
          const difference1 = moment(this.saveAddress.effective_date, "DD/MM/YYYY HH:mm:ss").diff(moment(efecdateold, "DD/MM/YYYY HH:mm:ss"));
          if (difference1 == 0) {
            validAddress = false;
          }
        }
      }
    }
    if (validAddress) {
      this.savevalidAddress();
    } else {
      setTimeout(() => {
        this.toastr.error('Address with given effective date already exist');
      }, 500);
    }
  }

 
  private savevalidAddress() {
    this.adminsystemsetupservice.SaveCommunicationAddressData(this.saveAddress).subscribe(
      (response) => {
        if (response.Statuscode === 200) {
          this.toastr.success(response.Message);
          this.dialogRef.close();
        }
      },
      (error) => {
        this.isInvalid = true;
        this.labelError = error.error.Message;
      }
    );
  }

  /*  
  ......................................................................................................
  * This is the assignFormData function
  
  * assignFormData is used to assign physical address to from layout
  .......................................................................................................
  */
  assignFormData(addressData: any) {
    this.addressForm.controls.address_type_id.setValue(addressData.address_type_id);
    this.addressForm.controls.unit_number.setValue(addressData.unit_number);
    this.addressForm.controls.complex_name.setValue(addressData.address_line1);
    this.addressForm.controls.street_name.setValue(addressData.address_line2);
    this.addressForm.controls.street_number.setValue(addressData.street_number)
    this.addressForm.controls.suburb_id.setValue(addressData.suburb);
    this.addressForm.controls.city_id.setValue(addressData.city);
    this.addressForm.controls.postal_code.setValue(addressData.postal_code);
  }

  /*  
  ......................................................................................................
  * This is the assignFormDataPostal function
  
  * assignFormDataPostal is used to assign postal address to from layout
  .......................................................................................................
  */
  assignFormDataPostal(addressData: any) {
    this.addressForm.controls.address_type_id.setValue(addressData.address_type_id);
    this.addressForm.controls.unit_number.setValue(addressData.address_line1);
    this.addressForm.controls.complex_name.setValue(addressData.address_line2);
    this.addressForm.controls.street_name.setValue(addressData.address_line3);
    this.addressForm.controls.city_id.setValue(addressData.city);
    this.addressForm.controls.postal_code.setValue(addressData.postal_code);
  }

  /*  
  ......................................................................................................
  * This is the getAddressData function
  
  * getAddressData is used to get address data from DB
  .......................................................................................................
  */
  getAddressData() {
    this.activeAddressData = [];
    this.inactiveAddressData = [];
    this.adminsystemsetupservice.getAddressData(this.rowData.lookup_value_id).subscribe(addData => {
      this.addressData = addData.data;
      if (this.addressData.length > 0) {
        for (let address of this.addressData) {
          address.ddMMyyyyEffective = this.datePipe.transform(address.effective_date, "yyyy-MM-dd");
          address.ddMMyyyyExpiry = this.datePipe.transform(address.expiry_date, "yyyy-MM-dd");
          address.viewDetails = '';
        }
        this.AddressDataSource = new MatTableDataSource<any>(
          this.addressData
        );
      } else {
        this.addRowAddress();
      }
    },
      (error => {
        this.addRowAddress();
      })
    );
  }

  /*  
  ......................................................................................................
  * This is the addAddressDataRow function
  
  * addAddressDataRow is used to add empty row in address grid to add new address
  .......................................................................................................
  */
  addAddressDataRow() {
    let addLength = this.addressData.length;
    if (this.addressData[addLength - 1].address_id == 0) {
      setTimeout(() => {
        this.toastr.error("Please save the details.");
      }, 500);
    } else {
      this.addRowAddress();
    }
  }

  addRowAddress() {
    for (let dllValue of this.AdresstypeData) {
      if (dllValue.lookup_value_alias == 'POSTAL ADDRESS' || dllValue.lookup_value_alias == 'FUND POSTAL ADDRESS') {
        this.address.address_type_id = dllValue.lookup_value_id;
      }
    }
    this.addressTypeLayout = '00';
    let date = new Date()
    this.address.ddMMyyyyEffective = this.datePipe.transform(date, "yyyy-MM-dd") || '';
    this.addressData.push(this.address)
    this.AddressDataSource = new MatTableDataSource<any>(
      this.addressData
    );
  }
  //#endregion
  //#region E-Mail

  /*  
  ......................................................................................................
  * This is the getEmailDropDownValues function
  
  * getEmailDropDownValues is used to get the Email type DDL values based on from which page popup get opened
  .......................................................................................................
  */
  getEmailDropDownValues() {
    let lookup_type_name = ''
    if (this.from == 'subent') {
      lookup_type_name = "Email_Submitting Entity"
    }
    else if (this.from == "funent") {
      lookup_type_name = "Email_Fund Entity"
    }
    this.adminsystemsetupservice.GetMisseDropValues(lookup_type_name, "").subscribe(dropdownpdata => {
      this.ddlEmail = dropdownpdata.data;
    });
  }

  /*  
  ......................................................................................................
  * This is the setValidationsEmail function
  
  * @param row is selected row on address grid
  
  * @param i is selected index on address grid
  
  * setValidationsEmail is used to set validation for selected DDL value
  .......................................................................................................
  */
  setValidationsEmail(value: any, k: any) {
    let index = (this.pageIndexEmailData - 1) * this.size + k;
    this.EmailDataTable[index].value = ""
    this.adminsystemsetupservice.GetValidationRule(value).subscribe(response => {
      this.validationForEmail[k].Pattern = response.data.Pattern;
      this.validationForEmail[k].MaxLength = response.data.MaxLength;
      this.validationForEmail[k].MinLength = response.data.MinLength;
    }, (error => {
      this.validationForEmail[k].Pattern = "[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}";
      this.validationForEmail[k].MaxLength = 20;
      this.validationForEmail[k].MinLength = 1;
    }))
  }
  get formStatusEmail() {
    let form = false
    var Form = document.forms
    for (let i = 0; i < Form.length; i++) {
      if (Form[i].name == 'EmailForm1') {
        if (Form[i].checkValidity()) {
          form = true
        } else {
          form = false
        }
      }
    }
    return form
  }

  /*  
  ......................................................................................................
  * This is the paginateEmailData function
  
  * @param event is current selected page number of email grid
  
  * paginateEmailData is used to go from one page to another on email grid 
  .......................................................................................................
  */
  paginateEmailData(event: any) {
    this.pageIndexEmailData = event
    this.currentEmailPage = event;
    this.EmailDataSource = new MatTableDataSource<any>(
      this.EmailDataTable.slice(event * this.size - this.size, event * this.size)
    );
    let emaildata = this.EmailDataTable.slice(event * this.size - this.size, event * this.size);
    this.setvalidationforemailarray(emaildata);
    this.rearrangeEmailPaging();
  }

  /*  
  ......................................................................................................
  * This is the rearrangeEmailPaging function
  
  * rearrangeEmailPaging is used set labels of pagination
  .......................................................................................................
  */
  rearrangeEmailPaging() {
    if (this.currentEmailPage == 1) {
      this.EmailLabels.previousLabel = "";
    }
    else {
      this.EmailLabels.previousLabel = "< Prev";
    }
    if (this.currentEmailPage == this.totalEmailPages) {
      this.EmailLabels.nextLabel = "";
    }
    else {
      this.EmailLabels.nextLabel = "Next >";
    }
  }

  /*  
  ......................................................................................................
  * This is the rearrangeEmailPaging function
  
  * rearrangeEmailPaging is used set labels of pagination for legal
  .......................................................................................................
  */
  rearrangeLegalDataPaging() {
    if (this.currentLegalDataPage == 1) {
      this.legalDataLabels.previousLabel = "";
    }
    else {
      this.legalDataLabels.previousLabel = "< Prev";
    }
    if (this.currentLegalDataPage == this.totalLegalDataPages) {
      this.legalDataLabels.nextLabel = "";
    }
    else {
      this.legalDataLabels.nextLabel = "Next >";
    }
  }

  /*  
  ......................................................................................................
  * This is the rearrangeEmailPaging function
  
  * rearrangeEmailPaging is used set labels of pagination for missc
  .......................................................................................................
  */
  rearrangeMissPaging() {
    if (this.currentMissPage == 1) {
      this.missLabels.previousLabel = "";
    }
    else {
      this.missLabels.previousLabel = "< Prev";
    }
    if (this.currentMissPage == this.totalMissPages) {
      this.missLabels.nextLabel = "";
    }
    else {
      this.missLabels.nextLabel = "Next >";
    }
  }

  /*  
  ......................................................................................................
  * This is the addEmailDataRow function
  
  * addEmailDataRow is used to add empty row in email grid for add new email
  .......................................................................................................
  */
  addEmailDataRow() {
    this.ctrEmailData = 0
    for (let a of this.EmailDataTable) {
      if (a.effectiveDate == '' || a.value == "" || a.lookup_value_id == 1) {
        this.ctrEmailData = this.ctrEmailData + 1
      }
    }
    if (this.ctrEmailData > 0) {
      setTimeout(() => {
        this.toastr.error("Please fill all the details");
      }, 500);
    }
    else {
      let temp1 = {
        lookup_value_id: 1, value: '', effectiveDate: this.datePipe.transform(new Date(), "yyyy-MM-dd"), expiryDate: ''
      }
      this.EmailDataTable.push(temp1);
      let validateRule = {
        MinLength: 5,
        MaxLength: 40,
        Pattern: '[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}',
      }
      this.validationForEmail.push(validateRule)
      this.totalEmailPages = this.EmailDataTable.length / this.size;
      this.totalEmailPages = Math.ceil(this.totalEmailPages);
      if (this.totalEmailPages > 1) {
        this.currentEmailPage = this.totalEmailPages;
        this.pageIndexEmailData = this.totalEmailPages;
        this.EmailDataSource = new MatTableDataSource<any>(
          this.EmailDataTable.slice(this.totalEmailPages * this.size - this.size, this.totalEmailPages * this.size)
        );
      }
      else {
        this.EmailDataSource = new MatTableDataSource<any>(
          this.EmailDataTable.slice(0, this.size)
        );
      }
      this.rearrangeEmailPaging();
    }
    this.c = this.pageIndexEmailData;
  }
  toggleArrowEmail(k: any) {
    this.emailDll[k] = this.emailDll[k] === true ? false : true;
  }

  /*  
  ......................................................................................................
  * This is the getEmailData function
  
  * getEmailData is used to get email data
  .......................................................................................................
  */
  getEmailData() {
    this.newEmailData.contact_id = this.rowData.lookup_value_id
    this.newEmailData.Page = this.pageIndexEmailData
    this.newEmailData.Size = 7
    this.newEmailData.SearchText = ''
    this.adminsystemsetupservice.getEmailData(this.newEmailData).subscribe(responseEmailData => {
      if (responseEmailData.Statuscode == 200) {
        if (responseEmailData.data.length > 0) {
          const key = 'lookup_value_id'
          this.GroupedEmailDatatable = Object.values(responseEmailData.data.reduce((acc: any, item: any) => (acc[item[key]] = [...(acc[item[key]] || []), item], acc), {}));
          let tempDataTable = []
          for (const iterator of this.GroupedEmailDatatable) {
            for (const iterator2 of iterator) {
              tempDataTable.push(iterator2)
            }
          }
          this.EmailDataTable = tempDataTable

        }
      }
      else {
        this.EmailDataTable = [];
      }
      this.EmailDataSource = new MatTableDataSource<any>(
        this.EmailDataTable.slice(0, this.size)
      );
      this.totalEmailPages = this.EmailDataTable.length / this.size;
      this.totalEmailPages = Math.ceil(this.totalEmailPages);
      let emaildata = this.EmailDataTable.slice(0, this.size)
      this.setvalidationforemailarray(emaildata);
      this.rearrangeEmailPaging();
    }, (error) => {
      let temp1 = {
        lookup_value_id: 1, value: '', effectiveDate: this.datePipe.transform(new Date(), "yyyy-MM-dd"), expiryDate: '',
      }
      this.EmailDataTable.push(temp1);
      let validateRule = {
        MinLength: 5,
        MaxLength: 40,
        Pattern: '[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}'
      }
      this.validationForEmail.push(validateRule)
      this.EmailDataSource = new MatTableDataSource<any>(
        this.EmailDataTable.slice(0, this.size)
      );
    });
  }

  /*  
......................................................................................................
* This is the setvalidationforemailarray function

* @param array is array of email data 

* setvalidationforemailarray is used to set validation rules for each row of array
.......................................................................................................
*/
  private setvalidationforemailarray(array: any) {
    let i = 0;
    this.validationForEmail = [];
    for (let data of array) {
      let validateRule = {
        MinLength: 5,
        MaxLength: 40,
        Pattern: '[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}'
      };
      this.validationForEmail.push(validateRule);
      this.adminsystemsetupservice.GetValidationRule(data.lookup_value_id).subscribe(response => {
        this.validationForEmail[i].Pattern = response.data.Pattern;
        this.validationForEmail[i].MaxLength = response.data.MaxLength;
        this.validationForEmail[i].MinLength = response.data.MinLength;
        data.effectiveDate = this.datePipe.transform(data.effective_date, "yyyy-MM-dd");
        data.expiryDate = this.datePipe.transform(data.expiry_date, "yyyy-MM-dd");
        i++;
      }, (error => {
        this.validationForEmail[i].Pattern = '[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}';
        this.validationForEmail[i].MaxLength = 40;
        this.validationForEmail[i].MinLength = 5;
        data.effectiveDate = this.datePipe.transform(data.effective_date, "yyyy-MM-dd");
        data.expiryDate = this.datePipe.transform(data.expiry_date, "yyyy-MM-dd");
        i++;
      }));
    }
  }

  saveValidatedEmailData() {
    let dateValidate = 0;
    for (let edata of this.EmailDataTable) {
      var d1 = Date.parse(edata.effectiveDate);
      var d2 = Date.parse(edata.expiryDate);
      if (d1 > d2) {
        dateValidate = 1
      }
    }
    if (dateValidate == 0) {
      this.adminsystemsetupservice.postEmailData(this.EmailDataTable).subscribe(
        (response) => {
          if (response.Statuscode === 200) {
            this.Success = true;
            this.toastr.success(response.Message);
            this.pageIndexEmailData = 1
            this.dialogRef.close();
          }
        },
        (error) => {
          this.isInvalid = true;
          this.labelError = error.error.Message;
        }
      );
    } else {
      setTimeout(() => {
        this.toastr.error('Effective date should be smaller than Expiry Date')
      }, 500);
    }
  }

  /*  
......................................................................................................
* This is the saveEmailData function

* saveEmailData is used to save and update the data of grid
.......................................................................................................
*/
  saveEmailData() {
    let counter = 1
    for (let data of this.EmailDataTable) {
      data.email_id = counter;
      data.email_type_id = data.lookup_value_id;
      let val = data.value
      data.value = val
      data.contact_id = this.rowData.lookup_value_id;
      data.effective_date = data.effectiveDate;
      data.expiry_date = data.expiryDate;
      counter++;
    }
    this.ctrEmailData = 0
    for (let a of this.EmailDataTable) {
      if (a.effectiveDate == undefined || a.value == "" || a.lookup_value_id == 1) {
        this.ctrEmailData = this.ctrEmailData + 1
      }
    }
    if (this.ctrEmailData > 0) {
      setTimeout(() => {
        this.toastr.error("Please fill all the details");
      }, 500);
    }
    else {
      this.saveValidatedEmailData()
    }
  }
  //#endregion
  //#region Contact

  /*  
......................................................................................................
* This is the getContactDropDownValues function

* getContactDropDownValues is used to get the contact type DDL values based on from which page popup get opened
.......................................................................................................
*/
  getContactDropDownValues() {
    let lookup_type_name = ''
    if (this.from == 'subent') {
      lookup_type_name = "CT_Submitting Entity"
    }
    else if (this.from == "funent") {
      lookup_type_name = "CT_Fund Entity"
    }
    const type = ""
    this.adminsystemsetupservice.GetMisseDropValues(lookup_type_name, type).subscribe(dropdownpdata => {
      this.ddlContact = dropdownpdata.data;
    });
  }

  /*  
  ......................................................................................................
  * This is the setValidationsContact function
  
  * @param row is selected row on address grid
  
  * @param i is selected index on address grid
  
  * setValidationsContact is used to set validation for selected DDL value
  .......................................................................................................
  */
  setValidationsContact(value: any, k: any) {
    this.adminsystemsetupservice.GetValidationRule(value).subscribe(response => {
      this.validationForContact[k].Pattern = response.data.Pattern;
      this.validationForContact[k].MaxLength = response.data.MaxLength;
      this.validationForContact[k].MinLength = response.data.MinLength;
    }, (error => {
      this.validationForContact[k].Pattern = "^[0-9]+$";
      this.validationForContact[k].MaxLength = 20;
      this.validationForContact[k].MinLength = 1;
    }))
  }
  get formStatusContact() {
    let form = false
    var Form = document.forms
    for (let i = 0; i < Form.length; i++) {
      if (Form[i].name == 'formContact') {
        if (Form[i].checkValidity()) {
          form = true
        } else {
          form = false
        }
      }
    }
    return form
  }
  get formStatusMissc() {
    let formMisc = false
    var Form = document.forms
    for (let i = 0; i < Form.length; i++) {
      if (Form[i].name == 'myForm') {
        if (Form[i].checkValidity()) {
          formMisc = true
        } else {
          formMisc = false
        }
      }
    }
    return formMisc
  }

  /*  
......................................................................................................
* This is the paginateContactData function

* @param event is current selected page number of contact grid

* paginateContactData is used to go from one page to another on contact grid 
.......................................................................................................
*/
  paginateContactData(event: any) {
    this.pageIndexContactData = event
    this.currentContactPage = event;
    this.contactDataSource = new MatTableDataSource<any>(
      this.contactDataTable.slice(event * this.size - this.size, event * this.size)
    );
    let contdata = this.contactDataTable.slice(event * this.size - this.size, event * this.size);
    this.setvalidationforcontactarray(contdata);
    this.rearrangeContactPaging();
  }

  /*  
......................................................................................................
* This is the rearrangeEmailPaging function

* rearrangeEmailPaging is used set labels of pagination
.......................................................................................................
*/
  rearrangeContactPaging() {
    if (this.currentContactPage == 1) {
      this.ContactLabels.previousLabel = "";
    }
    else {
      this.ContactLabels.previousLabel = "< Prev";
    }
    if (this.currentContactPage == this.totalContactPages) {
      this.ContactLabels.nextLabel = "";
    }
    else {
      this.ContactLabels.nextLabel = "Next >";
    }
  }

  /*  
 ......................................................................................................
 * This is the addContactDataRow function
 
 * addContactDataRow is used to add empty row in contact grid for add new contact
 .......................................................................................................
 */
  addContactDataRow() {
    this.ctrContactData = 0
    for (let a of this.contactDataTable) {
      if (a.effectiveDate == '' || a.value == "" || a.lookup_value_id == 1 || a.country_code == '') {
        this.ctrContactData = this.ctrContactData + 1
      }
    }
    if (this.ctrContactData > 0) {
      setTimeout(() => {
        this.toastr.error("Please fill all the details");
      }, 500);
    }
    else {
      let temp1 = {
        lookup_value_id: 1, country_code: '', value: '', effectiveDate: this.datePipe.transform(new Date(), "yyyy-MM-dd"), expiryDate: ''
      }
      this.contactDataTable.push(temp1);
      let validateRule = {
        MinLength: 1,
        MaxLength: 20,
        Pattern: '^[0-9]+$'
      }
      this.validationForContact.push(validateRule)
      this.totalContactPages = this.contactDataTable.length / this.size;
      this.totalContactPages = Math.ceil(this.totalContactPages);
      if (this.totalContactPages > 1) {
        this.currentContactPage = this.totalContactPages;
        this.pageIndexContactData = this.totalContactPages;
        this.contactDataSource = new MatTableDataSource<any>(
          this.contactDataTable.slice(this.totalContactPages * this.size - this.size, this.totalContactPages * this.size)
        );
      }
      else {
        this.contactDataSource = new MatTableDataSource<any>(
          this.contactDataTable.slice(0, this.size)
        );
      }
      this.rearrangeContactPaging();
    }
    this.d = this.pageIndexContactData;
  }

  /*  
......................................................................................................
* This is the getContactData function

* getContactData is used to get contact data
.......................................................................................................
*/
  getContactData() {
    this.newContactData.contact_id = this.rowData.lookup_value_id
    this.newContactData.Page = this.pageIndexContactData
    this.newContactData.Size = 7
    this.newContactData.SearchText = ''
    this.adminsystemsetupservice.getContactData(this.newContactData).subscribe(responseContactData => {
      if (responseContactData.Statuscode == 200) {
        if (responseContactData.data.length > 0) {
          const key = 'lookup_value_id'
          this.GroupedContactDatatable = Object.values(responseContactData.data.reduce((acc: any, item: any) => (acc[item[key]] = [...(acc[item[key]] || []), item], acc), {}));
          let tempDataTable = []
          for (const iterator of this.GroupedContactDatatable) {
            for (const iterator2 of iterator) {
              tempDataTable.push(iterator2)
            }
          }
          this.contactDataTable = tempDataTable;

        }
      }
      else {
        this.contactDataTable = [];
      }
      this.contactDataSource = new MatTableDataSource<any>(
        this.contactDataTable.slice(0, this.size)
      );
      this.totalContactPages = this.contactDataTable.length / this.size;
      this.totalContactPages = Math.ceil(this.totalContactPages);
      let contdata = this.contactDataTable.slice(0, this.size);
      this.setvalidationforcontactarray(contdata);
      this.rearrangeContactPaging();
    }, (error) => {
      let temp1 = {
        lookup_value_id: 1, value: '', effectiveDate: this.datePipe.transform(new Date(), "yyyy-MM-dd"), expiryDate: '', country_code: ''
      }
      this.contactDataTable.push(temp1);
      let validateRule = {
        MinLength: 1,
        MaxLength: 20,
        Pattern: '^[0-9]+$'
      }
      this.validationForContact.push(validateRule)
      this.contactDataSource = new MatTableDataSource<any>(
        this.contactDataTable.slice(0, this.size)
      );
    });
  }

  /*  
......................................................................................................
* This is the setvalidationforcontactarray function

* @param array is array of contact data 

* setvalidationforcontactarray is used to set validation rules for each row of array
.......................................................................................................
*/
  private setvalidationforcontactarray(array: any) {
    let i = 0;
    this.validationForContact = [];
    for (let data of array) {
      let validateRule = {
        MinLength: 1,
        MaxLength: 20,
        Pattern: '^[0-9]+$'
      };
      this.validationForContact.push(validateRule);
      this.adminsystemsetupservice.GetValidationRule(data.lookup_value_id).subscribe(response => {
        this.validationForContact[i].Pattern = response.data.Pattern;
        this.validationForContact[i].MaxLength = response.data.MaxLength;
        this.validationForContact[i].MinLength = response.data.MinLength;
        data.effectiveDate = this.datePipe.transform(data.effective_date, "yyyy-MM-dd");
        data.expiryDate = this.datePipe.transform(data.expiry_date, "yyyy-MM-dd");
        i++;
      }, (error => {
        this.validationForContact[i].Pattern = "^[0-9]+$";
        this.validationForContact[i].MaxLength = 20;
        this.validationForContact[i].MinLength = 1;
        data.effectiveDate = this.datePipe.transform(data.effective_date, "yyyy-MM-dd");
        data.expiryDate = this.datePipe.transform(data.expiry_date, "yyyy-MM-dd");
        i++;
      }));
    }
  }
  toggleArrowContact(k: any) {
    this.contactDll[k] = this.contactDll[k] === true ? false : true;
  }

  saveValidatedContactData() {
    let dateValidate = 0;
    for (let cdata of this.contactDataTable) {
      var d1 = Date.parse(cdata.effectiveDate);
      var d2 = Date.parse(cdata.expiryDate);
      if (d1 > d2) {
        dateValidate = 1
      }
    }
    if (dateValidate == 0) {
      this.adminsystemsetupservice.postContactData(this.contactDataTable).subscribe(
        (response) => {
          if (response.Statuscode === 200) {
            this.Success = true;
            this.toastr.success(response.Message);
            this.pageIndexContactData = 1
            this.dialogRef.close();
          }
        },
        (error) => {
          this.isInvalid = true;
          this.labelError = error.error.Message;
        }
      );
    } else {
      setTimeout(() => {
        this.toastr.error('Effective date should be smaller than Expiry Date');
      }, 500);
    }
  }

  /*  
......................................................................................................
* This is the saveContactData function

* saveContactData is used to save and update the data of grid
.......................................................................................................
*/
  saveContactData() {
    let counter = 1
    for (let data of this.contactDataTable) {
      data.phone_id = counter
      let phoneTypeId = data.phone_type_id
      data.phone_type_id = phoneTypeId
      let countryCode = data.country_code
      data.country_code = countryCode
      let val = data.value;
      data.value = val
      data.contact_id = this.rowData.lookup_value_id;
      data.effective_date = data.effectiveDate;
      data.expiry_date = data.expiryDate;
      counter++
    }
    this.ctrContactData = 0
    for (let a of this.contactDataTable) {
      if (a.effectiveDate == undefined || a.value == "" || a.lookup_value_id == 1 || a.country_code == '') {
        this.ctrContactData = this.ctrContactData + 1
      }
    }
    if (this.ctrContactData > 0) {
      setTimeout(() => {
        this.toastr.error("Please fill all the details");
      }, 500);
    }
    else {
      this.saveValidatedContactData()
    }
  }
  //#endregion
  //#endregion
  //#region Misc Data

  /*  
......................................................................................................
* This is the paginate function

* @param event is current selected page number of missc grid

* paginate is used to go from one page to another on missc grid 
.......................................................................................................
*/
  async paginate(event: any) {
    this.PageIndexMissData = event;
    this.currentMissPage = event;
    this.Miscellanousdata = new MatTableDataSource<any>(
      this.MymissDatable.slice(event * this.size - this.size, event * this.size)

    );
    let misdata = this.MymissDatable.slice(event * this.size - this.size, event * this.size)
    await this.setvalidationarrayformissc(misdata);
    this.rearrangeMissPaging();
  }

  /*  
  ......................................................................................................
  * This is the setValidationsMissc function
  
  * @param row is selected row on missc grid
  
  * @param k is selected index on missc grid
  
  * setValidationsMissc is used to set validation for selected DDL value
  .......................................................................................................
  */
  setValidationsMissc(value: any, k: any) {
    let index = (this.PageIndexMissData - 1) * this.size + k;
    this.MymissDatable[index].value = "";
    this.adminsystemsetupservice.GetValidationRule(value).subscribe(response => {
      if (response.data[0].LookupTypeId != null) {
        this.validationForMissc[k].domainValues = response.data;
        this.validationForMissc[k].lookupTypeId = 1;
      }
      this.validationForMissc[k].Pattern = response.data[0].Pattern;
      this.validationForMissc[k].MaxLength = response.data[0].MaxLength;
      this.validationForMissc[k].MinLength = response.data[0].MinLength;
    }, (error => {
      this.validationForMissc[k].Pattern = "^[ A-Za-z0-9_@./#&+-]*$";
      this.validationForMissc[k].MaxLength = 20;
      this.validationForMissc[k].MinLength = 1;
      this.validationForMissc[k].lookupTypeId = 0;
    }))
  }

  /*  
......................................................................................................
* This is the getMiscDataDropDownValues function

* getMiscDataDropDownValues is used to get the missc type DDL values based on from which page popup get opened
.......................................................................................................
*/
  getMiscDataDropDownValues() {
    let lookup_type_name = '';
    if (this.from == 'src') {
      lookup_type_name = "misc_Source System"
      this.adminsystemsetupservice.GetMisseDropValues(lookup_type_name, "").subscribe(dropdownpdata => {
        this.DropdownData = dropdownpdata.data;
      });
    }
    else if (this.from == "tax") {
      lookup_type_name = "misc_Tax module"
      let lookup_value_id = this.rowData.lookup_value_id
      this.adminsystemsetupservice.GetMiscDDLDataByTaxModuleId(lookup_type_name, lookup_value_id).subscribe(dropdownpdata => {
        this.DropdownData = dropdownpdata.data;
      });
    }
    else if (this.from == "subent") {
      lookup_type_name = "misc_Submitting Entity"
      this.adminsystemsetupservice.GetMisseDropValues(lookup_type_name, "").subscribe(dropdownpdata => {
        this.DropdownData = dropdownpdata.data;
      });
    }
    else if (this.from == "funent") {
      lookup_type_name = "misc_Fund Entity"
      this.adminsystemsetupservice.GetMisseDropValues(lookup_type_name, "").subscribe(dropdownpdata => {
        this.DropdownData = dropdownpdata.data;
      });
    }else if(this.from == "productCode")
    {
      lookup_type_name = "MISC_PRODUCT_CODE"
      this.adminsystemsetupservice.GetMisseDropValues(lookup_type_name, "").subscribe(dropdownpdata => {
        this.DropdownData = dropdownpdata.data;
      });
    }else if(this.from == "taxSrcCode")
    {
      lookup_type_name = "MISC_TAX_SOURCE_CODE"
      this.adminsystemsetupservice.GetMisseDropValues(lookup_type_name, "").subscribe(dropdownpdata => {
        this.DropdownData = dropdownpdata.data;
      });
    }
  }

  /*  
......................................................................................................
* This is the addrow function

* addrow is used to add empty row in missc grid for add new missc data
.......................................................................................................
*/
  addrow() {
    this.counter = 0
    for (let a of this.MymissDatable) {
      if (a.effectiveDate == undefined || a.value == "" || a.lookup_value_id == 1) {
        this.counter = this.counter + 1
      }
    }
    if (this.counter > 0) {
      setTimeout(() => {
        this.toastr.error("Please fill all the details");
      }, 500);
    }
    else {
      let temp1 = {
        lookup_value_id: 1, value: '', effectiveDate: this.datePipe.transform(new Date(), "yyyy-MM-dd"), expiry_date: ''
      }
      this.MymissDatable.push(temp1);
      let validateRule = {
        MinLength: 1,
        MaxLength: 20,
        Pattern: '^[ A-Za-z0-9_@./#&+-]*$',
        lookupTypeId: 0,
        domainValues: []
      }
      this.validationForMissc.push(validateRule)
      this.totalMissPages = this.MymissDatable.length / this.size;
      this.totalMissPages = Math.ceil(this.totalMissPages);
      if (this.totalMissPages > 1) {
        this.currentMissPage = this.totalMissPages;
        this.PageIndexMissData = this.totalMissPages;
        this.Miscellanousdata = new MatTableDataSource<any>(
          this.MymissDatable.slice(this.totalMissPages * this.size - this.size, this.totalMissPages * this.size)
        );
      }
      else {
        this.Miscellanousdata = new MatTableDataSource<any>(
          this.MymissDatable.slice(0, this.size)
        );
      }
      this.rearrangeMissPaging();
    }
    this.a = this.pageIndex;
  }
  groupBy(list: any, keyGetter: any) {
    const map = new Map();
    list.forEach((item: any) => {
      const key = keyGetter(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return map;
  }

  /*  
......................................................................................................
* This is the GetMiscellanousData function

* GetMiscellanousData is used to get missc data
.......................................................................................................
*/
  async GetMiscellanousData() {
    this.newMisData.contact_id = this.rowData.lookup_value_id
    this.newMisData.Page = this.pageIndex
    this.newMisData.Size = this.size
    this.newMisData.SearchText = '';
    this.newMisData.contact_type = 'misc'
    this.adminsystemsetupservice.GetMiscOrLegalDataById1(this.newMisData).then(async miscellanoudata => {
      this.reponse = miscellanoudata
      const key = 'lookup_type'
      this.GroupedMiscDatatable = Object.values(this.reponse.data.reduce((acc: any, item: any) => (acc[item[key]] = [...(acc[item[key]] || []), item], acc), {}));
      let tempDataTable = []
      for (const iterator of this.GroupedMiscDatatable) {
        for (const iterator2 of iterator) {
          tempDataTable.push(iterator2)
        }
      }
      this.MymissDatable = tempDataTable;
      this.Miscellanousdata = new MatTableDataSource<any>(
        this.MymissDatable.slice(0, this.size)
      );
      this.totalMissPages = this.MymissDatable.length / this.size;
      this.totalMissPages = Math.ceil(this.totalMissPages);
      this.rearrangeMissPaging();
      let misdata = this.MymissDatable.slice(0, this.size)
      await this.setvalidationarrayformissc(misdata);
    }, (error => {
      let temp1 = {
        lookup_value_id: 1, value: '', effectiveDate: this.datePipe.transform(new Date(), "yyyy-MM-dd"), expiry_date: ''
      }
      this.MymissDatable.push(temp1);
      let validateRule = {
        MinLength: 1,
        MaxLength: 20,
        Pattern: '^[ A-Za-z0-9_@./#&+-]*$',
        lookupTypeId: 0,
        domainValues: []
      }
      this.validationForMissc.push(validateRule)
      this.miscDataLoad = 1
      this.Miscellanousdata = new MatTableDataSource<any>(
        this.MymissDatable.slice(0, this.size)
      );
    }));
  }

  /*  
......................................................................................................
* This is the setvalidationarrayformissc function

* @param array is array of missc data 

* setvalidationarrayformissc is used to set validation rules for each row of array
.......................................................................................................
*/
  private async setvalidationarrayformissc(array: any) {
    let v = 0;
    this.validationForMissc = [];
    for (let data of array) {
      let validateRule = {
        MinLength: 1,
        MaxLength: 20,
        Pattern: '^[ A-Za-z0-9_@./#&+-]*$',
        lookupTypeId: 0,
        domainValues: []
      };
      this.validationForMissc.push(validateRule);
      this.validationForMissc[v].domainValues = [];
      await this.adminsystemsetupservice.GetValidationRulePromise(data.lookup_value_id).then(response => {
        this.validationResponse = response;
        if (this.validationResponse.data[0].LookupTypeId != null) {
          this.validationForMissc[v].domainValues = this.validationResponse.data;
          this.validationForMissc[v].lookupTypeId = 1;
        }
        this.validationForMissc[v].Pattern = this.validationResponse.data[0].Pattern;
        this.validationForMissc[v].MaxLength = this.validationResponse.data[0].MaxLength;
        this.validationForMissc[v].MinLength = this.validationResponse.data[0].MinLength;
        data.effective_date = this.datePipe.transform(data.effective_date, "yyyy-MM-dd");
        data.expiry_date = this.datePipe.transform(data.expiry_date, "yyyy-MM-dd");
        data.effectiveDate = data.effective_date;
        data.ExpiryDate = data.expiry_date;
        v++;
      }, (error => {
        this.validationForMissc[v].Pattern = "^[ A-Za-z0-9_@./#&+-]*$";
        this.validationForMissc[v].MaxLength = 20;
        this.validationForMissc[v].MinLength = 1;
        this.validationForMissc[v].domainValues = [];
        this.validationForMissc[v].lookupTypeId = 0;
        data.effective_date = this.datePipe.transform(data.effective_date, "yyyy-MM-dd");
        data.expiry_date = this.datePipe.transform(data.expiry_date, "yyyy-MM-dd");
        data.effectiveDate = data.effective_date;
        data.ExpiryDate = data.expiry_date;
        v++;
      }));
      if (this.MymissDatable.length == this.validationForMissc.length) {
        this.miscDataLoad = 1;
      }
    }
  }
  toggleArrowValueMissc(k: any) {
    this.misscValueDll[k] = this.misscValueDll[k] === true ? false : true;
  }
  toggleArrowMissc(k: any) {
    this.misscDll[k] = this.misscDll[k] === true ? false : true;
  }


  /*  
......................................................................................................
* This is the AddMiscellaneosData function

* AddMiscellaneosData is used to save and update the data of grid
.......................................................................................................
*/
  AddMiscellaneosData() {
    let counter = 1
    for (let addmis of this.MymissDatable) {
      addmis.other_misc_info_id = counter;
      addmis.contact_id = this.rowData.lookup_value_id;
      addmis.effective_date = addmis.effectiveDate;
      addmis.expiry_date = addmis.ExpiryDate;
      addmis.contact_type = 'misc'
      counter++
    }
    this.counter = 0
    for (let a of this.MymissDatable) {
      if (a.effective_date == undefined || a.value == "" || a.lookup_value_id == 1) {
        this.counter = this.counter + 1
      }
    }
    if (this.counter > 0) {
      setTimeout(() => {
        this.toastr.error("Please fill all the details");
      }, 500);
    }
    else {
      let dateValidate = 0;
      for (let mdata of this.MymissDatable) {
        var d1 = Date.parse(mdata.effectiveDate);
        var d2 = Date.parse(mdata.ExpiryDate);
        if (d1 > d2) {
          dateValidate = 1
        }
      }
      if (dateValidate == 0) {
        this.adminsystemsetupservice.PostMiscellaneosData(this.MymissDatable).subscribe(
          (response) => {
            this.saveMiscAndLegalData(response)
          },
          (error) => {
            this.isInvalid = true;
            this.labelError = error.error.Message;
          }
        );
      }
      else {
        setTimeout(() => {
          this.toastr.error('Effective date should be smaller than Expiry Date');
        }, 500);
      }
    }
  }
  //#endregion
  //#region Legal Data

  /*  
......................................................................................................
* This is the getLegalDropDownValues function

* getLegalDropDownValues is used to get the legal type DDL values based on from which page popup get opened
.......................................................................................................
*/
  getLegalDropDownValues() {
    let lookup_type_name = ''
    let type = "Legal Data"
    if (this.from == 'subent') {
      lookup_type_name = "lgl_Submitting Entity"
    }
    else if (this.from == "funent") {
      lookup_type_name = "lgl_Fund Entity"
    }
    this.adminsystemsetupservice.GetMisseDropValues(lookup_type_name, type).subscribe(dropdownpdata => {
      this.ddlLegalData = dropdownpdata.data;
    });
  }

  /*  
......................................................................................................
* This is the paginateLegalData function

* @param event is current selected page number of legal grid

* paginateLegalData is used to go from one page to another on legal grid 
.......................................................................................................
*/
  async paginateLegalData(event: any) {
    this.pageIndexLegalData = event
    this.currentLegalDataPage = event;
    this.legalDataSource = new MatTableDataSource<any>(
      this.legalDataTable.slice(event * this.size - this.size, event * this.size)
    );
    let legaldata = this.legalDataTable.slice(event * this.size - this.size, event * this.size)
    await this.setvalidationforleaglarray(legaldata);
    this.rearrangeLegalDataPaging();
  }
  testValidation(validationData: any, index: any, value: any, className: any) {
    var paragraph = document.getElementById(className + '-p-' + index);
    var lengthMsg = document.getElementById(className + '-l-' + index);
    var pattern = new RegExp(validationData.Pattern);
    if ((value.length < validationData.MinLength || value.length > validationData.MaxLength) && lengthMsg) {
      var textLength = document.createTextNode("\n\u2022 Minimum " + validationData.MinLength + " & Maximum " + validationData.MaxLength + " characters required");
      lengthMsg.innerHTML = '';
      lengthMsg.appendChild(textLength);
    } else {
      if (lengthMsg) {
        lengthMsg.innerHTML = '';
      }
    }
    if (pattern.test(value)) {
      if (paragraph) {
        paragraph.innerHTML = ''
      }
    } else {
      if (paragraph) {
        var textPattern = document.createTextNode("\n\u2022 Please follow validation Pattern");
        paragraph.innerHTML = '';
        paragraph.appendChild(textPattern);
      }
    }
  }
  toggleArrowLegal(k: any) {
    this.legalDll[k] = this.legalDll[k] === true ? false : true;
  }
  toggleArrowValueLegal(k: any) {
    this.legalValueDll[k] = this.legalValueDll[k] === true ? false : true;
  }

  /*  
......................................................................................................
* This is the setValidationsLegal function

* @param row is selected row on legal grid

* @param k is selected index on legal grid

* setValidationsLegal is used to set validation for selected DDL value
.......................................................................................................
*/
  setValidationsLegal(value: any, k: any) {
    let index = (this.pageIndexLegalData - 1) * this.size + k;
    this.legalDataTable[index].value = ""
    this.adminsystemsetupservice.GetValidationRule(value).subscribe(response => {
      if (response.data[0].LookupTypeId != null) {
        this.validationForLegal[k].domainValues = response.data;
        this.validationForLegal[k].lookupTypeId = 1;
      }
      this.validationForLegal[k].Pattern = response.data[0].Pattern;
      this.validationForLegal[k].MaxLength = response.data[0].MaxLength;
      this.validationForLegal[k].MinLength = response.data[0].MinLength;
    }, (error => {
      this.validationForLegal[k].Pattern = "^[ A-Za-z0-9_@./#&+-]*$";
      this.validationForLegal[k].MaxLength = 20;
      this.validationForLegal[k].MinLength = 1;
      this.validationForMissc[k].lookupTypeId = 0;
    }))
  }
  get formStatusLegal() {
    let form = false
    var Form = document.forms
    for (let i = 0; i < Form.length; i++) {
      if (Form[i].name == 'legalForm') {
        if (Form[i].checkValidity()) {
          form = true
        } else {
          form = false
        }
      }
    }
    return form
  }

  /*  
  ......................................................................................................
  * This is the addLegalDataRow function
  
  * addLegalDataRow is used to add empty row in legal grid for add new legal data
  .......................................................................................................
  */
  addLegalDataRow() {
    this.ctrLegalData = 0
    for (let a of this.legalDataTable) {
      if (a.effectiveDate == undefined || a.value == "" || a.lookup_value_id == 1) {
        this.ctrLegalData = this.ctrLegalData + 1
      }
    }
    if (this.ctrLegalData > 0) {
      setTimeout(() => {
        this.toastr.error("Please fill all the details");
      }, 500);
    }
    else {
      let temp1 = {
        lookup_value_id: 1, value: '', effectiveDate: this.datePipe.transform(new Date(), "yyyy-MM-dd"), expiryDate: ''
      }
      this.legalDataTable.push(temp1);
      let validateRule = {
        MinLength: 0,
        MaxLength: 0,
        Pattern: '[a-zA-Z ]+',
        lookupTypeId: 0,
        domainValues: []
      }
      this.validationForLegal.push(validateRule)
      this.totalLegalDataPages = this.legalDataTable.length / this.size;
      this.totalLegalDataPages = Math.ceil(this.totalLegalDataPages);
      if (this.totalLegalDataPages > 1) {
        this.currentLegalDataPage = this.totalLegalDataPages;
        this.pageIndexLegalData = this.totalLegalDataPages;
        this.legalDataSource = new MatTableDataSource<any>(
          this.legalDataTable.slice(this.totalLegalDataPages * this.size - this.size, this.totalLegalDataPages * this.size)
        );
      }
      else {
        this.legalDataSource = new MatTableDataSource<any>(
          this.legalDataTable.slice(0, this.size)
        );
      }
      this.rearrangeLegalDataPaging();
    }
    this.a = this.pageIndex;
  }

  /*  
......................................................................................................
* This is the getLegalData function

* getLegalData is used to get legal data
.......................................................................................................
*/
  async getLegalData() {
    this.newLegalData.contact_id = this.rowData.lookup_value_id
    this.newLegalData.Page = this.pageIndex
    this.newLegalData.Size = 7
    this.newLegalData.SearchText = ''
    this.newLegalData.contact_type = 'lgl'
    this.adminsystemsetupservice.GetMiscOrLegalDataById1(this.newLegalData).then(async legalResponseData => {
      this.reponse = legalResponseData;
      if (this.reponse.Statuscode == 200) {
        if (this.reponse.data.length > 0) {
          this.groupLegalDataTable();

        }
      }
      else {
        this.legalDataTable = [];
      }
      this.legalDataSource = new MatTableDataSource<any>(
        this.legalDataTable.slice(0, this.size)
      );
      let legaldata = this.legalDataTable.slice(0, this.size)
      await this.setvalidationforleaglarray(legaldata);
      this.totalLegalDataPages = this.legalDataTable.length / this.size;
      this.totalLegalDataPages = Math.ceil(this.totalLegalDataPages);
      this.rearrangeLegalDataPaging();
    }, (error) => {
      let temp1 = {
        lookup_value_id: 1, value: '', effectiveDate: this.datePipe.transform(new Date(), "yyyy-MM-dd"), expiryDate: '',
      }
      this.legalDataTable.push(temp1);
      let validateRule = {
        MinLength: 0,
        MaxLength: 0,
        Pattern: '[a-z ]+',
        lookupTypeId: 0,
        domainValues: []
      }
      this.validationForLegal.push(validateRule)
      this.legalDataSource = new MatTableDataSource<any>(
        this.legalDataTable.slice(0, this.size)
      );
    });
  }

  /*  
......................................................................................................
* This is the setvalidationforleaglarray function

* @param array is array of legal data 

* setvalidationforleaglarray is used to set validation rules for each row of array
.......................................................................................................
*/
  private async setvalidationforleaglarray(array: any) {
    let i = 0;
    this.validationForLegal = [];
    for (let data of array) {
      let validateRule = {
        MinLength: 0,
        MaxLength: 0,
        Pattern: '[a-z ]+',
        lookupTypeId: 0,
        domainValues: []
      };
      this.validationForLegal.push(validateRule);
      await this.adminsystemsetupservice.GetValidationRulePromise(data.lookup_value_id).then(response => {
        this.validationResponse = response;
        if (this.validationResponse.data[0].LookupTypeId != null) {
          this.validationForLegal[i].domainValues = this.validationResponse.data;
          this.validationForLegal[i].lookupTypeId = 1;
        }
        this.validationForLegal[i].Pattern = this.validationResponse.data[0].Pattern;
        this.validationForLegal[i].MaxLength = this.validationResponse.data[0].MaxLength;
        this.validationForLegal[i].MinLength = this.validationResponse.data[0].MinLength;
        data.effectiveDate = this.datePipe.transform(data.effective_date, "yyyy-MM-dd");
        data.expiryDate = this.datePipe.transform(data.expiry_date, "yyyy-MM-dd");
        i++;
      }, (error => {
        this.validationForLegal[i].Pattern = "^[ A-Za-z0-9_@./#&+-]*$";
        this.validationForLegal[i].MaxLength = 20;
        this.validationForLegal[i].MinLength = 1;
        data.effectiveDate = this.datePipe.transform(data.effective_date, "yyyy-MM-dd");
        data.expiryDate = this.datePipe.transform(data.expiry_date, "yyyy-MM-dd");
        i++;
      }));
    }
  }


  private groupLegalDataTable() {
    const key = 'lookup_type';
    this.GroupedLegalDatatable = Object.values(this.reponse.data.reduce((acc: any, item: any) => (acc[item[key]] = [...(acc[item[key]] || []), item], acc), {}));
    let tempDataTable = [];
    for (const iterator of this.GroupedLegalDatatable) {
      for (const iterator2 of iterator) {
        tempDataTable.push(iterator2);
      }
    }
    this.legalDataTable = tempDataTable;
  }

  /*  
......................................................................................................
* This is the saveMiscAndLegalData function

* saveMiscAndLegalData is used to save and update the data of grid
.......................................................................................................
*/
  saveMiscAndLegalData(response: any) {
    if (response.Statuscode === 200) {
      this.Success = true;
      this.toastr.success(response.Message);
      this.pageIndex = 1
      this.dialogRef.close();
    }
  }
  saveLegalData() {
    let counter = 1;
    for (let data of this.legalDataTable) {
      data.other_misc_info_id = counter;
      data.contact_id = this.rowData.lookup_value_id;
      data.effective_date = data.effectiveDate;
      data.expiry_date = data.expiryDate;
      data.contact_type = 'lgl'
      counter++
    }
    this.ctrLegalData = 0
    for (let a of this.legalDataTable) {
      if (a.effectiveDate == undefined || a.value == "" || a.lookup_value_id == 1) {
        this.ctrLegalData = this.ctrLegalData + 1
      }
    }
    if (this.ctrLegalData > 0) {
      setTimeout(() => {
        this.toastr.error("Please fill all the details");
      }, 500);
    }
    else {
      let dateValidate = 0;
      for (let ldata of this.legalDataTable) {
        var d1 = Date.parse(ldata.effectiveDate);
        var d2 = Date.parse(ldata.expiryDate);
        if (d1 > d2) {
          dateValidate = 1
        }
      }
      if (dateValidate == 0) {
        this.adminsystemsetupservice.PostMiscellaneosData(this.legalDataTable).subscribe(
          (response) => {
            this.saveMiscAndLegalData(response);
          },
          (error) => {
            this.isInvalid = true;
            this.labelError = error.error.Message;
          }
        );
      } else {
        setTimeout(() => {
          this.toastr.error('Effective date should be smaller than Expiry Date');
        }, 500);
      }
    }
  }
  //#endregion
}
