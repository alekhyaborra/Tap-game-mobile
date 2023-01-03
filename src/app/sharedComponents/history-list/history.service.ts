import { Injectable } from '@angular/core';
import { RestApiService } from 'src/app/sharedServices/rest-api.service';
import { Observable } from 'rxjs';
import { Constants } from 'src/app/constants/constants';
import { LoadingService } from 'src/app/sharedServices/loading.service';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  constructor(private restService: RestApiService,
    private loader: LoadingService
  ) { }
  getHistoryRecords(url) {
    const headers = this.restService.getHeadersForGet();
    return new Observable<any>(observer => {
      this.restService.getServiceProcess(url, headers)
        .subscribe(res => {
          try {
            if (res["status"] == Constants.offlineStatus) {
              this.loader.dismiss();
            } else {
              if(res['status']==200){
                const response = res['data'];
                const infiniteScrollDisable = response.page >= response.pages ? true : false;
                const returnData = { historyInfo: response, infiniteScrollDisable:infiniteScrollDisable };
                observer.next(returnData);
                observer.complete();
              } else {
                const returnData = { historyInfo: {docs:[]}, infiniteScrollDisable:true };
                observer.next(returnData);
                observer.complete();
              }
            }
          } catch (e) {
          }

        }, error => {
          const returnData = { historyInfo: {docs:[]}, infiniteScrollDisable: true };
          observer.next(returnData);
          observer.complete();
        })
    });

  }
}
