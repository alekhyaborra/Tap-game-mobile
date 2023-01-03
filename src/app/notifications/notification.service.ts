import { Injectable } from '@angular/core';
import { RestApiService } from '../sharedServices/rest-api.service';
import { Observable } from 'rxjs';
import { LoadingService } from '../sharedServices/loading.service';
import { Constants } from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor( 
    private restService : RestApiService,
    private loader : LoadingService
  ) { }

  getNotifications(url){
    const headers = this.restService.getHeadersForGet();
    return new Observable<any>(observer => {
      this.restService.getServiceProcess(url,headers)
        .subscribe(res => {
          try{
            if(res["status"] == Constants.offlineStatus){
            const returnData = { status: "5001"};
              observer.next(returnData);
              observer.complete();
              this.loader.dismiss();
            } else {
              const response = res['data'];
              const returnData = { data: response};
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

  updateNotificationStatus(url,data){
    const headers = this.restService.getHeadersForGet();
    return new Observable<any>(observer => {
      this.restService.putServiceProcess(url,data,headers)
        .subscribe(res => {
          try{
            if(res["status"] == Constants.offlineStatus){
              const returnData = { data: []};
              observer.next(returnData);
              observer.complete();
              this.loader.dismiss();
            } else {
              const response = res;
              const returnData = { data: response};
              observer.next(returnData);
              observer.complete();
              this.loader.dismiss();
            }
          }catch(e){
            this.loader.dismiss();

          }
          
        }, error => {
          const returnData = { data: [], infiniteScrollDisable: false };
          observer.next(returnData);
          observer.complete();
          this.loader.dismiss();
        })
    });
  }

  getClickedRecordData(url){
    const headers = this.restService.getHeadersForGet();
    return new Observable<any>(observer => {
      this.restService.getServiceProcess(url,headers)
        .subscribe(res => {
          try{
            if(res["status"] == Constants.offlineStatus){
              console.group("you r offline")
              const returnData = { status: "5001"};
              observer.next(returnData);
              observer.complete();
              // this.loader.dismiss();
            } else {
              const response = res;
              const returnData = { data: response};
              observer.next(returnData);
              observer.complete();
              // this.loader.dismiss();

            }
          }catch(e){
            this.loader.dismiss();

          }
          
        }, error => {
          const returnData = { res: [], infiniteScrollDisable: false };
          observer.error(returnData);
          observer.complete();
          // this.loader.dismiss();
        })
    });
  }

}
