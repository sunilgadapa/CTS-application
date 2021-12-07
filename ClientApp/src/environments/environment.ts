// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false, 
  identityBaseUrl:'https://localhost:44371/api/',
  userManagementBaseUrl:'https://localhost:44345/api/',
  adminBaseUrl:'https://localhost:44359/api/',
  domainDefinitionBaseUrl:'https://localhost:44314/api/',
  manualDataloadBaseUrl:'https://localhost:44331/api/',
  snsNotificationBaseUrl:'https://localhost:44380/api/',
  scopeUri: ['api://4eb2bd8f-3e95-424c-89d9-2c90d2c7c786/test1'],  
  tenantId: '00691924-e082-4301-a3dc-1732afd14289',  
  uiClienId: '4eb2bd8f-3e95-424c-89d9-2c90d2c7c786',  
  redirectUrl: 'http://localhost:4200'  
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */

