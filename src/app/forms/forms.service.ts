import { Injectable } from '@angular/core';
import { RestApiService } from '../sharedServices/rest-api.service';
import { formListStructure, formInfoStructure } from './forms-list/forms-list';
import { Observable } from 'rxjs';
import { Constants } from '../constants/constants';
import { LoadingService } from '../sharedServices/loading.service';
import { QueryProcessService } from '../offline/query-process/query-process.service';
import { DisplayConstants } from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class FormsService {
  formsList: formListStructure[];
  formInfo: formInfoStructure[];
  displayProperties = DisplayConstants.properties;
  
  constructor(
    private restService: RestApiService,
    private loader: LoadingService,
    private queryProcessService: QueryProcessService
  ) { }
  getDropDwonvalues (url) {
    const headers = this.restService.getHeadersForGet();
    return new Observable<any>(observer => {
      this.restService.getServiceProcess(url, headers)
        .subscribe(res => {
          const response = res['data'];
          const returnData = { data: res['data'] };
          observer.next(returnData);
          observer.complete();
          this.loader.dismiss();
        }, error => {
          const returnData = {message: this.displayProperties.internalServerProblem, code: 500  };
          observer.next(returnData);
          observer.complete();
          this.loader.dismiss();
        });
    });
  }
  getForms(url, searchBy) {
    const headers = this.restService.getHeadersForGet();
    return new Observable<any>(observer => {
      this.restService.getServiceProcess(url, headers)
        .subscribe(res => {
          try{
            if(res["status"] == Constants.offlineStatus){
              this.queryProcessService.getFormsFromSqliteDb(Constants.formDownLoadedType.manualDownload,searchBy).then(res =>{
                this.formsList = res.data;
                const returnData = { formsList: this.formsList, infiniteScrollDisable: false};
                observer.next(returnData);
                observer.complete();
              })              
              this.loader.dismiss();
            } else {
              const response = res['data'];
              const infiniteScrollDisable = response.page >= response.pages ? true : false;
              const returnData = { formsList: response.docs, infiniteScrollDisable: infiniteScrollDisable };
              observer.next(returnData);
              observer.complete();
              this.loader.dismiss();

            }
          }catch(e){
            const returnData = { formsList: [], infiniteScrollDisable: false };
            observer.next(returnData);
            observer.complete();
            this.loader.dismiss();
          }          
        }, error => {
          const returnData = { formsList: [], infiniteScrollDisable: false };
          observer.next(returnData);
          observer.complete();
          this.loader.dismiss();
        })
    });
  }


  getFormInfo(url,formId){
    const headers = this.restService.getHeadersForGet();
    return new Observable<any>(observer => {
      this.restService.getServiceProcess(url, headers)
        .subscribe(res => {
          try{
            if(res["status"] == Constants.offlineStatus){
              this.queryProcessService.getFormInfoFromSqliteDb(formId).then(res =>{
                this.formInfo=res.data
                const returnData = { formInfo: this.formInfo };

                observer.next(returnData);
                observer.complete();
              })
              
              this.loader.dismiss();

            } else {
              const response = res['data'];
              const returnData = { formInfo: response };
              observer.next(returnData);
              observer.complete();
              this.loader.dismiss();

            }
          }catch(e){
          }
          
        }, error => {
          const returnData = { formInfo: [] };
          observer.next(returnData);
          observer.complete();
          this.loader.dismiss();
        })
    });
  }

}
