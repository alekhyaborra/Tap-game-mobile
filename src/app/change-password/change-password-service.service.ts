import { Injectable } from '@angular/core';
import { AlertService } from '../sharedServices/alert.service';
import { LoadingService } from '../sharedServices/loading.service';
import { ApiUrls } from '../constants/api-urls';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router'
import { CommonService } from '../sharedServices/commonServices/common.service';
import { RestApiService } from '../sharedServices/rest-api.service';
import { Observable } from 'rxjs';
import { Constants } from '../constants/constants';
import { ToastService } from '../sharedServices/toast.service';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordServiceService {
  constructor(private router: Router,
    private alertService: AlertService,
    public loadingService: LoadingService,
    private commonService: CommonService,
    private restService: RestApiService,
    private storage: Storage,
    private toastService:ToastService,
    private loader : LoadingService) { }
  resp: any


  pwdCheckforChangePassword(password) {
    const data = {};
   data['username'] = CryptoJS.AES.encrypt(this.commonService.getUserInfo().username, 'F!3LD0N:M@G!KM!ND$').toString();
    data['type'] = this.commonService.getUserInfo().type;
    data['password'] = CryptoJS.AES.encrypt(password, 'F!3LD0N:M@G!KM!ND$').toString();
    const headers = this.restService.getHeadersForGet();
    return new Observable<any>(observer => {
      this.restService.postServiceProcess(ApiUrls.pwdCheckforChangePassword, data)
        .subscribe(res => {
          try {
            if (res["status"] === Constants.offlineStatus){
              const returnData = { status: Constants.offlineStatus};
              observer.next(returnData);
              observer.complete();
              this.loader.dismiss();
            } else {
              const returnData = { data: res};
              observer.next(returnData);
              observer.complete();
              this.loader.dismiss();

            }
          }catch(e){
            this.loader.dismiss();

          }
          
        }, error => {
          const returnData = { res: [], infiniteScrollDisable: false };
          observer.next(returnData);
          observer.complete();
          this.loader.dismiss();
        })
    });





  }


  changePassword(data) {
    this.restService.postServiceProcess(ApiUrls.changePassword, data).subscribe(
    response => {
      if (response['status'] == 200) {
        this.storage.clear();
        this.loadingService.dismiss();
        this.toastService.showToast(Constants.pwdchangeSuccess);

        this.router.navigate(['login'])
      } else if (response['status'] == 204) {
        this.loadingService.dismiss();
        this.alertService.presentAlert(response['message']);
      } else {
        this.loadingService.dismiss();
        this.alertService.presentAlert(response['message']);
      }
    },
    error => {
      this.loadingService.dismiss();
      this.commonService.showErrorResponseAlert(error.status, error.message);
    });
  }
}

