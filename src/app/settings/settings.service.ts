import { Injectable } from '@angular/core';
import { RestApiService } from '../sharedServices/rest-api.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Device } from '@awesome-cordova-plugins/device/ngx';
import { CommonService } from '../sharedServices/commonServices/common.service';
import { ApiUrls } from '../constants/api-urls';
import { LoadingService } from '../sharedServices/loading.service';
import { Storage } from '@ionic/storage';
import { Constants } from '../constants/constants';
import { AlertService } from '../sharedServices/alert.service';
import { DisplayConstants } from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  displayProperties = DisplayConstants.properties;
  constructor(
    private restService: RestApiService,
    private alertService: AlertService,
    private router: Router,
    private device: Device,
    private commonService: CommonService,
    private loadingService: LoadingService,
    private storage: Storage,
    private loader: LoadingService
  ) { }

  sessionClearAndLogout() {
    this.loadingService.present();
    const data = {};
    data['userId'] = this.commonService.getUserInfo()._id;
    data['manufacturer'] = this.device.manufacturer;
    data['model'] = this.device.model;
    data['platform'] = this.device.platform;
    data['uuid'] = this.device.uuid;
    data['version'] = this.device.version;
    this.restService.postServiceProcess(ApiUrls.logout, data).subscribe(
      response => {
        if (response['status'] === Constants.offlineStatus) {
          this.alertService.presentAlert(this.displayProperties.checkNetwork);
        } else {
          this.storage.clear();
          this.loadingService.dismiss();
          localStorage.clear();
          this.commonService.setTaskDBInfo('');
          this.commonService.setFormDBInfo('');
          this.commonService.setUserInfo('');
          this.commonService.setTaskDBInfo(null);
          this.commonService.setFormDBInfo(null);
          this.router.navigate(['login']);
        }
      },
      error => {
        this.loadingService.dismiss();
        this.commonService.showErrorResponseAlert(error.status, error.message);
      });

  }

  getSettings(url) {
    const headers = this.restService.getHeadersForGet();
    return new Observable<any>(observer => {
      this.restService.getServiceProcess(url, headers)
        .subscribe(res => {
          try  {
            if (res['status'] === Constants.offlineStatus) {
              this.loader.dismiss();
            } else {
              const response = res['data'];
              const returnData = response;
              // returnData.storeLink = response['storeLink'];
              observer.next(returnData);
              observer.complete();
              this.loader.dismiss();

            }
          } catch (e) {
            this.loader.dismiss();
          }
        }, error => {
          const returnData = { res: [], infiniteScrollDisable: false };
          observer.next(returnData);
          observer.complete();
          this.loader.dismiss();
        });
    });
  }
}
