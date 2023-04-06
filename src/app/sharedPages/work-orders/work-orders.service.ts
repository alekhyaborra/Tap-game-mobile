import { Injectable } from '@angular/core';
import { RestApiService } from '../../sharedServices/rest-api.service';
import { Observable } from 'rxjs';
import { CommonService } from '../../sharedServices/commonServices/common.service';
import { LoadingService } from '../../sharedServices/loading.service';
import { QueryProcessService } from '../../offline/query-process/query-process.service';
import { ToastService } from '../../sharedServices/toast.service';
import { Constants } from '../../constants/constants';
import { DownloadService } from '../../sharedServices/download.service';
@Injectable({
  providedIn: 'root'
})
export class WorkOrdersService {

  constructor(
    private restService: RestApiService,
    private queryProcessService: QueryProcessService,
    private commonService: CommonService,
    private loader: LoadingService,
    private toastService: ToastService,
    private downloadService: DownloadService,

  ) { }

  getWorkOrders(url, taskId, formId, assignmentId, offset, searchBy, filter,date,fromDate,toDate): Observable<any> {
    const headers = this.restService.getHeadersForGet();
    return new Observable<any>(observer => {
      // if(filter != Constants.filter.saved && assignmentId != Constants.nullValue){ -> this commnted
      if (filter !== Constants.filter.saved) {
      this.restService.getServiceProcess(url, headers)
        .subscribe(res => {
          if (res["status"] === Constants.offlineStatus) {
            let returnData;
            this.queryProcessService.getDownloadedWO(taskId, formId, assignmentId, Constants.wOQueryLimit.limit, (offset-1)*Constants.wOQueryLimit.limit,searchBy,filter,date,fromDate,toDate)
            .then((data) => {            
              const wO: any = [];
              let displayFields:any;
              this.queryProcessService.getFormInfoFromSqliteDb(formId)
                .then((form) => {
                  displayFields = form.data['displayName'];
                  if (data['data'].length > 0) {
                    for (var i = 0; i < data['data'].length; i++) {
                      data['data'].item(i)[displayFields] = JSON.parse(data['data'].item(i).formValues)[displayFields];
                      data['data'].item(i)["_id"] = data['data'].item(i).recordId;
                      wO.push(data['data'].item(i));
                    }
                    const returnData = { wO: wO, displayFields: displayFields };
                    observer.next(returnData);
                    observer.complete();
                  } else {
                    returnData = { wO: [], displayFields: displayFields };
                    observer.next(returnData);
                    observer.complete();
                  }
                })
                .catch(e => {
                });            
            })
            .catch(e => {
              returnData = { wO: [] , displayFields:{}};
              observer.next(returnData);
              observer.complete();
            });;
            
          } else {
            const response = res['data'];
            const infiniteScrollDisable = response.page >= response.pages ? true : false;
            const returnData = { wO: response.docs, infiniteScrollDisable: infiniteScrollDisable,displayFields: response.displayField };
            observer.next(returnData);
            observer.complete();
          }
        }, error => {
          const returnData = { wO: [], infiniteScrollDisable: false,displayFields:{}  };
          observer.next(returnData);
          observer.complete();
          this.loader.dismiss();
        })
      } else {
        const returnData = { wO: [], infiniteScrollDisable: false,displayFields:{}  };
        observer.next(returnData);
        observer.complete();
        // this.loader.dismiss();

      }
    });
  }

  getSaveWO(taskId, formId, assignmentId, searchBy, filterBy): any {
    return new Observable<any>(observer => {
      let wO: any = [];
      let displayFields:any;
      this.queryProcessService.getAllWO(taskId, formId,assignmentId,searchBy,filterBy).then(res => {
        if (res.status) {
          if (res['data'].length) {
            this.queryProcessService.getFormInfoFromSqliteDb(formId)
            .then((form)=>{
              displayFields=form.data['displayName'];
             // wO = [];
              for (var i = 0; i < res['data'].length; i++) {
                res['data'].item(i)[displayFields] =JSON.parse(res['data'].item(i).formValues)[displayFields];
                const record ={}
                wO.push(res['data'].item(i));
              }
              const returnData = { wO: wO ,displayFields:displayFields};
              observer.next(returnData);
              observer.complete();
            })
            .catch(e => {
            });
          } else {
            const returnData = { wO: [] ,displayFields:{}};
            observer.next(returnData);
            observer.complete();
          }
        } else {
          this.toastService.showToast(Constants.internalServerProblem);
        }
      }, error => {
        console.log(error)
      });
    });
  }

  // getSaveWOSearch(taskId, formId,assignmentId,searchBy){
  //   return new Observable<any>(observer => {
  //     const wO: any = [];
  //     let displayFields:any;
  //     this.queryProcessService.getAllWOSearch(taskId, formId,assignmentId,searchBy).then(res => {
  //       if (res.status) {
  //         if (res['data'].length) {
  //           this.queryProcessService.getFormInfoFromSqliteDb(formId)
  //           .then((form)=>{
  //             displayFields=form.data['displayName'];
  //             for (var i = 0; i < res['data'].length; i++) {
  //               res['data'].item(i)[displayFields] =JSON.parse(res['data'].item(i).formValues)[displayFields];
  //               const record ={}
  //               wO.push(res['data'].item(i));
  //             }
  //             const returnData = { wO: wO ,displayFields:displayFields};
  //             observer.next(returnData);
  //             observer.complete();
  //           })
  //           .catch(e => {
  //           });            
  //         }
  //         else{
  //           const returnData = { wO: [] ,displayFields:{}};
  //           observer.next(returnData);
  //           observer.complete();
  //         }
  //       } else {
  //         this.toastService.showToast(Constants.internalServerProblem);
  //       }
  //     }, error => {

  //     });
  //   });

  // }
  getInfobkp(url,f,t,s,callback){
    const headers = this.restService.getHeadersForGet();
    const response:any = this.restService.getServiceProcess(url,headers)
    .subscribe(res=>{
      callback(res['data']);
      this.loader.dismiss();
    },error => {
      this.commonService.showErrorResponseAlert(error.status,error.message);
      this.loader.dismiss();
    })
  }

  getInfo(url,formId,status): Observable<any> {
    const headers = this.restService.getHeadersForGet();
    let returnData

    return new Observable<any>(observer => {
      if(status != Constants.statusValue.Saved){
      this.restService.getServiceProcess(url, headers)
        .subscribe(res => {
          if (res["status"] == Constants.offlineStatus  ) {
            this.queryProcessService.getFormInfo(formId)
              .then(queryResponse => {
                returnData = { data: queryResponse.data };
                observer.next(returnData);
                observer.complete();
    
              })
          }else{
          returnData = { data: res['data'] };
          observer.next(returnData);
          observer.complete();     
        }     
        }, error => {
          returnData = { data: [] };
          observer.next(returnData);
          observer.complete();
        })
      }else{
        // if (status == Constants.statusValue.Saved) {
          this.queryProcessService.getFormInfo(formId)
            .then(queryResponse => {
              returnData = { data: queryResponse.data };
              observer.next(returnData);
              observer.complete();
  
            })
        // } else {
        //   returnData = { data: [] };
        //   observer.next(returnData);
        //   observer.complete();
        // }
        }

    });
  }
  getIsPrePop(url, taskId): Observable<any> {
    const headers = this.restService.getHeadersForGet();
    let returnData;
    return new Observable<any>(observer => {
      this.restService.getServiceProcess(url)
        .subscribe(res => {
          if (res["status"] == Constants.offlineStatus  ) {
            let isPrepopAttached = [];
            this.downloadService.getDownloadedTask(taskId).then((downloadedTask) => { 
              if(downloadedTask.status == 0){
                observer.next({data: [],status: 0});
                observer.complete();
              }
        // return {data: [],status: 0}
      if(downloadedTask['data'].length > 0){
        for (let i = 0; i < downloadedTask['data'].length; i++) {
          // console.log("Res : ", downloadedTask['data'].item(i));
          isPrepopAttached = downloadedTask['data'].item(i);
         }
        // return {data: isPrepopAttached[0], status: 1}
        observer.next({data: isPrepopAttached, status: 1});
        observer.complete();
      }else{
        // return {data: [],status: 1}
        observer.next({data: [],status: 1});
          observer.complete();
      }
            }).catch((err) => {
              // console.log("Res : ", err);
            });
          }
          else{
          returnData = { data: res['data'] };
          observer.next(returnData);
          observer.complete();     
        }     
        }, error => {
          returnData = { data: [] };
          observer.next(returnData);
          observer.complete();
        })
    });
  }

  frequencyCheck(url): Observable<any> {
    const headers = this.restService.getHeadersForGet();
    // return this.restService.getServiceProcess(url,headers);

    return new Observable<any>(observer => {
      this.restService.getServiceProcess(url)
        .subscribe(res => {
          observer.next( { data: res });
          observer.complete();
        
        }, error => {
          observer.next({ data: [] });
          observer.complete();
          // this.loadingService.dismiss();
        })
    });
  }
}
