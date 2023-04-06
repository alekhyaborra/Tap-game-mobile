import { Injectable } from '@angular/core';
import { RestApiService } from '../sharedServices/rest-api.service';
import { ApiUrls } from '../constants/api-urls';
import { CommonService } from '../sharedServices/commonServices/common.service';
import { Constants } from '../constants/constants';
import { QueryProcessService } from '../offline/query-process/query-process.service';
import { ToastService } from '../sharedServices/toast.service';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  intervel: any;
  offset: number = 0;
  limit: number = 10;
  constructor(
    private restApiService: RestApiService,
    private commonService: CommonService,
    private queryProcessService: QueryProcessService,
    private toastService: ToastService,
    private storage: Storage
  ) { }

  getAssignmentData(taskId, assignmentId) {
    const headers = this.restApiService.getHeadersForGet();
    const url = ApiUrls.assignmentDownload + "/" + taskId + "/" + assignmentId + "/" + this.commonService.getUserInfo()._id;
    return this.restApiService.getServiceProcess(url, headers)
  }

  saveTask(taskData) {
    return this.queryProcessService.saveTask(taskData);
  }
  getDownloadedTask(taskId){
    return this.queryProcessService.getDownloadedTask(taskId);
  }
  checkTaskDownloaded(taskId){
    return this.queryProcessService.checkTaskDownloaded(taskId);
  }

  checkSavedRecordCount(assignmentId){
    return this.queryProcessService.checkSavedRecordCount(assignmentId);
  }

  deleteDownloadedAWO(assignmentId){
    return this.queryProcessService.deleteDownloadedAWO(assignmentId)
  }

  saveAssignment(assignmentData) {
    return this.queryProcessService.saveAssignment(assignmentData);
  }

  getWO(assignmentId, formId, wOPercentage) {
    this.getWOOnOffset(assignmentId, formId, this.limit, this.offset, data => {
      if (data.status == 1) {
        for (let i = 0; i < data['data'][Constants.wODownloadKys.docs].length; i++) {         
          const saveWOData= this.prepareWOData(formId, data, i, assignmentId);
          this.queryProcessService.saveFormData(saveWOData)
            .then(res => {
              if (res.status) {
                const completedDP = this.commonService.getDownloadPercntag();
                const percentage = completedDP.percentage+wOPercentage;
                //This is for getting previous percentage
                this.commonService.setDownloadPercntag({assignmentId: assignmentId,percentage: percentage});
                //This is for shwoing percenage on assignment.
                this.commonService.setPercentage({assignmentId: assignmentId,percentage: percentage})
                if (i == data['data'][Constants.wODownloadKys.docs].length - 1) {                  
                  this.offset = this.offset + this.limit
                  this.getWO(assignmentId, formId, wOPercentage)                  
                }
              } else {
                this.commonService.setPercentage("");
                this.commonService.setDownloadInProgress(false);
              }
            });
        }
      }
      else {
        this.commonService.setPercentage("");
        this.commonService.setDownloadInProgress(false);
        this.offset = 0;        
      }
    });

  }

  prepareWOData(formId, data, i, assignmentId) {
    let saveWOData = {};
    saveWOData[Constants.saveWO.formId] = formId;
    saveWOData[Constants.saveWO.userId] = this.commonService.getUserInfo().username;
    saveWOData[Constants.saveWO.formValues] = data['data'][Constants.wODownloadKys.docs][i];
    saveWOData[Constants.saveWO.isValid] = 0;
    saveWOData[Constants.saveWO.taskId] = data['data'][Constants.wODownloadKys.docs][i][Constants.saveWO.taskId] || Constants.nullValue;
    saveWOData[Constants.saveWO.recordId] = data['data'][Constants.wODownloadKys.docs][i]["_id"] || Constants.nullValue;
    saveWOData[Constants.saveWO.recordComments] = data['data'][Constants.wODownloadKys.docs][i]["recordComments"] || Constants.nullValue;
    saveWOData[Constants.saveWO.recordType] = data['data'][Constants.wODownloadKys.docs][i][Constants.wODownloadKys.status]
    saveWOData[Constants.saveWO.lat] = "";
    saveWOData[Constants.saveWO.long] = "";
    saveWOData[Constants.saveWO.videoOptions] = "";
    saveWOData[Constants.saveWO.isVideoAvailable] = 0;
    saveWOData[Constants.saveWO.assignmentId] = assignmentId;
    saveWOData[Constants.saveWO.taskName] = data['data'][Constants.wODownloadKys.docs][i][Constants.saveWO.taskName] || Constants.nullValue;
    saveWOData[Constants.saveWO.displayValue] = data['data'][Constants.wODownloadKys.docs][i][data['data'][Constants.wODownloadKys.displayField]];
    saveWOData[Constants.saveWO.dueDate] = data['data'][Constants.wODownloadKys.docs][i][Constants.saveWO.dueDate] || Constants.nullValue;
    saveWOData[Constants.saveWO.insertDate] = new Date().setHours(0, 0, 0, 0);
    saveWOData[Constants.saveWO.AssignedRecordTime] = data['data'][Constants.wODownloadKys.docs][i][Constants.saveWO.AssignedRecordTime]
    return saveWOData;
  }

  getWOOnOffset(assignmentId, formId, limit, offset, cb) {
    const headers = this.restApiService.getHeadersForGet();
    const url = ApiUrls.wODownload + "/" + assignmentId + "/" + formId + "/" + this.commonService.getUserInfo()._id + "/" + this.limit + "/" + this.offset;
    this.restApiService.getServiceProcess(url, headers).subscribe(res => {
      if (res[Constants.wODownloadKey.status] == 200) {
        offset = offset + limit;
        cb({ status: 1, data: res['data'] })
      }
      else
        cb({ status: 0 })
    },
      err => {
        cb({ status: 0 })
      });
  }

  saveForm(formId,taskId, assignmentId, cb) {
    this.queryProcessService.getForm(formId)
      .then((res) => {
        let formVersion;
        if (res.status == 1) {
          formVersion = res.data.formInfo.version
        } else {
          formVersion = Constants.nullValue
        }
        const headers = this.restApiService.getHeadersForGet();
        var url = ApiUrls.getForm + "/" + formId + "/" + Constants.nullValue + "/" + true + "/" + Constants.nullValue + "/" + formVersion+"/"+taskId+"/"+assignmentId+"/"+this.commonService.getUserInfo()._id+"/"+Constants.downloadParameter;
        this.restApiService.getServiceProcess(url, headers).subscribe(response => {
          if(response["data"].referenceList)
            this.downloadRerList(response["data"].referenceList, response["data"].version);
          if (response["data"].formWidgets) {
            this.queryProcessService.saveOrUpdateWidgets(response["data"].formWidgets, response["data"].formInfo, formVersion,Constants.formDownLoadedType.manualDownload,false).then(queryResponse => {
              cb({ status: queryResponse.status })
            })
          }
          else if(formVersion != Constants.nullValue){
            this.queryProcessService.saveOrUpdateWidgets(null,{_id:formId}, null,Constants.formDownLoadedType.manualDownload,true).then(queryResponse => {
              cb({ status: queryResponse.status })
            })
          }
          else {
            cb({ status: 1 })
          }
        });
      })
      .catch(e => {
        cb({ status: 0 })
      });
  }

  getDownloadedAssignments(search,filter){
    if(search != Constants.nullValue || filter != Constants.nullValue){
      return  this.queryProcessService.offlineAssignmentSearch(search,filter)
    }
    else{
      return  this.queryProcessService.getDownloadedAssignments()
    }
  }

  downloadRerList(refList,version){
    return  this.queryProcessService.checkAndUpdateRefList(refList,version)
  }


  getRefList(dynamicDropdownTable,columnName,limit,offset,searchText?){
    return  this.queryProcessService.getRefList(dynamicDropdownTable,columnName,limit,offset,searchText);
  }
  getAllRefList(){
    return  this.queryProcessService.getAllRefList();
  }
  getLookUpTable(dynamicDropdownTable,columnName){
    return  this.queryProcessService.getLookUpTable(dynamicDropdownTable,columnName);
  }
  downloadLookUpTable(refList,version){
    return  this.queryProcessService.checkAndUpdateLookUpTable(refList,version);
  }
}
