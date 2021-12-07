import { Injectable } from '@angular/core';
import { HttpClient, HttpBackend } from '@angular/common/http';


@Injectable()
export class ConfigService {
  static appConfig: any;
  private dataLoc: string;
  constructor(private handler: HttpBackend,
  ) { }

  loadAppConfig() {
    const hostname = window && window.location && window.location.hostname;

    if (/^.*localhost.*/.test(hostname)) {
      this.dataLoc = 'assets/config/config.local.json';
    } else if (/^app.customertaxplatform.dev.omapps.net/.test(hostname)) {     
      this.dataLoc = 'assets/config/config.dev.json';
    } else if (/^app.customertaxplatform.qa.omapps.net/.test(hostname)) {
      this.dataLoc = 'assets/config/config.qa.json';
    } else if (/^app.customertaxplatform.uat.omapps.net/.test(hostname)) {
      this.dataLoc = 'assets/config/config.uat.json';
    } else if (/^app.customertaxplatform.prod.omapps.net/.test(hostname)) {
      this.dataLoc = 'assets/config/config.prod.json';
    } else {
      console.warn(`Cannot find environment for host name ${hostname}`);
    }   
    return new HttpClient(this.handler).get(this.dataLoc)
      .toPromise()
      .then((data: any) => {
        ConfigService.appConfig = data;
      });
  }
  getConfig() {
    return ConfigService.appConfig;
  }
}
