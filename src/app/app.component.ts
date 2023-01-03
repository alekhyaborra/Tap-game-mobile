import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { CommonService } from './sharedServices/commonServices/common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { LoadingService } from './sharedServices/loading.service';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { ToastService } from './sharedServices/toast.service';
import { Constants } from './constants/constants';
import { Location } from '@angular/common';
import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';
import { PushNotificationService } from './sharedServices/push-notification.service';
import { ApiUrls } from './constants/api-urls';
import { AlertService } from './sharedServices/alert.service';
import { QueryProcessService } from './offline/query-process/query-process.service';
import { StorageService } from './sharedServices/storage.service';
import { LocalNotifications } from '@awesome-cordova-plugins/local-notifications/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  counter = 0;
  enableBackdrop: boolean;
  notificationClicked: boolean;
  showNotification: boolean;
  notificationsKeys = Constants.notificationsKeys;
  notificationData: any;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private commonService: CommonService,
    private router: Router,
    //private route : ActivatedRoute,
    private storage: Storage,
    private loader: LoadingService,
    private network: Network,
    private toastService: ToastService,
    private location: Location,
    private fcm: FCM,
    private pushNotificationService: PushNotificationService,
    //private alertService : AlertService,
    private queryProcessService: QueryProcessService,
    private storageService: StorageService,
    private localNotifications: LocalNotifications,
    private  androidPermissions:  AndroidPermissions
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.loader.present();
    this.platform.backButton.subscribeWithPriority(1, () => {
      this.location.subscribe(location => {
        if (location.url == '') {
          navigator['app'].exitApp();
        }
      });

      if (!this.loader.isLoading && !this.enableBackdrop) {
        if (this.router.url != "/dashboard" && this.router.url != "/login") {
          this.commonService.goBack();
        } else {
          if (this.counter == 0) {
            this.counter++;
            this.toastService.showToast(Constants.exitApp);
            setTimeout(() => { this.counter = 0 }, 10000);
          } else {
            navigator['app'].exitApp();
          }
        }
      }
    });

    this.storage.get("userInfo").then((userInfo) => {
      if (userInfo) {
        this.commonService.setUserInfo(userInfo);
      }
    })
    this.storage.get("mapInfo").then((mapInfo) => {
      if (mapInfo) {
        this.commonService.setMapType(mapInfo);
      }
    })
    this.platform.ready().then(() => {
      this.statusBar.backgroundColorByHexString('#3270dc');
      this.splashScreen.hide();
      this.fcm.getToken().then(token => {
       

      
      });
      this.fcm.onTokenRefresh().subscribe(token => {
       
      });
      this.fcm.onNotification().subscribe(data => {
       
    
        
        if (data.wasTapped) {
          this.notificationClicked = true;
          setTimeout(() => {
            this.getNotificationRecord(data);
          }, 500);
          setTimeout(() => this.isLatestVersion(), 1000);
        } else {
          // this.notificationData = data;
          // this.showNotification = true;
          this.localNotifications.schedule({
            id: Date.now(),
            title: data.title,
            text: data.body,
            data: data.notificationObject
          });
          this.localNotifications.on("click").subscribe(data=>{
            this.router.navigate(["/dashboard/notifications"]);
          })
        }
      });

      this.storage.get("userInfo").then((userInfo) => {
       
        if (userInfo) {
          if (!this.notificationClicked) {
            this.loader.dismiss();
          

            this.router.navigate(['dashboard']);
          }
        } else {
          this.router.navigate(['login']);
          this.loader.dismiss();
        }
      });
    });

    if (this.network.type == "none") {
      this.networkOff();
    } else {
      this.networkOn();
    }
     this.requestPermissions();
    //  this. filePermissions();
    this.network.onDisconnect().subscribe(() => {
      if (this.commonService.getApplicationNetworkStatus())
        this.networkOff();
    });
    this.network.onConnect().subscribe(() => {
      this.networkOn();
    });

  }

  requestPermissions(){
    this.androidPermissions.requestPermissions(["android.permission.BLUETOOTH_SCAN", "android.permission.BLUETOOTH_CONNECT"]).then((res) => {
      console.log("bluetooth and notifications permission granted : ", res);
    }).catch((err) => {
      console.log("bluetooth permission Error : ", err);
    })

  }

  
  isLatestVersion() {
    let versionnow;
    this.queryProcessService.getAppVersion().then(res => {
      versionnow = res;   
      this.storageService.storeVersionApp(versionnow)
    })
  }

  networkOn() {
    this.storage.get("isNetworkToggleOn").then((status) => {
      if (status == true || status == Constants.nullValue) {
        this.commonService.setApplicationNetworkStatus(true);
        this.commonService.changeNetworkStatus(true);
        this.enableBackdrop = false;
        this.toastService.dismissToast();
      }
    });
  }
  networkOff() {
    this.storage.get("isNetworkToggleOn").then((status) => {
      this.commonService.setApplicationNetworkStatus(false);
      if ((status == true || status == Constants.nullValue) && this.commonService.getUserInfo()) {
        this.commonService.setApplicationNetworkStatus(false);
        this.commonService.changeNetworkStatus(false);
        this.enableBackdrop = true;
        const that = this;
        let messag = Constants.offlineAlert;
        if (this.commonService.getFormFillerLoadStatus())
          messag = Constants.offlineSaveAlert;
        this.toastService.showOfflineToast(messag, function (noNavigation) {
          that.enableBackdrop = false;
          if (!noNavigation)
            that.router.navigate(['dashboard']);
        });
      }
    });
  }

  getNotificationRecord(item) {
    this.showNotification = false;
    const recordData = JSON.parse(item.notificationObject)
    let notificationurl;
    if (recordData[this.notificationsKeys.recordId]) {
      notificationurl = ApiUrls.getNotificationRecord + "/" + Constants.notificationType.workOrder + "/" + recordData[this.notificationsKeys.formId] + "/" + recordData[this.notificationsKeys.recordId];
    } else {
      notificationurl = ApiUrls.getNotificationRecord + "/" + Constants.notificationType.taskAssignment + "/" + recordData[this.notificationsKeys.formId] + "/" + recordData[this.notificationsKeys.assignmentId];
    }
    this.pushNotificationService.getNotificationRecord(notificationurl)
      .subscribe(res => {
        this.commonService.setNotificationRecord(res);
        if (recordData[this.notificationsKeys.recordId]) {
          this.router.navigate(["/dashboard/tasksList", recordData[this.notificationsKeys.taskId], (recordData[this.notificationsKeys.taskName] || "null"), recordData[this.notificationsKeys.assignmentId], recordData[this.notificationsKeys.assignmentName], recordData[this.notificationsKeys.formId], recordData[this.notificationsKeys.recordId]]);
        } else {
          this.router.navigate(["/dashboard/tasksList", recordData[this.notificationsKeys.assignmentId]]);
        }
        this.loader.dismiss();
      }, error => {
        this.storage.get("userInfo").then((userInfo) => {
          if (userInfo) {
            this.router.navigate(['dashboard']);
          } else {
            this.router.navigate(['login']);
          }
        });
        this.loader.dismiss();
      })
  }

  hideNotification(event) {
    this.showNotification = false;
  }

}
