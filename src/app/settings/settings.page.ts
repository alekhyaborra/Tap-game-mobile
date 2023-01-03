import { StorageService } from './../sharedServices/storage.service';
import { GpsDevicesService } from './../sharedServices/gps-devices.service';
import { Component, OnInit, Input, NgZone } from '@angular/core';
import { ApiUrls } from '../constants/api-urls';
import { Constants } from '../constants/constants';
import { Router } from '@angular/router';
import { Device } from '@awesome-cordova-plugins/device/ngx';
import { Storage } from '@ionic/storage';
import { SettingsService } from './settings.service';
import { LoadingService } from '../sharedServices/loading.service';
import { CommonService } from '../sharedServices/commonServices/common.service';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { ToastService } from '../sharedServices/toast.service';
import { AlertService } from '../sharedServices/alert.service';
import { DisplayConstants } from '../constants/constants';

import {
  BackgroundGeolocation,
  BackgroundGeolocationConfig,
  BackgroundGeolocationResponse,
  BackgroundGeolocationEvents
} from '@awesome-cordova-plugins/background-geolocation/ngx';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  settingsHeader: string = Constants.settingsHeader;
  hideHeaderButtons = true;
  ellipsePopoverList: Array<string> = [];
  user: any = {};
  username: any;
  networkStatus: boolean;
  detail: any;
  toggleStatus;
  navigeationSatatus;
  lastLogin;
  sAppLatestVersion: boolean;
  // location
  locationsLost = [];
  isAppLatestVersion = true;
  latestAppVersion: string;
  appVersion = Constants.appVersion;
  displayProperties = DisplayConstants.properties;
  playstoreLink: any;
  constructor(
    private router: Router,
    private device: Device,
    private storage: Storage,
    private settingsService: SettingsService,
    private loader: LoadingService,
    private commonservice: CommonService,
    private network: Network,
    private toastService: ToastService,
    private gpsDevicesService: GpsDevicesService,
    private backgroundGeolocation: BackgroundGeolocation,
    private http: HTTP,
    private zone: NgZone,
    private storageService: StorageService,
    private alertService: AlertService
  ) {
    // this.isLatestVersion();
  }


  changePassword() {
    this.router.navigate(['dashboard/settings/changePassword']);
  }
  getGPsDevicesScreen() {
    this.router.navigate(['dashboard/settings/devices']);
  }

  logout() {
    this.settingsService.sessionClearAndLogout();
  }

  networkToggle($event) {
    setTimeout(() => {
      if (this.network.type === 'none') {
        this.toggleStatus = false;
        this.networkStatus = this.toggleStatus;
        this.toastService.showToast(this.displayProperties.checkNetwork);
      } else {
        this.toggleStatus = $event.detail.checked;
        this.networkStatus = this.toggleStatus;
        this.storage.set('isNetworkToggleOn', this.toggleStatus);
        this.commonservice.setApplicationNetworkStatus(this.toggleStatus);
      }
    }, 100);
  }

  aboutus() {
    this.router.navigate(['dashboard/settings/aboutus']);
  }

  ngOnInit() {
    this.commonservice.networkStatus.subscribe(status => {
      this.toggleStatus = status;
      this.networkStatus = this.toggleStatus;
    });
    this.settingsHeader = this.displayProperties.settingsHeader;
    this.username = this.commonservice.getUserInfo().username;
    this.lastLogin = this.commonservice.getUserInfo().lastLoggedInTime;
    this.toggleStatus = this.commonservice.getApplicationNetworkStatus();
    this.networkStatus = this.toggleStatus;
  }

  getGpsEnableView() {
    this.router.navigate(['dashboard/settings//gpsDevice']);
  }

  isLatestVersion() {
    let version = this.storageService.getStoreAppVersion()
      if (Constants.appVersion === version) {
        this.isAppLatestVersion = true;
      } else {
        this.isAppLatestVersion = false;
        this.latestAppVersion = version
      }
  }

  // isLatestVersion() {
  //   this.storageService.getStoreAppVersion().then(version => {
  //     // tslint:disable-next-line:radix
  //     if (Constants.appVersion === version) {
  //       this.isAppLatestVersion = true;
  //     } else {
  //       this.isAppLatestVersion = false;
  //       this.latestAppVersion = version;
  //     }
  //   });
  // }

  getVersion() {
    this.loader.present();
    const url = ApiUrls.getAppVersion + '/' + this.device.platform;
    this.settingsService.getSettings(url)
      .subscribe(res => {
        this.playstoreLink = res.storeLink ? res.storeLink : '';
        if (res.appVersion[0].androidAppVersion === Constants.appVersion) {
          this.isAppLatestVersion = true;
          this.alertService.presentAlert(this.displayProperties.versionUpdate);
        } else {
          this.isAppLatestVersion = false;
          this.latestAppVersion = res.appVersion[0].androidAppVersion;
          this.storageService.storeVersionApp(res.appVersion[0].androidAppVersion);
          this.commonservice.appVersionUpdate.next(res.appVersion[0].androidAppVersion);
        }
        this.loader.dismiss();
      }, error => {
        this.commonservice.showErrorResponseAlert(error.status, error.message);
        this.loader.dismiss();
      });
  }
  gotToPlaystore() {
    if (this.playstoreLink) {
      window.open(this.playstoreLink,  '_system', 'location=yes');
    } else {
      this.alertService.presentAlert(this.displayProperties.storeLinkNotAvilable);
    }
  }

  referenceList(){
    this.router.navigate(['dashboard/settings/reference-list']);
  }
}
