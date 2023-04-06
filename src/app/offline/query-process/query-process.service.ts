import { Injectable } from '@angular/core';
import { QueryService } from '../query/query.service';
import { Observable } from 'rxjs';
import { formListStructure } from 'src/app/forms/forms-list/forms-list';
import { Constants } from '../../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class QueryProcessService {

  data: any = {}
  formList: formListStructure[] = [];
  constructor(
    private queryService: QueryService
  ) { }
  // below method will return syncing workorders
  getSyncingRecordsCount(id) {
    // let inProgressId = []
    return this.queryService.getCountOFRecordsSync(id)

  }
  // below method will return syncing assignments
  getSyncingAssignmets() {
    return this.queryService.getAssignmentsWhichAreSyncing().then(queryResponse => {
      if(queryResponse['data'].length > 0){
      let syncData:any
      for (let i = 0; i < queryResponse['data'].length; i++) {
        this.getSyncingRecordsCount(queryResponse['data'].item(i).assignmentId).then(res => {
          if (res.status == 1 && res['data'].length == queryResponse['data'].item(i).recordsCount) {
            
          } else if (res.status == 1 && res['data'].length != queryResponse['data'].item(i).recordsCount) {
            let inProgressData={
              "assignmentId":queryResponse['data'].item(i).assignmentId,
              "totalRecords":queryResponse['data'].item(i).recordsCount,
              "syncedRecords":res['data'].length
            }
            syncData.push(inProgressData)
            
          }
        })
      }
      return syncData
    }else{
      return false
    }
    })
  }

  saveFormData(data) {
    return this.queryService.saveWO(data);
  }

  saveDownloadedData(data) {
    return this.queryService.saveDownloadedWO(data);
  }
  getDownloadedTask(taskId) {
    return this.queryService.getDownloadedTask(taskId);
  }
  updateFormData(data) {
    return this.queryService.updateWO(data);
  }
  deleteWorkOrder(data) {
    return this.queryService.deleteWorkorder(data);
  }
  getworkOrder(data) {
    return this.queryService.getworkOrder(data);
  }

  getFormWorkOrders(formId) {
    //   this.queryService.getFormWorkOrders(formId);
  }

  getForm(formId) {

    return this.queryService.fetchFormsWidget(formId).then(queryResponse => {
      const data: any = {}
      if (queryResponse['data'] && queryResponse['data'].length > 0) {
        data.skeleton = JSON.parse(queryResponse['data'].item(0).skeleton)
        data.formInfo = {
          ['formId']: queryResponse['data'].item(0).formId,
          ['name']: queryResponse['data'].item(0).name,
          ['description']: queryResponse['data'].item(0).description,
          ['version']: queryResponse['data'].item(0).version,
          ['createdBy']: queryResponse['data'].item(0).createdBy,
          ['displayName']: queryResponse['data'].item(0).displayName,
          ['derivedFields']: queryResponse['data'].item(0)[Constants.widgetsTable.derivedFields],
        }
        return { data: data, status: 1 }
      } else {
        data.status = false
        return { status: 0 }
      }

    })
  }
  getAllWO(taskId, formId, assignmentId, searchBy, filterBy) {

    let search = searchBy
    if (filterBy == Constants.filter.reassigned || filterBy == Constants.filter.new) {
      search = Constants.nullValue
    }
    if (searchBy != Constants.nullValue || filterBy != Constants.nullValue) {
      return this.queryService.getAllWOSearch(taskId, formId, assignmentId, search, filterBy);
    } else {
      return this.queryService.getAllWO(taskId, formId, assignmentId);
    }
  }

  saveOrUpdateWidgets(widgets, formInfo, version, formDownloadType, manualDownload?, derivedFields?) {
    if (manualDownload) {
      return this.queryService.updateFormWidgetTable(widgets, formInfo, formDownloadType, manualDownload, derivedFields)
    }
    else if (version == Constants.nullValue) {
      return this.queryService.saveDataTOFormsTable(widgets, formInfo, formDownloadType, derivedFields);

    } else if (version != formInfo.version) {
      return this.queryService.updateFormWidgetTable(widgets, formInfo, formDownloadType, manualDownload, derivedFields)

    }
  }
  getFormsFromSqliteDb(formType, searchBy) {
    this.formList = []
    return this.queryService.fetchFormsWidgets(formType, searchBy).then(queryResponse => {
      if (queryResponse['data'].length > 0) {
        for (let i = 0; i < queryResponse['data'].length; i++) {
          this.formList.push({
            '_id': queryResponse['data'].item(i).formId,
            'name': queryResponse['data'].item(i).name,
            'successSync':""
          })
        }
        return { data: this.formList, status: 1 }
      } else {
        return { data: [], status: 0 }
      }

    })
  }
  getFormInfoFromSqliteDb(formId) {
    return this.queryService.fetchFormsWidget(formId).then(queryResponse => {
      if (queryResponse['data'].length > 0) {
        this.data = {
          ['_id']: queryResponse['data'].item(0).formId,
          ['name']: queryResponse['data'].item(0).name,
          ['description']: queryResponse['data'].item(0).description,
          ['version']: queryResponse['data'].item(0).version,
          ['createdBy']: queryResponse['data'].item(0).createdBy,
          ['displayName']: queryResponse['data'].item(0).displayName,

        }
        return { data: this.data, status: 1 }
      } else {
        return { data: [], status: 0 }
      }

    })
  }
  saveTask(taskData) {
    return this.queryService.saveTask(taskData);
  }
  checkTaskDownloaded(taskId) {
    return this.queryService.checkTaskDownloaded(taskId);
  }
  checkSavedRecordCount(assignmentId) {
    return this.queryService.checkSavedRecordCount(assignmentId);
  }
  saveAssignment(assignmentData) {
    return this.queryService.saveAssignment(assignmentData);
  }

  getDownloadedAssignments() {
    return this.queryService.getAssignments();
  }

  getDownloadedWO(taskId, formId, assignmentId, limit, offset, searchBy, filter,date,fromDate,toDate) {
    if (searchBy != Constants.nullValue || filter != Constants.nullValue || date!=Constants.nullValue) {
      // return  this.queryService.getDownloadedWO(taskId, formId, assignmentId, limit, offset);
      return this.queryService.getDownloadedWOSearch(taskId, formId, assignmentId, limit, offset, searchBy, filter,date,fromDate,toDate);
    } else {
      return this.queryService.getDownloadedWO(taskId, formId, assignmentId, limit, offset);
    }
  }

  deleteWorkorder(id) {
    return this.queryService.deleteWorkorder(id);
  }

  deleteDownloadedWO(recordId) {
    return this.queryService.deleteDownloadedWO(recordId);
  }

  updateWO(data) {
    return this.queryService.updateWO(data);
  }

  saveWO(data) {
    return this.queryService.saveWO(data);
  }

  deleteDownloadedAWO(assignmentId) {
    return this.queryService.deleteDownloadedAWO(assignmentId);
  }

  offlineAssignmentSearch(search, filter) {
    return this.queryService.assignmentSearch(search, filter);
  }
  insertAppVersion(id){
    return this.queryService.insertAppVersion(id)
  }
  getAppVersion(){
    return this.queryService.getAppVersion().then(res=>{
      return res['data'].item(0)['appVersion']
    })
  }


  getOfflineTaskInfo(taskId) {
    return this.queryService.getTaskInfo(taskId)
  }
  getFormInfo(formId) {
    return this.queryService.fetchFormsWidget(formId).then(queryResponse => {
      if (queryResponse['data'].length > 0) {
        this.data = {
          ['formName']: queryResponse['data'].item(0).name,
        }
        return { data: this.data, status: 1 }
      } else {
        return { data: [], status: 0 }
      }

    })
  }

  checkAndUpdateRefList(refData, version){
    return this.queryService.checkAndUpdateRefList(refData, version)
  }

  getRefList(dynamicDropdownTable,columnName,limit,offset,searchText){
    return this.queryService.getRefList(dynamicDropdownTable,columnName,limit,offset,searchText).then(queryResponse =>{
      if(queryResponse['data'].length > 0){
        let allValues = JSON.parse(queryResponse['data'].item(0).value);
        return {data: JSON.parse(queryResponse['data'].item(0).value)[columnName], status: 1}
      }  
      else{
        return {data: [], status: 0}
      }
    })
  }
  getLookUpTable(dynamicDropdownTable,columnName){
    return this.queryService.getLookUpTable(dynamicDropdownTable,columnName).then(queryResponse =>{
      if(queryResponse['data'].length > 0){
        return {data: JSON.parse(queryResponse['data'].item(0).value), status: 1}
      }  
      else{
        return {data: [], status: 0}
      }
    })
  }
  checkAndUpdateDependencyConditions(dependencyConditions){
    return this.queryService.checkAndUpdateDependencyConditions(dependencyConditions);
  }
  getDependencyConditionsList(formId){
    return this.queryService.getDependencyConditionsList(formId).then(queryResponse =>{
      if(queryResponse['data'] && queryResponse['data'].length > 0){
        let allValues = JSON.parse(queryResponse['data'].item(0).value);
        return {data: JSON.parse(queryResponse['data'].item(0).value), status: 1}
      }  
      else{
        return {data: [], status: 0}
      }
    })
  }
  checkAndUpdateLookUpTable(refData, version){
    return this.queryService.checkAndUpdateLookUpTable(refData, version)
  }
  getAllRefList(){
    return this.queryService.getAllRefList().
    then((queryResponse)=>{
      if(queryResponse.status == 0)
        return {data: [],status: 0}
      let referenceList = [];
      if(queryResponse['data'].length > 0){
        for (let i = 0; i < queryResponse['data'].length; i++) {
          referenceList.push({
            'name':queryResponse['data'].item(i).name,
            'value':queryResponse['data'].item(i).value,
            'version': queryResponse['data'].item(i).version,
          })  
         }       
        return {data: referenceList,status: 1}
      }else{
        return {data: [],status: 1}
      }
    })
  }
}
