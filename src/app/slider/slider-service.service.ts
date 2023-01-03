import { Injectable } from '@angular/core';
import { RestApiService } from '../sharedServices/rest-api.service';
import { ApiUrls } from '../constants/api-urls';
import { CommonService } from '../sharedServices/commonServices/common.service';
import { Constants } from '../constants/constants';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SliderServiceService {
public updateCount: BehaviorSubject<any> = new BehaviorSubject(null);
  constructor(
    private restApiService: RestApiService,
    private commonService: CommonService
  ) { }

   getFormChartData(): any {
    let url = ApiUrls.dashboard + "/" + this.commonService.getUserInfo()._id + "/Forms";
    const formObservable = new Observable(observer => {
      this.restApiService.getServiceProcess(url).subscribe(response => {
        let responseData = response['data'];
        if(responseData && responseData[Constants.dashboardTaskKeys.total]){
          const chartData = [ responseData[Constants.dashboardTaskKeys.total]];
          const totalCount = responseData[Constants.dashboardTaskKeys.total];
          const returnData = { chartData: chartData, totalCount: totalCount, status: response['status'] };
          observer.next(returnData);
        }
        else {
          const returnData = { status: response['status'], message: response['message'] };
          observer.next(returnData);
        }
      }, error => {
        observer.error(error);
      });
      
    });
    return formObservable;    
  }
  getWOData(): any {
    let url = ApiUrls.dashboard + "/" + this.commonService.getUserInfo()._id + "/Workorders";
    const formObservable = new Observable(observer => {
      this.restApiService.getServiceProcess(url).subscribe(response => {
        let responseData = response['data'];
        const chartData = [
          responseData[Constants.dashboardTaskKeys.assigned], responseData[Constants.dashboardTaskKeys.inProgress], responseData[Constants.dashboardTaskKeys.completed]
        ];
        const totalCount = responseData[Constants.dashboardTaskKeys.total];
        const returnData = { chartData: chartData, totalCount: totalCount };
        observer.next(returnData);
      }, error => {
        observer.error(error);
      });
      
    });
    return formObservable;    
  }

  getTaskData(): any {
    let url = ApiUrls.dashboard + "/" + this.commonService.getUserInfo()._id + "/Assignments";
    const formObservable = new Observable(observer => {
      this.restApiService.getServiceProcess(url).subscribe(response => {
        let responseData = response['data'];
        if(responseData ){
          const chartData = [
            responseData[Constants.dashboardTaskKeys.assigned], responseData[Constants.dashboardTaskKeys.ReAssigned]
          ];
          const totalCount = responseData[Constants.dashboardTaskKeys.total];
          const returnData = { chartData: chartData, totalCount: totalCount };
          observer.next(returnData);
            this.updateCount.next(returnData)
        }
        else {
        }
      }, error => {
        observer.error(error);
      });
      
    });
    return formObservable;    
  }
}
