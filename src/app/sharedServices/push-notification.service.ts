import { Injectable } from '@angular/core';
import { LoadingService } from './loading.service';
import { RestApiService } from './rest-api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {

  constructor(
    private loader:LoadingService,
    private restService:RestApiService
  ) { }

  getNotificationRecord(url){
    const headers = this.restService.getHeadersForGet();
    return new Observable<any>(observer => {
      this.restService.getServiceProcess(url,headers)
        .subscribe(res => {
          try{
            const response = res;
            const returnData = { data: response};
            observer.next(returnData);
            observer.complete();
          }catch(e){
            observer.error();
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
