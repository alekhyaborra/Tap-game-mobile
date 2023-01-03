import { Injectable } from '@angular/core';
import { RestApiService } from '../sharedServices/rest-api.service';
import { Observable } from 'rxjs';
import { CommonService } from '../sharedServices/commonServices/common.service';
import { Constants } from '../constants/constants';
import { LoadingService } from '../sharedServices/loading.service';
import { DownloadService } from '../sharedServices/download.service';
import { QueryProcessService } from '../offline/query-process/query-process.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(
    private restService: RestApiService,
    private commonService: CommonService,
    private loadingService: LoadingService,
    private downloadService: DownloadService,
    private queryProcessService: QueryProcessService
  ) { }

  getTasksList(url, search, filter): Observable<any> {
    const headers = this.restService.getHeadersForGet();
    return new Observable<any>(observer => {
      this.restService.getServiceProcess(url, headers)
        .subscribe(res => {
          if (res["status"] == Constants.offlineStatus) {
            let returnData;
            this.downloadService.getDownloadedAssignments(search, filter)
              .then(response => {
                const assignments: any = [];
                if (response.status) {
                  if (response['data'].length) {
                    for (var i = 0; i < response['data'].length; i++) {
                      var Date1 = new Date().setHours(0, 0, 0, 0);
                      var Date2 = new Date(response['data'].item(i)[Constants.taskTable.endDate]).setHours(0, 0, 0, 0);
                      if (Date1 <= Date2) {
                        response['data'].item(i)["_id"] = response['data'].item(i)['assignmentId'];
                        assignments.push(response['data'].item(i))
                      }                      
                    }
                    returnData = { assignments: assignments, infiniteScrollDisable: true };
                  }
                  else {
                    returnData = { assignments: [], infiniteScrollDisable: true };
                  }
                }
                else {
                  returnData = { assignments: [], infiniteScrollDisable: true };
                }
                observer.next(returnData);
                observer.complete();
              })
              .catch(e => {
                returnData = { assignments: [], infiniteScrollDisable: true };
                observer.next(returnData);
                observer.complete();
              });
          } else {
            if (res["status"] == Constants.noDataFoundStatus) {
              const returnData = { assignments: [], infiniteScrollDisable: true };
              observer.next(returnData);
              observer.complete();
            } else {
              const response = res['data'];
              const infiniteScrollDisable = response.page >= response.pages ? true : false;
              const returnData = { assignments: response['docs'], infiniteScrollDisable: infiniteScrollDisable };
              observer.next(returnData);
              observer.complete();
            }
          }
        }, error => {
          const returnData = { assignments: [], infiniteScrollDisable: false };
          observer.next(returnData);
          observer.complete();
          this.loadingService.dismiss();
        })
    });
  }

  getTaskInfo(url, taskid): Observable<any> {
    const headers = this.restService.getHeadersForGet();
    // return this.restService.getServiceProcess(url,headers);
    let returnData

    return new Observable<any>(observer => {
      this.restService.getServiceProcess(url, headers)
        .subscribe(res => {
          if (res["status"] == Constants.offlineStatus) {
            this.queryProcessService.getOfflineTaskInfo(taskid)
              .then(queryResponse => {
                const data: any = {}
                if (queryResponse['data'] && queryResponse['data'].length > 0) {
                  data.data = {
                    ['name']: queryResponse['data'].item(0).name,
                    ['createdBy']: queryResponse['data'].item(0).createdBy,
                    ['startDate']: queryResponse['data'].item(0).startDate,
                    ['endDate']: queryResponse['data'].item(0).endDate,
                  }
                  // return { data: data, status: 1 }
                  returnData = { data: data.data };
                  observer.next(returnData);
                  observer.complete();
      
                } else {
                  data.status = false
                  return { status: 0 }
                }
              })
          } else {
            returnData = { data: res['data'] };
            observer.next(returnData);
            observer.complete();
            this.loadingService.dismiss();

          }
        }, error => {
          returnData = { data: [] };
          observer.next(returnData);
          observer.complete();
          this.loadingService.dismiss();
        })
    });
  }

}
