import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UserMananagementComponent } from './user-management/user-mananagement/user-mananagement.component';
import { AdduserComponent } from './user-management/adduser/adduser.component';
import { DashboardComponent } from './common/dash-board/dashboard/dashboard.component';
import { SourceSystemComponent } from './admin/system-setup/source-system/source-system.component';
import { TaxModuleComponent } from './admin/system-setup/tax-module/tax-module.component';
import { DomainReferencesComponent } from './admin/system-setup/domain-references/domain-references.component';
import { MessagingEventComponent } from './admin/system-setup/messaging-event/messaging-event.component';
import { NotificationConfigurationComponent } from './admin/system-setup/notification-configuration/notification-configuration.component';
import { SubmittingEntityComponent } from './admin/system-setup/submitting-entity/submitting-entity.component';
import { FundEntityComponent } from './admin/system-setup/fund-entity/fund-entity.component';
import { ManualDataComponent } from './admin/manual-dataload/manual-data/manual-data.component';
import { ManualValidationComponent } from './admin/manual-dataload/manual-validation/manual-validation.component';
import { OnBoardingErrorComponent } from './common/on-boarding-error/on-boarding-error.component';
import { ViewerrorreportComponent } from './admin/manual-dataload/viewerrorreport/viewerrorreport.component';
import { PowerbiComponent } from './powerbi/powerbi.component';
import { MsalGuard } from "@azure/msal-angular";
import { PasManualDataloadValidationComponent } from './pas-manual-dataload/pas-manual-dataload-validation/pas-manual-dataload-validation.component';
import { PasManualDataloadComponent } from './pas-manual-dataload/pas-manual-dataload/pas-manual-dataload.component';
import { SarsDataSubmissionComponent } from './sars-submission/sars-data-submission/sars-data-submission.component';
import { RoleGuard } from './_guards/role.guard';
import { RoleConstant } from './Constant/role.constant';
import { SarsValidationComponent } from './sars-submission/sars-validation/sars-validation.component';
import { ViewErrorReportComponent } from './common/view-error-report/viewerrorreport.component';
import { CorrespondenceComponent } from './correspondence/correspondence/correspondence.component';
import { SarsSnapshotComponent } from './sars-submission/sars-snapshot/sars-snapshot.component';
import { TaxPeriodComponent } from './admin/system-setup/tax-period/tax-period.component';
import { ProductCodeComponent } from './admin/system-setup/product-code/product-code.component';
import { TaxsourceCodeComponent } from './admin/system-setup/taxsource-code/taxsource-code.component';

export const routes: Routes = [  
  
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [MsalGuard],
    children: [
      { path: 'notonboarded', component: OnBoardingErrorComponent},
      { path: '', component: LoginComponent },
      { path: 'dashboard', component: DashboardComponent
      ,canActivate:[RoleGuard]
      , data:{ roleIds: [RoleConstant.Administrator,RoleConstant.Data_Load_Authorizer,RoleConstant.Data_Loader,RoleConstant.Data_submitter] }  },
      { path: 'usermanagement', component: UserMananagementComponent
      ,canActivate:[RoleGuard], data:{ roleIds: [RoleConstant.Security_Administrator] }},
      { path: 'adduser', component: AdduserComponent
      ,canActivate:[RoleGuard], data:{ roleIds: [RoleConstant.Security_Administrator] } },
      { path: 'sourcesystem', component: SourceSystemComponent,canActivate:[RoleGuard], data:{ roleIds: [RoleConstant.Administrator] }  },
      { path: 'taxperiod', component: TaxPeriodComponent,canActivate:[RoleGuard], data:{ roleIds: [RoleConstant.Administrator] }  },
      { path: 'taxmodule', component: TaxModuleComponent,canActivate:[RoleGuard], data:{ roleIds: [RoleConstant.Administrator] }  },
      { path: 'domainReferences', component: DomainReferencesComponent,canActivate:[RoleGuard], data:{ roleIds: [RoleConstant.Administrator] }  },
      { path: 'messagingEvent', component: MessagingEventComponent ,canActivate:[RoleGuard], data:{ roleIds: [RoleConstant.Administrator] } },
      { path: 'notificationConfig', component: NotificationConfigurationComponent,canActivate:[RoleGuard], data:{ roleIds: [RoleConstant.Administrator] }  },
      { path: 'submittingEntity', component: SubmittingEntityComponent ,canActivate:[RoleGuard], data:{ roleIds: [RoleConstant.Administrator] } },
      { path: 'fundEntity', component: FundEntityComponent,canActivate:[RoleGuard], data:{ roleIds: [RoleConstant.Administrator] }  },
      { path: 'manualData', component: ManualDataComponent
      ,canActivate:[RoleGuard], data:{ roleIds: [RoleConstant.Administrator] }  },
      { path: 'manualValidation', component: ManualValidationComponent
      ,canActivate:[RoleGuard], data:{ roleIds: [RoleConstant.Administrator] }  },
      { path: 'viewErrorReport', component: ViewerrorreportComponent
      ,canActivate:[RoleGuard], data:{ roleIds: [RoleConstant.Administrator] }  },
      { path: 'powerBI', component: PowerbiComponent ,canActivate:[RoleGuard], data:{ roleIds: [RoleConstant.Administrator] } },
      { path: 'pasmanualdataloadvalidation', component: PasManualDataloadValidationComponent },
      { path: 'pasmanualdataload', component:  PasManualDataloadComponent},
      { path: 'sarssubmission', component:  SarsDataSubmissionComponent,canActivate:[RoleGuard], data:{ roleIds: [RoleConstant.Administrator, RoleConstant.Data_submitter] } },
      { path: 'correspondence', component:  CorrespondenceComponent },
      { path: 'pasmanualdataload', component:  PasManualDataloadComponent,canActivate:[RoleGuard]
      , data:{ roleIds: [RoleConstant.Administrator,RoleConstant.Data_Load_Authorizer,RoleConstant.Data_Loader] } },
      { path: 'sarsValidation', component:  SarsValidationComponent,canActivate:[RoleGuard], data:{ roleIds: [RoleConstant.Administrator, RoleConstant.Data_submitter] } },
      { path: 'ViewErrorReport', component: ViewErrorReportComponent
      ,canActivate:[RoleGuard], data:{ roleIds: [RoleConstant.Administrator] }  },
      { path: 'sarsSnapshot', component:  SarsSnapshotComponent ,canActivate:[RoleGuard], data:{ roleIds: [RoleConstant.Administrator, RoleConstant.Data_submitter] } },
      { path: 'productcode', component:ProductCodeComponent,canActivate:[RoleGuard], data:{ roleIds: [RoleConstant.Administrator] }  },
      { path: 'taxsourcecode', component:TaxsourceCodeComponent,canActivate:[RoleGuard], data:{ roleIds: [RoleConstant.Administrator] }  },
    ]
  },
  { path: '**', component: LoginComponent, pathMatch: 'full', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
