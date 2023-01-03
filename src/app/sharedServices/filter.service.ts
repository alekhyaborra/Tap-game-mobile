import { Injectable } from '@angular/core';
import { Constants } from '../constants/constants';
import { ApiUrls } from '../constants/api-urls';
import { CommonService } from './commonServices/common.service';
import { RestApiService } from './rest-api.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  filterByElements = Constants.filter;
  filterParams = Constants.filterParams;

  constructor(
    private commonservice : CommonService,
    private restService : RestApiService,
    private toastService :ToastService
  ) { }

  RecordsBy(List,filterType,recordIn,taskId,offset,callback){
    const userInfo = this.commonservice.getUserInfo();
    switch(filterType){
      case this.filterByElements.reassigned:{
        // if(taskId == null)
          var url = ApiUrls.getFilteredRecords+"/"+this.filterParams.reassign+"/"+userInfo._id+"/"+recordIn+"/"+Constants.recordsLimit+"/"+offset;
          this.getFilteredList(url,function(filteredList,infiniteScrollDisable){
            callback(filteredList,infiniteScrollDisable);
          });
        break;
      }
      case this.filterByElements.saved:{
        this.toastService.showToast(Constants.sprintToast);
        callback(List,false);
        break;
      }
      case this.filterByElements.new:{
        var url = ApiUrls.getFilteredRecords+"/"+this.filterParams.new+"/"+userInfo._id+"/"+recordIn+"/"+Constants.recordsLimit+"/"+offset;
        this.getFilteredList(url,function(filteredList,infiniteScrollDisable){
          callback(filteredList,infiniteScrollDisable);
        });
        break;
      }
      default:{
        callback(List,false);
        break;
      }
    }
  }

  getFilteredList(url,callback){
    const headers = this.restService.getHeadersForGet();
    this.restService.getServiceProcess(url,headers).subscribe(res=>{
      const response = res['data'];
      const list = response.docs;
      if(response.page >= response.pages)
        callback(list,true);
      else
        callback(list,false);
    },error => {
      this.commonservice.showErrorResponseAlert(error.status,error.message);
    })
  }

  orderBy(filterType,listKeys,callback){
    switch(filterType){
      case this.filterByElements.assigned:{
        const orderType = listKeys.assignedBy;
        callback(orderType);
        break;
      }
      case this.filterByElements.startDate:{
        const orderType = listKeys.startDate;
        callback(orderType);
        break;
      }
      case this.filterByElements.dueDate:{
        const orderType = listKeys.dueDate;
        callback(orderType);
        break;
      }
      default:{
        const orderType = Constants.nullString;
        callback(orderType);
        break;
      }
    }
  }

  groupBy(filterType,listKeys,callback){
    switch(filterType){
      case this.filterByElements.tasks:{
        const groupType = listKeys.taskId;
        callback(groupType,this.filterByElements.tasks);
        break;
      }
      case this.filterByElements.projects:{
        const groupType = listKeys.projectId;
        callback(groupType,this.filterByElements.projects);
        break;
      }
      default:{
        callback(Constants.nullValue,Constants.nullValue);
        break;
      }
    }
  }

}
