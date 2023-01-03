import { Injectable } from '@angular/core';
import { RestApiService } from '../../sharedServices/rest-api.service'
import { Observable } from 'rxjs';
import { ApiUrls } from '../../constants/api-urls';
import { CommonService } from '../../sharedServices/commonServices/common.service';
import { LoadingService } from '../../sharedServices/loading.service';
import { Constants } from 'src/app/constants/constants';
import { QueryProcessService } from 'src/app/offline/query-process/query-process.service';
import { AlertService } from '../../sharedServices/alert.service';

@Injectable({
  providedIn: 'root'
})
export class FormBuilderService {
  recordData = {};
  constructor(private restService: RestApiService,
    private alertService : AlertService,
    private apiUrls: ApiUrls,
    private commonService: CommonService,
    private loadingService: LoadingService,
    private loader: LoadingService,
    private queryProcessService: QueryProcessService
  ) { }
  getformSkeltonWithPrepopData(url) {
    const headers = this.restService.getHeadersForGet();
    return new Observable<any>(observer => {
      this.restService.getServiceProcess(url, headers)
        .subscribe(res => {
          try {
            if (res["status"] == Constants.offlineStatus) {
              this.queryProcessService.getworkOrder(this.commonService.getWOData().id).then(res => {
                if (res['data'].length) {
                  this.recordData = JSON.parse(res['data'].item(0).formValues)
                }
                const returnData = { status: "5001", data: this.recordData };
                observer.next(returnData);
                this.recordData = {};
                observer.complete();
                this.loader.dismiss();
              })
            } else {
              const response = res;
              const returnData = { data: response };
              observer.next(returnData);
              observer.complete();
              this.loader.dismiss();

            }
          } catch (e) {
            this.loader.dismiss();

          }

        }, error => {
          const returnData = { data: error };
          observer.next(returnData);
          observer.complete();
          this.loader.dismiss();
        })
    });
  }

  submitForm(record: any, callback) {
    this.restService.postServiceProcess(ApiUrls.formsubmit, record).subscribe(
      response => {
        if(response["status"] == Constants.offlineStatus){
          this.alertService.presentAlert(Constants.checkNetwork);
          callback(0,response);
        } else {
          callback(1, response);
        }
      },
      error => {
        //this.loadingService.dismiss();
        this.commonService.showErrorResponseAlert(error.status, error.message);
        callback(0, error)

      });
  }

  saveFormData(data) {
    return this.queryProcessService.saveWO(data);
  }

  updateFormData(data) {
    return this.queryProcessService.updateWO(data);
  }
  deleteWorkOrder(data) {
    return this.queryProcessService.deleteWorkorder(data);
  }
  getworkOrder(data) {
    return this.queryProcessService.getworkOrder(data);
  }
  deleteDownloadedWO(recordId) {
    return this.queryProcessService.deleteDownloadedWO(recordId);
  }
  getUrlForMedia(widgetId){
    const headers = this.restService.getHeadersForGet();
    const url=ApiUrls.getImageorVideo+"/"+this.commonService.getRecordId()+"/"+widgetId
     return this.restService.getServiceProcess(url,headers)
  }
  getFormDependecyConditions(formId) {
    const headers = this.restService.getHeadersForGet();
    const url = ApiUrls.derivedConditionsByFormId + '/' + formId;
      return new Observable<any>(observer => {
        this.queryProcessService.getDependencyConditionsList(formId).then(response => {
          this.restService.getServiceProcess(url, headers)
            .subscribe((res: any) => {
              // console.log("res",res);
              try {
                if (res["status"] == Constants.offlineStatus) {
                  // this.queryProcessService.getDependencyConditionsList(formId).then(res => {
                    const returnData = { data: response['data'] };
                    observer.next(returnData);
                    observer.complete();
                                   if(this.loader.isLoading){ this.loader.dismiss(); }
         
                  // })
                } else {
                  const returnData = { data: res['data'] };
                  observer.next(returnData);
                  observer.complete();
                                 if(this.loader.isLoading){ this.loader.dismiss(); }
         
                  this.queryProcessService.checkAndUpdateDependencyConditions([{_id:formId,conditions:res['data']}])
                }
              } catch (e) {
                               if(this.loader.isLoading){ this.loader.dismiss(); }
         
              }

            }, error => {
              const returnData = { data: error };
              observer.next(returnData);
              observer.complete();
                             if(this.loader.isLoading){ this.loader.dismiss(); }
         
         
            })
          })
      });
  }
}





