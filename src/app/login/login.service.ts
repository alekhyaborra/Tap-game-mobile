import { Injectable } from '@angular/core';
import { Login } from './login';
import { CommonService } from '../sharedServices/commonServices/common.service';
import { AlertService } from '../sharedServices/alert.service';
import { LoadingService } from '../sharedServices/loading.service';
import { RestApiService } from '../sharedServices/rest-api.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Constants, DisplayConstants } from '../constants/constants';
import { ApiUrls } from '../constants/api-urls';
import {QueryProcessService} from '../offline/query-process/query-process.service'
import {StorageService} from '../sharedServices/storage.service'
import { Observable } from 'rxjs';
 import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';
// import { FCM } from '@awesome-cordova-plugins/fcm/ngx';
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private commonService: CommonService,
    private alertService: AlertService,
    public loadingService: LoadingService,
    private restApiService: RestApiService,
    private alertController: AlertController,
    private router: Router,
    private fcm : FCM,
    private storageService: StorageService,
    private queryProcessService: QueryProcessService,
    ) { }

  login(user: Login, url: string) {
   
    if (this.commonService.getApplicationNetworkStatus()) {
    
      this.loadingService.present();
    //  .subscribe((object: any) => {
        //   var data = object;
        //  });
      this.restApiService.loginService(url, user).subscribe((response: any) => {
      //    const responseData = JSON.parse((<any>response).data);
          const responseData = response.status;
          this.loadingService.dismiss();
        
          if (responseData === 200) {
            this.commonService.setAppVersion(response.appVersion);
            this.storageService.storeVersionApp(response.appVersion);
            this.queryProcessService.insertAppVersion(response.appVersion)
         
            if (response[Constants.loginKeys.user][0].type === 2) {
              response[Constants.loginKeys.user][0].groupid = response[Constants.loginKeys.user][0].accounts[0]._id;
              response[Constants.loginKeys.user][0].groupname = response[Constants.loginKeys.user][0].accounts[0].name;
              response[Constants.loginKeys.user][0].token = response.token;
            //  responseData[Constants.appVersionKey] = Constants.appVersion;
              if (response[Constants.loginKeys.user][0].isFirstLogin) {
                this.commonService.setUserInfo(response[Constants.loginKeys.user][0]);
                this.router.navigate(['changePassword', response[Constants.loginKeys.user][0].username, response[Constants.loginKeys.user][0].type]);
              }
              else {
                this.commonService.setUserInfo(response[Constants.loginKeys.user][0]);
              
                 this.storageService.storeUserInfo(response[Constants.loginKeys.user][0]);
                 this.commonService.setMapType(response[Constants.loginKeys.mapType]);
                 this.storageService.mapInfo(response[Constants.loginKeys.mapType]);
                 
                this.getAllRefList();    
                       
              }
              this.fcm.getToken().then(token => {
                const data = {
                  fcmKey: token,
                  UUID: user.UUID
                }
                const tokenUrl = ApiUrls.sendDeviceKey + "/" + response.user[0]._id;
                const headers = this.restApiService.getHeadersForGet();
                this.restApiService.putServiceProcess(tokenUrl, data, headers)
                  .subscribe(res => { });
              });
            }
            else {
              this.alertService.presentAlert(Constants.invalidUser);
            }
          }
          else if (responseData == 205) {
            this.showConfirm(user)
          }
          else {
            this.alertService.presentAlert(response[Constants.loginKeys.message]);
          }
        },
        error => {
          console.log("Login Error", error)
          this.loadingService.dismiss();
          this.commonService.showErrorResponseAlert(error.status, error.message);
         
        });
     } 
     else {
       this.alertService.presentAlert(Constants.checkNetwork);
     }
  }

  forgotPassword(data) {
    this.loadingService.present();
    return new Observable<any>(observer => {
      this.restApiService.postServiceProcesswithoutHeader(ApiUrls.forgotPassword, data).subscribe(
        response => {
          this.loadingService.dismiss();
          observer.next(response);
          observer.complete();
        },
        error => {
          this.loadingService.dismiss();
          this.commonService.showErrorResponseAlert(error.status, error.message);
        });
    });
  }

  async showConfirm(user) {
  
    const alert = await this.alertController.create({
      message: Constants.userActiveMessabe,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Yes',
          handler: () => {
            alert.dismiss();
            this.login(user, ApiUrls.licenseReleaseForExistinglogin);
          }
        }
      ]
    });

    await alert.present();
  }
  getAllRefList(){
   
    this.queryProcessService.getAllRefList().
    then((queryResponse)=>{
      if(queryResponse.status == 0)
        this.router.navigate(['dashboard'])
      let referenceList = [];
      if(queryResponse['data'].length > 0){
        for (let i = 0; i < queryResponse['data'].length; i++) {
          referenceList.push({
            'name':queryResponse['data'][i]['name'],
            'version': queryResponse['data'][i]['version'],
          })  
        }       
        let url = ApiUrls.referenceList;
        let data = {"refList":referenceList}
        this.restApiService.postServiceProcess(url, data).subscribe(
          responseData => {
            this.router.navigate(['dashboard']);
            if(responseData['referenceList'] &&  responseData['referenceList'].length > 0){
            //  this.downloadService.downloadRerList(responseData['referenceList'], responseData['version']);
            }
          },
          error => {
            this.router.navigate(['dashboard']);
          });
      }else{
        this.router.navigate(['dashboard']);
      }
    })
  }
}
