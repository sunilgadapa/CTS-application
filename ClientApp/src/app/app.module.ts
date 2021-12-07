import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, APP_INITIALIZER } from '@angular/core';
import { NgxPaginationModule } from "ngx-pagination";
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule,routes } from './app-routing.module';
import { MatBadgeModule } from '@angular/material/badge';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { UserMananagementComponent } from './user-management/user-mananagement/user-mananagement.component';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatTableModule } from "@angular/material/table";
import { MatDialogModule } from '@angular/material/dialog';
import { UsermanagmentService } from './_services/userManagement/usermanagment.service';
import { AdduserComponent } from './user-management/adduser/adduser.component';
import { AuthenticationService } from './_services/identity/authentication.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MenudrawerComponent } from './common/side-drawer/menudrawer/menudrawer.component';
import { HeaderComponent } from './common/header-nav/header/header.component';
import { CommonModule, HashLocationStrategy, LocationStrategy,DatePipe } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ToastrModule } from 'ngx-toastr';
import { DeletePopupComponent } from './common/delete-popup/delete-popup.component';
import { DashboardComponent } from './common/dash-board/dashboard/dashboard.component'
import { MatExpansionModule } from '@angular/material/expansion';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SourceSystemComponent,AddsourceDialog } from './admin/system-setup/source-system/source-system.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TaxModuleComponent,AddtaxDialog } from './admin/system-setup/tax-module/tax-module.component';
import { DomainReferencesComponent,AddnewDomain } from './admin/system-setup/domain-references/domain-references.component';
import { NotificationConfigurationComponent } from './admin/system-setup/notification-configuration/notification-configuration.component';
import { SubmittingEntityComponent,AddsubmitEntity } from './admin/system-setup/submitting-entity/submitting-entity.component';
import { FundEntityComponent,AddfundEntity } from './admin/system-setup/fund-entity/fund-entity.component';
import { ManualDataComponent } from './admin/manual-dataload/manual-data/manual-data.component';
import { ManualValidationComponent } from './admin/manual-dataload/manual-validation/manual-validation.component';
import { DataTableComponent } from './common/data-table/data-table.component';
import { CdkTableModule } from '@angular/cdk/table';
import { UploadFilePopupComponent } from './admin/manual-dataload/upload-file-popup/upload-file-popup.component';
import { ProcessFilePopupComponent } from './admin/manual-dataload/process-file-popup/process-file-popup.component';
import { AddMessagingDialog,MessagingEventComponent } from './admin/system-setup/messaging-event/messaging-event.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { AssignRoleComponent } from './admin/system-setup/notification-configuration/assign-role/assign-role.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { EntityPopupComponent } from './common/entity-popup/entity-popup.component';
import { AddDomainAllowedValueComponent } from './admin/system-setup/domain-references/add-domain-allowed-value/add-domain-allowed-value.component';
import { AddTemplateComponent } from './admin/system-setup/notification-configuration/add-template/add-template.component';
import { ManualUploadService } from "./_services/manualUpload/manualupload.service";
import { NotificationconfigurationService } from "./_services/admin/notificationconfiguration.service";
import { MsalInterceptor, MsalModule, MsalService } from '@azure/msal-angular';
import { MsalUserService } from './_services/identity/msaluser.service';
import { OnBoardingErrorComponent } from './common/on-boarding-error/on-boarding-error.component';
import { AddValidationsComponent } from './admin/system-setup/domain-references/add-validations/add-validations.component';
import { ViewerrorreportComponent } from './admin/manual-dataload/viewerrorreport/viewerrorreport.component';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
import { AdminSystemsetupService } from './_services/admin/adminsystemsetup.service'
import { PasManualDataloadComponent } from './pas-manual-dataload/pas-manual-dataload/pas-manual-dataload.component';
import { PasManualDataloadValidationComponent } from './pas-manual-dataload/pas-manual-dataload-validation/pas-manual-dataload-validation.component';
import { MatNativeDateModule,MAT_DATE_FORMATS } from '@angular/material/core';
import { PowerbiComponent } from './powerbi/powerbi.component';
import { PowerbiReportService } from './_services/admin/powerbi-report.service';
import { SignOffPopupComponent } from './pas-manual-dataload/sign-off-popup/sign-off-popup.component';
import { SarsDataSubmissionComponent } from './sars-submission/sars-data-submission/sars-data-submission.component';
import { DataSubmissionService } from './_services/dataSubmission/datasubmission.service';
export function tokenGetter() {
  return localStorage.getItem("token");
}
import { ConfigService } from './_services/config/config.service';
import { SessionInterceptor } from './_interceptors/session.interceptor';
import { MomentDateModule } from '@angular/material-moment-adapter';
import { PromoteFilePopupComponent } from './sars-submission/promote-file-popup/promote-file-popup.component';
import { ViewErrorReportComponent } from './common/view-error-report/viewerrorreport.component';
import { SarsValidationComponent } from './sars-submission/sars-validation/sars-validation.component';
import { SAVER, getSaver } from './_services/common/saver.providers'
import { ConfirmPopupComponent } from './common/confirm-popup/confirm-popup.component';
import { DownloadPopupComponent } from './common/download-progress/download-progress.component';
import { CorrespondenceComponent } from './correspondence/correspondence/correspondence.component';
import { CorrespondenceService } from './_services/correspondence/correspondence.service';
import { SafeUrlPipe } from './_pipe/safeUrl.pipe';
import { SafeHtmlPipe } from './_pipe/safeHtml.pipe';
import { SarsSnapshotComponent } from './sars-submission/sars-snapshot/sars-snapshot.component';
import { GenerateFilePopupComponent } from './correspondence/generate-file-popup/generate-file-popup.component';
import { ConfirmFilePopupComponent } from './sars-submission/confirm-file-popup/confirm-file-popup.component';
import { SavePopupComponent } from './common/save-popup/save-popup.component';
import { TaxPeriodComponent } from './admin/system-setup/tax-period/tax-period.component';
import { AddTaxperiodComponent } from './admin/system-setup/tax-period/add-taxperiod/add-taxperiod.component';
import { UploadEFilePopupComponent } from './sars-submission/upload-e-filling-popup/upload-e-filing-popup.component';
import { AddProductCodeComponent } from './admin/system-setup/product-code/add-product-code/add-product-code.component';
import { ProductCodeComponent } from './admin/system-setup/product-code/product-code.component';
import { TaxsourceCodeComponent } from './admin/system-setup/taxsource-code/taxsource-code.component';
import { AddtaxsourcecodeComponent } from './admin/system-setup/taxsource-code/addtaxsourcecode/addtaxsourcecode.component';
import { DashboardService } from './_services/dashboard/dashboard.service';
export const configFactory = (configService: ConfigService) => {
  return () => configService.loadAppConfig();
};
export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'YYYY/MM/DD',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};
export const protectedResourceMap: any =
  [
    // LOCALHOST
    ['https://localhost:44371/api/', ['api://4eb2bd8f-3e95-424c-89d9-2c90d2c7c786/test1']],
    ['https://localhost:44345/api/', ['api://4eb2bd8f-3e95-424c-89d9-2c90d2c7c786/test1']],
    ['https://localhost:44359/api/', ['api://4eb2bd8f-3e95-424c-89d9-2c90d2c7c786/test1']],
    ['https://localhost:44314/api/', ['api://4eb2bd8f-3e95-424c-89d9-2c90d2c7c786/test1']],
    ['https://localhost:44331/api/', ['api://4eb2bd8f-3e95-424c-89d9-2c90d2c7c786/test1']],
    ['https://localhost:44372/api/', ['api://4eb2bd8f-3e95-424c-89d9-2c90d2c7c786/test1']],
    ['https://localhost:44380/api/', ['api://4eb2bd8f-3e95-424c-89d9-2c90d2c7c786/test1']],
    ['https://localhost:44361/api/', ['api://4eb2bd8f-3e95-424c-89d9-2c90d2c7c786/test1']],
    ['https://localhost:44315/api/', ['api://4eb2bd8f-3e95-424c-89d9-2c90d2c7c786/test1']],
    
    // DEV
    ['https://app.customertaxplatform.dev.omapps.net:63431/api/', ['api://4eb2bd8f-3e95-424c-89d9-2c90d2c7c786/test1']],
    ['https://app.customertaxplatform.dev.omapps.net:63432/api/', ['api://4eb2bd8f-3e95-424c-89d9-2c90d2c7c786/test1']],
    ['https://app.customertaxplatform.dev.omapps.net:63433/api/', ['api://4eb2bd8f-3e95-424c-89d9-2c90d2c7c786/test1']],
    ['https://app.customertaxplatform.dev.omapps.net:63434/api/', ['api://4eb2bd8f-3e95-424c-89d9-2c90d2c7c786/test1']],
    ['https://app.customertaxplatform.dev.omapps.net:63435/api/', ['api://4eb2bd8f-3e95-424c-89d9-2c90d2c7c786/test1']],    
    ['https://app.customertaxplatform.dev.omapps.net:63436/api/', ['api://4eb2bd8f-3e95-424c-89d9-2c90d2c7c786/test1']],
    ['https://app.customertaxplatform.dev.omapps.net:63437/api/', ['api://4eb2bd8f-3e95-424c-89d9-2c90d2c7c786/test1']],
    ['https://app.customertaxplatform.dev.omapps.net:63438/api/', ['api://4eb2bd8f-3e95-424c-89d9-2c90d2c7c786/test1']],

    // QA
    ['https://app.customertaxplatform.qa.omapps.net:64431/api/', ['api://4eb2bd8f-3e95-424c-89d9-2c90d2c7c786/test1']],
    ['https://app.customertaxplatform.qa.omapps.net:64432/api/', ['api://4eb2bd8f-3e95-424c-89d9-2c90d2c7c786/test1']],
    ['https://app.customertaxplatform.qa.omapps.net:64433/api/', ['api://4eb2bd8f-3e95-424c-89d9-2c90d2c7c786/test1']],
    ['https://app.customertaxplatform.qa.omapps.net:64434/api/', ['api://4eb2bd8f-3e95-424c-89d9-2c90d2c7c786/test1']],
    ['https://app.customertaxplatform.qa.omapps.net:64435/api/', ['api://4eb2bd8f-3e95-424c-89d9-2c90d2c7c786/test1']],
    ['https://app.customertaxplatform.qa.omapps.net:64436/api/', ['api://4eb2bd8f-3e95-424c-89d9-2c90d2c7c786/test1']],
    ['https://app.customertaxplatform.qa.omapps.net:64437/api/', ['api://4eb2bd8f-3e95-424c-89d9-2c90d2c7c786/test1']],

    // UAT
    ['https://app.customertaxplatform.uat.omapps.net:63431/api/', ['api://4eb2bd8f-3e95-424c-89d9-2c90d2c7c786/test1']],
    ['https://app.customertaxplatform.uat.omapps.net:63432/api/', ['api://4eb2bd8f-3e95-424c-89d9-2c90d2c7c786/test1']],
    ['https://app.customertaxplatform.uat.omapps.net:63433/api/', ['api://4eb2bd8f-3e95-424c-89d9-2c90d2c7c786/test1']],
    ['https://app.customertaxplatform.uat.omapps.net:63434/api/', ['api://4eb2bd8f-3e95-424c-89d9-2c90d2c7c786/test1']],    
    ['https://app.customertaxplatform.uat.omapps.net:63435/api/', ['api://4eb2bd8f-3e95-424c-89d9-2c90d2c7c786/test1']],
    ['https://app.customertaxplatform.uat.omapps.net:63436/api/', ['api://4eb2bd8f-3e95-424c-89d9-2c90d2c7c786/test1']],
    ['https://app.customertaxplatform.uat.omapps.net:63437/api/', ['api://4eb2bd8f-3e95-424c-89d9-2c90d2c7c786/test1']],

     // PROD
     ['https://app.customertaxplatform.prod.omapps.net:63431/api/', ['api://4eb2bd8f-3e95-424c-89d9-2c90d2c7c786/test1']],
     ['https://app.customertaxplatform.prod.omapps.net:63432/api/', ['api://4eb2bd8f-3e95-424c-89d9-2c90d2c7c786/test1']],
     ['https://app.customertaxplatform.prod.omapps.net:63433/api/', ['api://4eb2bd8f-3e95-424c-89d9-2c90d2c7c786/test1']],
     ['https://app.customertaxplatform.prod.omapps.net:63434/api/', ['api://4eb2bd8f-3e95-424c-89d9-2c90d2c7c786/test1']],    
     ['https://app.customertaxplatform.prod.omapps.net:63435/api/', ['api://4eb2bd8f-3e95-424c-89d9-2c90d2c7c786/test1']],
     ['https://app.customertaxplatform.prod.omapps.net:63436/api/', ['api://4eb2bd8f-3e95-424c-89d9-2c90d2c7c786/test1']],
     ['https://app.customertaxplatform.prod.omapps.net:63437/api/', ['api://4eb2bd8f-3e95-424c-89d9-2c90d2c7c786/test1']],
    ];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserMananagementComponent,
    AdduserComponent,
    MenudrawerComponent,
    HeaderComponent,
    DeletePopupComponent,
    DashboardComponent,
    SourceSystemComponent,
    TaxModuleComponent,
    DomainReferencesComponent,
    AddnewDomain,
    MessagingEventComponent,
    NotificationConfigurationComponent,
    SubmittingEntityComponent,
    AddsubmitEntity,
    FundEntityComponent,
    AddfundEntity,
    ManualDataComponent,
    ManualValidationComponent,
    DataTableComponent,
    UploadFilePopupComponent,
    ProcessFilePopupComponent,
    AddMessagingDialog,
    EntityPopupComponent,
    AddsourceDialog,
    AddtaxDialog,
    AddDomainAllowedValueComponent,
    AssignRoleComponent,
    AddTemplateComponent,
    OnBoardingErrorComponent,
    AddValidationsComponent,
    ViewerrorreportComponent,
    PasManualDataloadComponent,
    PasManualDataloadValidationComponent,
    PowerbiComponent,
    SignOffPopupComponent,
    SarsDataSubmissionComponent,
    PromoteFilePopupComponent,
    ViewErrorReportComponent,
    SarsValidationComponent,
    ConfirmPopupComponent,
    DownloadPopupComponent,
    CorrespondenceComponent,
    SafeUrlPipe,
    SafeHtmlPipe,
    SarsSnapshotComponent,
    GenerateFilePopupComponent,
    ConfirmFilePopupComponent,
    SavePopupComponent,
    UploadEFilePopupComponent,
    TaxPeriodComponent,
    AddTaxperiodComponent,
    UploadEFilePopupComponent,
    ProductCodeComponent,
    AddProductCodeComponent,
    TaxsourceCodeComponent,
    AddtaxsourcecodeComponent
  ],
  imports: [
    MsalModule.forRoot({
      clientID: '4eb2bd8f-3e95-424c-89d9-2c90d2c7c786',
      authority: 'https://login.microsoftonline.com/00691924-e082-4301-a3dc-1732afd14289',
      protectedResourceMap: protectedResourceMap,
      redirectUri: window.location.origin == 'http://localhost:4200' ? window.location.origin : window.location.origin + '/ctsweb/',
    }),
    NgxLoadingModule.forRoot({
      primaryColour: '#ffffff',
      secondaryColour: '#009677',
      fullScreenBackdrop: true,
      animationType: ngxLoadingAnimationTypes.circle
    }),
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    NgxPaginationModule,
    HttpClientModule,
    MatCardModule,
    MatSlideToggleModule,
    MatGridListModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
    FormsModule,
    MatExpansionModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatProgressBarModule,
    MatBadgeModule,
    MatSelectModule,
    MatDividerModule,
    MatCheckboxModule,
    MatTableModule,
    MatTabsModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    MatDialogModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    MatTooltipModule,
    CommonModule,
    FlexLayoutModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-center',
      disableTimeOut: true,
      tapToDismiss: true,
      closeButton: true,
    }),
    MatExpansionModule,
    CdkTableModule,
    MatRadioModule,
    MomentDateModule

  ],
  providers: [
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: configFactory,
      multi: true,
      deps: [ConfigService]
    },

    MsalService,
    MsalUserService,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    //  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    UsermanagmentService, AuthenticationService, NotificationconfigurationService,
    DatePipe, ManualUploadService, MsalUserService, AdminSystemsetupService,
    MatDatepickerModule, PowerbiReportService, MomentDateModule, DataSubmissionService, 
    CorrespondenceService,DashboardService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SessionInterceptor,
      multi: true,
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    {provide: SAVER, useFactory: getSaver}
    
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
