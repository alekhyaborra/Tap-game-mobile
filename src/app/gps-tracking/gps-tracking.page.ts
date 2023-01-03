import { GpsTrackerService } from './services/gps-tracker.service';
import { GpsDevicesService } from './../sharedServices/gps-devices.service';
import { Component, OnInit, Input, NgZone  } from '@angular/core';
import { ApiUrls } from '../constants/api-urls';
import { Constants } from '../constants/constants';
import { Router } from '@angular/router';
import { Device } from '@awesome-cordova-plugins/device/ngx';
import { Storage } from '@ionic/storage';

import { CommonService } from '../sharedServices/commonServices/common.service';
import { ToastService } from '../sharedServices/toast.service';
import {
  BackgroundGeolocation,
  BackgroundGeolocationConfig,
  BackgroundGeolocationResponse,
  BackgroundGeolocationEvents
} from '@awesome-cordova-plugins/background-geolocation/ngx';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';
import { FormBuilder, Validators } from '@angular/forms';
import { AlertService } from '../sharedServices/alert.service';

@Component({
  selector: 'app-gps-tracking',
  templateUrl: './gps-tracking.page.html',
  styleUrls: ['./gps-tracking.page.scss'],
})
export class GpsTrackingPage implements OnInit {
  emailForm;
  constructor( private router: Router,
    private device: Device,
    private storage: Storage,
    private commonservice: CommonService,
    private toastService: ToastService,
    private gpsDevicesService: GpsDevicesService,
    private backgroundGeolocation: BackgroundGeolocation,
    private http: HTTP,
    private gpsTrackerService: GpsTrackerService,
    private locationAccuracy: LocationAccuracy,
    private fb: FormBuilder,
    private alertService: AlertService,
    private commonService: CommonService,
    private zone: NgZone) {
      this.emailForm = this.fb.group({
        email : [this.commonService.getUserInfo().email],
        issue: ['', Validators.required],
        troubleshootedSteps: ['']
        });
     }
  gpsTrackingHeader = 'GPS Tracker';
  ishelmaplView = false;
  // gps releated vars
  navigeationSatatus = false;
  locationsLost = [];
  ngOnInit() {
    this.navigeationSatatus = this.gpsTrackerService.getGpsTrackerStatus();
  }
  goBack() {
    this.commonservice.goBack();
  }

  helmaplView (status) {
    this.ishelmaplView = status;
  }
  sendHelpMail () {
      const deviceInfo = {'model' :  this.device.model,
                          'platform': this.device.platform,
                          'version': this.device.version,
                          'username': this.commonservice.getUserInfo()._id
                         };
      const mailInfo = {...this.emailForm.value , ...deviceInfo};
      this.gpsTrackerService.sendHelpMail(mailInfo).subscribe((response) => {
        if (response.status === 200) {
          this.alertService.presentAlert(response.message);
        } else {
          this.alertService.presentAlert(Constants.internalServerProblem);
        }
      });
  }

  // gps functionns start

  enableGPsNavigeation(status) {
    if (status) {
      this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
        (resposne) => {
          this.gpsTrackerService.setGpsTrackerStatus(true);
          this.starNavigeation();
          // When GPS Turned ON call method to get Accurate location coordinates
        },
        error => {
          this.navigeationSatatus = false;
          this.toastService.showToast('Please Enalbe your gps for tracking');
          // alert('Error requesting location permissions ' + JSON.stringify(error));
        }
      );
    } else {
      this.stopNavigeation();
    }

  }
  getGpsEnableView () {
    this.router.navigate(['dashboard/settings/gpsDevice']);
  }

  starNavigeation( ) {
    this.toastService.showToast('GPS tracking started');
    const config: BackgroundGeolocationConfig = {
    stationaryRadius: 1,
    desiredAccuracy: 10,
    distanceFilter: this.gpsTrackerService.getDistance(),
    notificationTitle: 'Background tracking',
    notificationText: 'Enabled',
    debug: true,
    stopOnTerminate: false, // enable this to clear background location settings when the app terminates
    // startOnBoot	: true,
    // startForeground: true
    };

    this.backgroundGeolocation.configure(config).then(() => {
      this.backgroundGeolocation
        .on(BackgroundGeolocationEvents.location)
        .subscribe((location: BackgroundGeolocationResponse) => {
          this.zone.run(() => {
            this.sendGPS(location);
          });
          // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
          // and the background-task may be completed.  You must do this regardless if your operations are successful or not.
          // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
        }, (err) => {
         // this.toastService.showToast('erorrrrrrrrr');
        });
    });
    // sta
    // this.backgroundGeolocation
    //     .on(BackgroundGeolocationEvents.stationary)
    //     .subscribe((location: BackgroundGeolocationResponse) => {
    //      // this.toastService.showToast('stationary sucess');
    //       this.backgroundGeolocation.configure({ debug: true });
    //     }, (err) => {
    //       this.toastService.showToast('stationary erorrrrrrrrr');
    // });

    // forground config setting
    // this.backgroundGeolocation
    //     .on(BackgroundGeolocationEvents.foreground)
    //     .subscribe((location: BackgroundGeolocationResponse) => {
    //       // this.toastService.showToast('foreground sucess');
    //       this.backgroundGeolocation.configure({ debug: true });
    //       this.backgroundGeolocation
    //       .on(BackgroundGeolocationEvents.location).subscribe( (locationRf: BackgroundGeolocationResponse) => {
    //         this.sendGPS(location);
    //       });
    //     }, (err) => {
    //       this.toastService.showToast('foreground erorrrrrrrrr');
    // });

    // Background Config settings
    // this.backgroundGeolocation
    // .on(BackgroundGeolocationEvents.background)
    // .subscribe((location: BackgroundGeolocationResponse) => {
    //   // this.toastService.showToast('background sucess');
    // }, (err) => {
    //   this.toastService.showToast('background erorrrrrrrrr');
    // });

    // // start recording location
     this.navigeationSatatus = true;
     this.backgroundGeolocation.start();

    // If you wish to turn OFF background-tracking, call the #stop method.
  //  this.backgroundGeolocation.stop();
  }

  sendGPS(location) {
    if (location.speed === undefined) {
      location.speed = 0;
    }
    const timestamp = new Date(location.time);
    this.locationsLost.push(location);
    const trackData = {
      lat: location.latitude,
      lng: location.longitude,
      speed: location.speed,
      timestamp: timestamp,
      accuracy: location.accuracy ? location.accuracy : 'NA',
      isFromMockProvider: location.isFromMockProvider ?  location.isFromMockProvider : 'NA',
      altitude: location.altitude ? location.altitude : 'NA',
      userId  : this.commonservice.getUserInfo()._id
    };
    this.gpsTrackerService.trackLocation(trackData, this.backgroundGeolocation );
  }
  stopNavigeation () {
    this.toastService.showToast('GPS tracking was stopped');
    this.backgroundGeolocation.stop();
    this.navigeationSatatus = false;
    this.gpsTrackerService.setGpsTrackerStatus(false);
  }

}
