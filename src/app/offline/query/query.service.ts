import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { BehaviorSubject } from 'rxjs';
import { Constants } from '../../constants/constants';
import { CommonService } from '../../sharedServices/commonServices/common.service';
import { DataSync } from '@awesome-cordova-plugins/data-sync/ngx';

@Injectable({
  providedIn: 'root'
})
export class QueryService {
  database: SQLiteObject;
  private databaseReady: BehaviorSubject<boolean>;
  selectFormQuery: any;
  public lookupDataReady: BehaviorSubject<boolean>;
  constructor(
    private sqlite: SQLite,
    private platform: Platform,
    private commonService: CommonService,
    private dataSync: DataSync
  ) {
    this.databaseReady = new BehaviorSubject(false);
    this.lookupDataReady = new BehaviorSubject(true);
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: Constants.databaseName,
        location: 'default',
      }).then((db: SQLiteObject) => {
        this.database = db;
        this.createSavedWOTable();
        this.createFormsTable();
        this.createTaskTable();
        this.createAssignmentTable();
        this.createWorkAssigmnetSyncTable();
        this.createWorkOordersyncTable();
        this.createWorkOordermMultiMediaSyncTable();
        this.createReferenceListTable();
        this.createUserProfileTable();
      });
    });
  }

  createUserProfileTable() {
    this.database.executeSql('CREATE TABLE IF NOT EXISTS ' + Constants.userProfileTable.table + '(' + Constants.userProfileTable.id + " integer primary key autoincrement," + Constants.userProfileTable.appVersion + ' text)', [])
      .then(() => { })
      .catch(e => { });
  }


  createFormsTable() {
    this.database.executeSql('CREATE TABLE IF NOT EXISTS ' + Constants.widgetsTable.table + '(' + Constants.widgetsTable.skeleton + ' text,' + Constants.widgetsTable.formId + ' varchar(50),' + Constants.widgetsTable.userId + ' varchar(50),' + Constants.widgetsTable.name + ' text,' + Constants.widgetsTable.version + ' varchar(50),' + Constants.widgetsTable.description + ' text,' + Constants.widgetsTable.createdBy + ' text,' + Constants.widgetsTable.displayName + ' text,' + Constants.widgetsTable.formType + ' integer,' + Constants.widgetsTable.derivedFields + ' text)', [])
      .then(() => { })
      .catch(e => { });
  }
  createWorkAssigmnetSyncTable() {
    this.database.executeSql('CREATE TABLE IF NOT EXISTS ' + Constants.syncAssignMentTable.table + '(' + Constants.syncAssignMentTable.assignmentId + ' text,' + Constants.syncAssignMentTable.formId + ' text,' + Constants.syncAssignMentTable.recordsCount + ' integer,' + Constants.syncAssignMentTable.status + ' integer)', [])
      .then(() => {
      })
      .catch(e => {
        console.log(e);
      });
  }
  createWorkOordersyncTable() {
    this.database.executeSql('CREATE TABLE IF NOT EXISTS ' + Constants.syncWorkorderTable.table + '(' + Constants.syncWorkorderTable.assignmentId + ' text,' + Constants.syncAssignMentTable.formId + ' text,' + Constants.syncWorkorderTable.recordId + ' varchar(50),' + Constants.syncWorkorderTable.status + ' integer,' + Constants.syncWorkorderTable.multiMediaCount + ' integer)', [])
      .then(() => {
      })
      .catch(e => {
        console.log(e);
      });
  }
  createWorkOordermMultiMediaSyncTable() {
    this.database.executeSql('CREATE TABLE IF NOT EXISTS ' + Constants.syncWorkorderMultiMediaTable.table + '(' + Constants.syncWorkorderMultiMediaTable.recordId + ' varchar(50),' + Constants.syncWorkorderMultiMediaTable.status + ' integer,' + Constants.syncWorkorderMultiMediaTable.fieldId + ' varchar(50))', [])
      .then(() => {
      })
      .catch(e => {
        console.log(e);
      });
  }
  saveDataTOFormsTable(widgets, formInfo, formType, derivedFields) {
    let displayName = formInfo.displayField[0].id;
    let FormWidgetsArray = [JSON.stringify(widgets), formInfo._id, this.commonService.getUserInfo().username, formInfo.name, formInfo.version, formInfo.description, formInfo.createdBy, displayName, formType, derivedFields];
    return this.database.executeSql("insert into " + Constants.widgetsTable.table + "(" + Constants.widgetsTable.skeleton + "," + Constants.widgetsTable.formId + "," + Constants.widgetsTable.userId + "," + Constants.widgetsTable.name + "," + Constants.widgetsTable.version + "," + Constants.widgetsTable.description + "," + Constants.widgetsTable.createdBy + "," + Constants.widgetsTable.displayName + "," + Constants.widgetsTable.formType + "," + Constants.widgetsTable.derivedFields + ") VALUES (?,?, ?, ?, ? ,? ,? ,?,?,?)", FormWidgetsArray)
      .then((data) => {
        return { insertedData: data, status: 1 }
      })
      .catch(e => {
        return { status: 0 }
      });
  }

  getCountOFRecordsSync(id){
    return this.database.executeSql("select * from syncAssignmentWorkOrderTable where assignmentId=?", [id])
        .then(function (data) {
        return { data: data.rows, status: 1 };
    })
        .catch(function (e) {
        return { status: 0 };
    });

  }
  getAssignmentsWhichAreSyncing(){
    this.selectFormQuery = "select * from syncAssignmentTable";
    return this.database.executeSql(this.selectFormQuery, [])
      .then((data) => {
        return { data: data.rows, status: 1 }
      })
      .catch(e => {
        return { status: 0 }
      });

      
      return this.database.executeSql("SELECT DISTINCT assignmentId FROM workOrder where isValid = 1", [])
      .then((data) => {
        return { data: data.rows, status: 1 }
      })
      .catch(e => {
        return { status: 0 }
      });
      
  }


  fetchFormsWidgets(formType, searchBy) {
    if (searchBy != Constants.nullValue) {
      this.selectFormQuery = "select * from " + Constants.widgetsTable.table + " where " + Constants.widgetsTable.name + " like '%" + searchBy + "%' and " + Constants.widgetsTable.userId + "=? and " + Constants.widgetsTable.formType + "=? ";
    } else {
      this.selectFormQuery = "select * from " + Constants.widgetsTable.table + " where " + Constants.widgetsTable.userId + "=? and " + Constants.widgetsTable.formType + "=? ";
    }
    const array = [this.commonService.getUserInfo().username, formType]
    return this.database.executeSql(this.selectFormQuery, array)
      .then((data) => {
        return { data: data.rows, status: 1 }
      })
      .catch(e => {
        return { status: 0 }
      });
  }
  fetchFormsWidget(formId) {

    return this.database.executeSql("select * from " + Constants.widgetsTable.table + " where " + Constants.widgetsTable.formId + "=? and " + Constants.widgetsTable.userId + "=?", [formId, this.commonService.getUserInfo().username])
      .then((data) => {
        return { data: data.rows, status: 1 }
      })
      .catch(e => {
        return { status: 0 }
      });
  }
  getTaskInfo(taskId) {
    return this.database.executeSql("select * from " + Constants.taskTable.tableName + " where " + Constants.taskTable.taskId + "=?", [taskId])
      .then((data) => {
        return { data: data.rows, status: 1 }
      })
      .catch(e => {
        return { status: 0 }
      });
  }
  updateFormWidgetTable(widgets, formInfo, formDownloadType, manualDownload?, derivedFields?) {
    let updateFormWidgetArray;
    let updateQuery;
    if (manualDownload) {
      updateFormWidgetArray = [formDownloadType, formInfo._id, this.commonService.getUserInfo().username];
      updateQuery = "update " + Constants.widgetsTable.table + " set " + Constants.widgetsTable.formType + "=? where " + Constants.widgetsTable.formId + "=? and " + Constants.widgetsTable.userId + "=?";
    }
    else if (formDownloadType == Constants.formDownLoadedType.autoDownload) {
      updateFormWidgetArray = [JSON.stringify(widgets), formInfo.name, formInfo.version, formInfo.description, formInfo.createdBy, derivedFields, formInfo._id, this.commonService.getUserInfo().username];
      updateQuery = "update " + Constants.widgetsTable.table + " set " + Constants.widgetsTable.skeleton + "=?," + Constants.widgetsTable.name + "=?," + Constants.widgetsTable.version + "=?," + Constants.widgetsTable.description + "=?," + Constants.widgetsTable.createdBy + "=?," + Constants.widgetsTable.derivedFields + "=? where " + Constants.widgetsTable.formId + "=? and " + Constants.widgetsTable.userId + "=?";
    }
    else {
      updateFormWidgetArray = [JSON.stringify(widgets), formInfo.name, formInfo.version, formInfo.description, formInfo.createdBy, formDownloadType, derivedFields, formInfo._id, this.commonService.getUserInfo().username];
      updateQuery = "update " + Constants.widgetsTable.table + " set " + Constants.widgetsTable.skeleton + "=?," + Constants.widgetsTable.name + "=?," + Constants.widgetsTable.version + "=?," + Constants.widgetsTable.description + "=?," + Constants.widgetsTable.createdBy + "=? " + Constants.widgetsTable.formType + "=?," + Constants.widgetsTable.derivedFields + "=? where " + Constants.widgetsTable.formId + "=? and " + Constants.widgetsTable.userId + "=?";
    }
    return this.database.executeSql(updateQuery, updateFormWidgetArray)
      .then((data) => {
        return { insertedData: data, status: 1 }
      })
      .catch(e => {
        return { status: 0 }
      });
  }

  createSavedWOTable() {
    const savedWOQuery = "create table if not exists " + Constants.saveWO.wOTable + "(" + Constants.saveWO.autoIncId + " integer primary key autoincrement," + Constants.saveWO.formId + " varchar(50)," + Constants.saveWO.userId + " varchar(50)," + Constants.saveWO.formValues + " text," + Constants.saveWO.isValid + " integer default 0," + Constants.saveWO.taskId + " varchar(50)," + Constants.saveWO.recordId + " varchar(50)," + Constants.saveWO.recordComments + " text," + Constants.saveWO.recordType + " integer," + Constants.saveWO.lat + " varchar(50)," + Constants.saveWO.long + " varchar(50)," + Constants.saveWO.videoOptions + " text," + Constants.saveWO.isVideoAvailable + " integer default 0," + Constants.saveWO.assignmentId + " varchar(50)," + Constants.saveWO.insertDate + " text," + Constants.saveWO.taskName + " varchar(50)," + Constants.saveWO.displayValue + " varchar(50)," + Constants.saveWO.dueDate + " text)"
    this.database.executeSql(savedWOQuery, [])
      .then(() => { })
      .catch(e => { });
  }

  saveWO(WOData) {
    if (WOData.recordId && WOData.recordId != 'null') {
      return this.database.executeSql("select * from " + Constants.saveWO.wOTable + " where " + Constants.saveWO.recordId + "=?", [WOData.recordId])
        .then((data) => {
          if (data.rows.length) {
            WOData['id'] = data.rows.item(0).id
            return this.updateWO(WOData).then((data) => {
              return { insertedData: { insertId: WOData['id'] }, status: 1 }
            })
              .catch(e => {
                return { status: 0 }
              });
          }
          else {
            return this.saveDownloadedWO(WOData);
          }
        })
        .catch(e => {
          return { status: 0 }
        });

    }
    else {
      return this.saveDownloadedWO(WOData);
    }
  }
  getDownloadedTask(taskId) {
    let taskDataArray = [taskId];
    const getTaskQuery = "select " + Constants.taskTable.isPrepop + " from " + Constants.taskTable.tableName + " where " + Constants.taskTable.taskId + "=?";
    return this.database.executeSql(getTaskQuery, taskDataArray)
      .then((data) => {
        return { data: data.rows, status: 1 }
      })
      .catch(e => {
        return { status: 0 }
      });
  }

  saveDownloadedWO(WOData) {

    let WODataArray = [WOData.formId, WOData.userId, JSON.stringify(WOData.formValues), WOData.isValid, WOData.taskId, WOData.recordId, WOData.recordComments, WOData.status, WOData.lat, WOData.long, WOData.videoOptions, WOData.isVideoAvailable, WOData.assignmentId, WOData.insertDate, WOData.name, WOData.displayValue, WOData.endDate];
    const saveQuery = "insert into " + Constants.saveWO.wOTable + "(" + Constants.saveWO.formId + "," + Constants.saveWO.userId + "," + Constants.saveWO.formValues + "," + Constants.saveWO.isValid + "," + Constants.saveWO.taskId + "," + Constants.saveWO.recordId + "," + Constants.saveWO.recordComments + "," + Constants.saveWO.recordType + "," + Constants.saveWO.lat + "," + Constants.saveWO.long + "," + Constants.saveWO.videoOptions + "," + Constants.saveWO.isVideoAvailable + "," + Constants.saveWO.assignmentId + "," + Constants.saveWO.insertDate + "," + Constants.saveWO.taskName + "," + Constants.saveWO.displayValue + "," + Constants.saveWO.dueDate + ") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    // actual isert query
    return this.database.executeSql(saveQuery, WODataArray)
      .then((data) => {
        return { insertedData: data, status: 1 }
      })
      .catch(e => {
        return { status: 0 }
      });
  }

  updateWO(WOData) {
    let WODataArray = [JSON.stringify(WOData.formValues), WOData.userId, WOData.isValid, WOData.lat, WOData.long, WOData.videoOptions, WOData.isVideoAvailable, WOData.insertDate, WOData.displayValue, Constants.status.saved, WOData.id];
    const updateQuery = "update " + Constants.saveWO.wOTable + " set " + Constants.saveWO.formValues + "=?," + Constants.saveWO.userId + "=?," + Constants.saveWO.isValid + "=?," + Constants.saveWO.lat + "=?," + Constants.saveWO.long + "=?," + Constants.saveWO.videoOptions + "=?," + Constants.saveWO.isVideoAvailable + "=?," + Constants.saveWO.insertDate + "=?," + Constants.saveWO.displayValue + "=?," + Constants.saveWO.recordType + "=? where " + Constants.saveWO.autoIncId + "=?";
    return this.database.executeSql(updateQuery, WODataArray)
      .then((data) => {
        return { insertedData: data, status: 1 }
      })
      .catch(e => {
        return { status: 0 }
      });
  }

  getAllWO(taskId, formId, assignmentId) {
    let getQuery, condition;
    if (taskId == Constants.nullValue && formId == Constants.nullValue) {
      getQuery = "select * from " + Constants.saveWO.wOTable + "  where " + Constants.saveWO.taskId + " is not null and " + Constants.saveWO.userId + "=? and " + Constants.saveWO.recordType + "=?";
      condition = [this.commonService.getUserInfo()._id, Constants.status.saved];
    }
    else if (taskId == Constants.nullValue) {
      getQuery = "select * from " + Constants.saveWO.wOTable + "  where " + Constants.saveWO.taskId + " is null and " + Constants.saveWO.formId + "=? and " + Constants.saveWO.userId + "=? and " + Constants.saveWO.recordType + "=?";
      condition = [formId, this.commonService.getUserInfo()._id, Constants.status.saved];
    }
    else {
      getQuery = "select * from " + Constants.saveWO.wOTable + "  where " + Constants.saveWO.taskId + "=? and " + Constants.saveWO.formId + "=? and " + Constants.saveWO.assignmentId + "=? and " + Constants.saveWO.userId + "=? and " + Constants.saveWO.recordType + "=?";
      condition = [taskId, formId, assignmentId, this.commonService.getUserInfo()._id, Constants.status.saved];
    }
    return this.database.executeSql(getQuery, condition)
      .then((data) => {
        return { data: data.rows, status: 1 }
      })
      .catch(e => {
        return { status: 0 }
      });
  }

  getAllWOSearch(taskId, formId, assignmentId, searchBy, filter) {
    let getQuery, condition;
    if (searchBy != Constants.nullValue && filter == Constants.nullValue) {
      if (taskId == Constants.nullValue && formId == Constants.nullValue) {
        getQuery = "select * from " + Constants.saveWO.wOTable + "  where " + Constants.saveWO.displayValue + " like '%" + searchBy + "%' and " + Constants.saveWO.taskId + " is not null and " + Constants.saveWO.userId + "=? and " + Constants.saveWO.recordType + "=?";
        condition = [this.commonService.getUserInfo()._id, Constants.status.saved];
      }
      else if (taskId == Constants.nullValue) {
        getQuery = "select * from " + Constants.saveWO.wOTable + "  where " + Constants.saveWO.displayValue + " like '%" + searchBy + "%' and " + Constants.saveWO.taskId + " is null and " + Constants.saveWO.formId + "=? and " + Constants.saveWO.userId + "=? and " + Constants.saveWO.recordType + "=?";
        condition = [formId, this.commonService.getUserInfo()._id, Constants.status.saved];
      }
      else {
        getQuery = "select * from " + Constants.saveWO.wOTable + "  where " + Constants.saveWO.displayValue + " like '%" + searchBy + "%' and " + Constants.saveWO.taskId + "=? and " + Constants.saveWO.formId + "=? and " + Constants.saveWO.assignmentId + "=? and " + Constants.saveWO.userId + "=? and " + Constants.saveWO.recordType + "=?";
        condition = [taskId, formId, assignmentId, this.commonService.getUserInfo()._id, Constants.status.saved];
      }
    } else if (searchBy == Constants.nullValue && filter != Constants.nullValue) {
      if (taskId == Constants.nullValue && formId == Constants.nullValue) {
        getQuery = "select * from " + Constants.saveWO.wOTable + "  where " + Constants.saveWO.taskId + " is not null and " + Constants.saveWO.userId + "=? and " + Constants.saveWO.recordType + "=?";
        condition = [this.commonService.getUserInfo()._id, Constants.status.saved];
      }
      else if (taskId == Constants.nullValue) {
        getQuery = "select * from " + Constants.saveWO.wOTable + "  where " + Constants.saveWO.taskId + " is null and " + Constants.saveWO.formId + "=? and " + Constants.saveWO.userId + "=? and " + Constants.saveWO.recordType + "=?";
        condition = [formId, this.commonService.getUserInfo()._id, Constants.status.saved];
      }
      else {
        getQuery = "select * from " + Constants.saveWO.wOTable + "  where " + Constants.saveWO.taskId + "=? and " + Constants.saveWO.formId + "=? and " + Constants.saveWO.assignmentId + "=? and " + Constants.saveWO.userId + "=? and " + Constants.saveWO.recordType + "=?";
        condition = [taskId, formId, assignmentId, this.commonService.getUserInfo()._id, Constants.status.saved];
      }
    } else if (searchBy != Constants.nullValue && filter != Constants.nullValue) {
      if (taskId == Constants.nullValue && formId == Constants.nullValue) {
        getQuery = "select * from " + Constants.saveWO.wOTable + "  where " + Constants.saveWO.displayValue + " like '%" + searchBy + "%' and " + Constants.saveWO.taskId + " is not null and " + Constants.saveWO.userId + "=? and " + Constants.saveWO.recordType + "=?";
        condition = [this.commonService.getUserInfo()._id, Constants.status.saved];
      }
      else if (taskId == Constants.nullValue) {
        getQuery = "select * from " + Constants.saveWO.wOTable + "  where " + Constants.saveWO.displayValue + " like '%" + searchBy + "%' and " + Constants.saveWO.taskId + " is null and " + Constants.saveWO.formId + "=? and " + Constants.saveWO.userId + "=? and " + Constants.saveWO.recordType + "=?";
        condition = [formId, this.commonService.getUserInfo()._id, Constants.status.saved];
      }
      else {
        getQuery = "select * from " + Constants.saveWO.wOTable + "  where " + Constants.saveWO.displayValue + " like '%" + searchBy + "%' and " + Constants.saveWO.taskId + "=? and " + Constants.saveWO.formId + "=? and " + Constants.saveWO.assignmentId + "=? and " + Constants.saveWO.userId + "=? and " + Constants.saveWO.recordType + "=?";
        condition = [taskId, formId, assignmentId, this.commonService.getUserInfo()._id, Constants.status.saved];
      }
    }
    return this.database.executeSql(getQuery, condition)
      .then((data) => {
        return { data: data.rows, status: 1 }
      })
      .catch(e => {
        return { status: 0 }
      });
  }

  getDownloadedWO(taskId, formId, assignmentId, limit, offset) {
    let getQuery, condition;
    if (taskId == Constants.nullValue && formId == Constants.nullValue) {
      getQuery = "select " + Constants.saveWO.assignmentId + "," + Constants.saveWO.displayValue + "," + Constants.saveWO.formValues + "," + Constants.saveWO.dueDate + "," + Constants.saveWO.formId + "," + Constants.saveWO.autoIncId + "," + Constants.saveWO.recordId + "," + Constants.saveWO.recordType + "," + Constants.saveWO.taskId + " from " + Constants.saveWO.wOTable + "  where " + Constants.saveWO.taskId + " is not null and " + Constants.saveWO.userId + "=? and (" + Constants.saveWO.recordType + "=" + Constants.status.new + " or " + Constants.saveWO.recordType + "=" + Constants.status.reassigned + ") limit " + limit + " offset  " + offset;
      condition = [this.commonService.getUserInfo().username];
    }
    else {
      getQuery = "select " + Constants.saveWO.assignmentId + "," + Constants.saveWO.displayValue + "," + Constants.saveWO.formValues + "," + Constants.saveWO.dueDate + "," + Constants.saveWO.formId + "," + Constants.saveWO.autoIncId + "," + Constants.saveWO.recordId + "," + Constants.saveWO.recordType + "," + Constants.saveWO.taskId + " from " + Constants.saveWO.wOTable + "  where " + Constants.saveWO.taskId + "=? and " + Constants.saveWO.formId + "=? and " + Constants.saveWO.assignmentId + "=? and " + Constants.saveWO.userId + "=? and (" + Constants.saveWO.recordType + "=" + Constants.status.new + " or " + Constants.saveWO.recordType + "=" + Constants.status.reassigned + ") limit " + limit + " offset  " + offset;
      condition = [taskId, formId, assignmentId, this.commonService.getUserInfo().username];
    }
    return this.database.executeSql(getQuery, condition)
      .then((data) => {
        return { data: data.rows, status: 1 }
      })
      .catch(e => {
        return { status: 0 }
      });
  }

  getDownloadedWOSearch(taskId, formId, assignmentId, limit, offset, searchBy, filter) {
    let getQuery, condition;
    if (searchBy != Constants.nullValue && filter == Constants.nullValue) {
      if (taskId == Constants.nullValue && formId == Constants.nullValue) {
        getQuery = "select " + Constants.saveWO.assignmentId + "," + Constants.saveWO.displayValue + "," + Constants.saveWO.formValues + "," + Constants.saveWO.dueDate + "," + Constants.saveWO.formId + "," + Constants.saveWO.autoIncId + "," + Constants.saveWO.recordId + "," + Constants.saveWO.recordType + "," + Constants.saveWO.taskId + " from " + Constants.saveWO.wOTable + "  where " + Constants.saveWO.displayValue + " like '%" + searchBy + "%' and " + Constants.saveWO.taskId + " is not null and " + Constants.saveWO.userId + "=? and (" + Constants.saveWO.recordType + "=" + Constants.status.new + " or " + Constants.saveWO.recordType + "=" + Constants.status.reassigned + ") limit " + limit + " offset  " + offset;
        condition = [this.commonService.getUserInfo().username];
      }
      else {
        getQuery = "select " + Constants.saveWO.assignmentId + "," + Constants.saveWO.displayValue + "," + Constants.saveWO.formValues + "," + Constants.saveWO.dueDate + "," + Constants.saveWO.formId + "," + Constants.saveWO.autoIncId + "," + Constants.saveWO.recordId + "," + Constants.saveWO.recordType + "," + Constants.saveWO.taskId + " from " + Constants.saveWO.wOTable + "  where " + Constants.saveWO.displayValue + " like '%" + searchBy + "%' and " + Constants.saveWO.taskId + "=? and " + Constants.saveWO.formId + "=? and " + Constants.saveWO.assignmentId + "=? and " + Constants.saveWO.userId + "=? and (" + Constants.saveWO.recordType + "=" + Constants.status.new + " or " + Constants.saveWO.recordType + "=" + Constants.status.reassigned + ") limit " + limit + " offset  " + offset;
        condition = [taskId, formId, assignmentId, this.commonService.getUserInfo().username];
      }
    } else if (searchBy == Constants.nullValue && filter != Constants.nullValue) {
      if (taskId == Constants.nullValue && formId == Constants.nullValue) {
        getQuery = "select " + Constants.saveWO.assignmentId + "," + Constants.saveWO.displayValue + "," + Constants.saveWO.formValues + "," + Constants.saveWO.dueDate + "," + Constants.saveWO.formId + "," + Constants.saveWO.autoIncId + "," + Constants.saveWO.recordId + "," + Constants.saveWO.recordType + "," + Constants.saveWO.taskId + " from " + Constants.saveWO.wOTable + "  where " + Constants.saveWO.taskId + " is not null and " + Constants.saveWO.userId + "=? and " + Constants.saveWO.recordType + "=? limit " + limit + " offset  " + offset;
        condition = [this.commonService.getUserInfo().username, Constants.statusValue[filter]];
      }
      else {
        getQuery = "select " + Constants.saveWO.assignmentId + "," + Constants.saveWO.displayValue + "," + Constants.saveWO.formValues + "," + Constants.saveWO.dueDate + "," + Constants.saveWO.formId + "," + Constants.saveWO.autoIncId + "," + Constants.saveWO.recordId + "," + Constants.saveWO.recordType + "," + Constants.saveWO.taskId + " from " + Constants.saveWO.wOTable + "  where " + Constants.saveWO.taskId + "=? and " + Constants.saveWO.formId + "=? and " + Constants.saveWO.assignmentId + "=? and " + Constants.saveWO.userId + "=? and " + Constants.saveWO.recordType + "=? limit " + limit + " offset  " + offset;
        condition = [taskId, formId, assignmentId, this.commonService.getUserInfo().username, Constants.statusValue[filter]];
      }
    } else if (searchBy != Constants.nullValue && filter != Constants.nullValue) {

      if (taskId == Constants.nullValue && formId == Constants.nullValue) {
        getQuery = "select " + Constants.saveWO.assignmentId + "," + Constants.saveWO.displayValue + "," + Constants.saveWO.formValues + "," + Constants.saveWO.dueDate + "," + Constants.saveWO.formId + "," + Constants.saveWO.autoIncId + "," + Constants.saveWO.recordId + "," + Constants.saveWO.recordType + "," + Constants.saveWO.taskId + " from " + Constants.saveWO.wOTable + "  where " + Constants.saveWO.displayValue + " like '%" + searchBy + "%' and " + Constants.saveWO.taskId + " is not null and " + Constants.saveWO.userId + "=? and " + Constants.saveWO.recordType + "=? limit " + limit + " offset  " + offset;
        condition = [this.commonService.getUserInfo().username, Constants.statusValue[filter]];
      }
      else {
        getQuery = "select " + Constants.saveWO.assignmentId + "," + Constants.saveWO.displayValue + "," + Constants.saveWO.formValues + "," + Constants.saveWO.dueDate + "," + Constants.saveWO.formId + "," + Constants.saveWO.autoIncId + "," + Constants.saveWO.recordId + "," + Constants.saveWO.recordType + "," + Constants.saveWO.taskId + " from " + Constants.saveWO.wOTable + "  where " + Constants.saveWO.displayValue + " like '%" + searchBy + "%' and " + Constants.saveWO.taskId + "=? and " + Constants.saveWO.formId + "=? and " + Constants.saveWO.assignmentId + "=? and " + Constants.saveWO.userId + "=? and " + Constants.saveWO.recordType + "=? limit " + limit + " offset  " + offset;
        condition = [taskId, formId, assignmentId, this.commonService.getUserInfo().username, Constants.statusValue[filter]];
      }
    }

    return this.database.executeSql(getQuery, condition)
      .then((data) => {
        return { data: data.rows, status: 1 }
      })
      .catch(e => {
        return { status: 0 }
      });
  }

  getworkOrder(id) {
    return this.database.executeSql("select * from " + Constants.saveWO.wOTable + " where " + Constants.saveWO.autoIncId + "=?", [id])
      .then((data) => {
        return { data: data.rows, status: 1 }
      })
      .catch(e => {
        return { status: 0 }
      });
  }
  getAppVersion() {
    return this.database.executeSql("select * from " + Constants.userProfileTable.table + " ORDER BY id DESC LIMIT 1", [])
      .then((data) => {
        return { data: data.rows, status: 1 }
      })
      .catch(e => {
        console.log(e)
        return { status: 0 }
      });
  }
  insertAppVersion(id) {
    let array = [id];
    return this.database.executeSql("insert into " + Constants.userProfileTable.table + "(" + Constants.userProfileTable.appVersion + ") VALUES (?)", array)
      .then((data) => {
        this.getAppVersion()
        return { insertedData: data, status: 1 }
      })
      .catch(e => {
        console.log(e)
        return { status: 0 }
      });
  }



  deleteWorkorder(id) {
    return this.database.executeSql("delete from " + Constants.saveWO.wOTable + " where " + Constants.saveWO.autoIncId + "=? ", [id])
      .then((data) => {
        return { data: data.rows, status: 1 }
      })
      .catch(e => {
        return { status: 0 }
      });
  }

  deleteDownloadedWO(recordId) {
    return this.database.executeSql("delete from " + Constants.saveWO.wOTable + " where " + Constants.saveWO.recordId + "=? ", [recordId])
      .then((data) => {
        return { data: data.rows, status: 1 }
      })
      .catch(e => {
        return { status: 0 }
      });
  }

  createTaskTable() {
    const taskTableQuery = "create table if not exists " + Constants.taskTable.tableName + "(" + Constants.taskTable.autoIncId + " integer primary key autoincrement," + Constants.taskTable.taskId + " varchar(50)," + Constants.taskTable.userId + " varchar(50)," + Constants.taskTable.name + " text," + Constants.taskTable.status + " varchar(50)," + Constants.taskTable.createdBy + " varchar(50)," + Constants.taskTable.startDate + " text," + Constants.taskTable.endDate + " text)"
    this.database.executeSql(taskTableQuery, [])
      .then(() => { })
      .catch(e => { });
  }

  createAssignmentTable() {
    const assignmentTableQuery = "create table if not exists " + Constants.assignmentTable.tableName + "(" + Constants.assignmentTable.autoIncId + " integer primary key autoincrement," + Constants.assignmentTable.taskId + " varchar(50)," + Constants.assignmentTable.assignmentId + " varchar(50)," + Constants.assignmentTable.formId + " varchar(50)," + Constants.assignmentTable.userId + " varchar(50)," + Constants.assignmentTable.name + " text," + Constants.assignmentTable.createdBy + " varchar(50)," + Constants.assignmentTable.startDate + " text," + Constants.assignmentTable.endDate + " text, " + Constants.assignmentTable.status + " text)"
    this.database.executeSql(assignmentTableQuery, [])
      .then(() => { })
      .catch(e => { console.log(e) });
  }

  saveTask(taskData) {
    let taskDataArray = [taskData.taskId];
    const getTaskQuery = "select " + Constants.taskTable.autoIncId + " from " + Constants.taskTable.tableName + " where " + Constants.taskTable.taskId + "=?";
    return this.database.executeSql(getTaskQuery, taskDataArray)
      .then((data) => {
        if (data.rows.length == 0) {
          let taskDataArray = [taskData.taskId, taskData.userId, taskData.name, taskData.status, taskData.createdBy, taskData.startDate, taskData.endDate];
          const saveQuery = "insert into " + Constants.taskTable.tableName + "(" + Constants.taskTable.taskId + "," + Constants.taskTable.userId + "," + Constants.taskTable.name + "," + Constants.taskTable.status + "," + Constants.taskTable.createdBy + "," + Constants.taskTable.startDate + "," + Constants.taskTable.endDate + ") VALUES (?, ?, ?, ?, ?, ?, ?)";
          return this.database.executeSql(saveQuery, taskDataArray)
            .then((data) => {
              return { insertedData: data, status: 1 }
            })
            .catch(e => {
              return { status: 0 }
            });
        }
        else {
          let taskDataArray = [taskData.name, taskData.status, taskData.startDate, taskData.endDate, taskData.taskId,];
          const updateQuery = "update " + Constants.taskTable.tableName + " set " + Constants.taskTable.name + "=?," + Constants.taskTable.status + "=?," + Constants.taskTable.startDate + "=?," + Constants.taskTable.endDate + "=? where " + Constants.taskTable.taskId + "=?";
          return this.database.executeSql(updateQuery, taskDataArray)
            .then((data) => {
              return { insertedData: data, status: 1 }
            })
            .catch(e => {
              return { status: 0 }
            });
        }
      })
      .catch(e => {
        return { status: 0 }
      });

  }

  checkTaskDownloaded(taskId) {
    let taskDataArray = [taskId];
    const getTaskQuery = "select " + Constants.taskTable.autoIncId + " from " + Constants.taskTable.tableName + " where " + Constants.taskTable.taskId + "=?";
    return this.database.executeSql(getTaskQuery, taskDataArray)
      .then((data) => {
        if (data.rows.length == 0) {
          return { status: 2 }
        }
        else {
          return { status: 1 }
        }
      })
      .catch(e => {
        return { status: 0 }
      });
  }

  checkSavedRecordCount(assignmentId) {
    const getQuery = 'select count(*) as count from ' + Constants.saveWO.wOTable + "  where " + Constants.saveWO.assignmentId + "=? and " + Constants.saveWO.userId + "=? and " + Constants.saveWO.recordType + "=?";
    const condition = [assignmentId, this.commonService.getUserInfo().username, Constants.status.saved];

    return this.database.executeSql(getQuery, condition)
      .then((data) => {
        return { data: data.rows, status: 1 }
      })
      .catch(e => {
        return { status: 0 }
      });
  }

  deleteDownloadedAWO(assignmentId) {
    let taskDataArray = [assignmentId];
    const getTaskQuery = "delete from " + Constants.saveWO.wOTable + " where " + Constants.saveWO.assignmentId + "=?";
    return this.database.executeSql(getTaskQuery, taskDataArray)
      .then((data) => {
        return { status: 1 }
      })
      .catch(e => {
        return { status: 0 }
      });
  }

  saveAssignment(assignmentData) {
    let assignmentIdArray = [assignmentData.assignmentId];
    const getTaskQuery = "select " + Constants.assignmentTable.autoIncId + " from " + Constants.assignmentTable.tableName + " where " + Constants.assignmentTable.assignmentId + "=?";
    return this.database.executeSql(getTaskQuery, assignmentIdArray)
      .then((data) => {
        if (data.rows.length == 0) {
          let assignmentDataArray = [assignmentData.taskId, assignmentData.assignmentId, assignmentData.formId, assignmentData.userId, assignmentData.name, assignmentData.startDate, assignmentData.endDate, assignmentData.status, assignmentData.createdBy];
          const saveQuery = "insert into " + Constants.assignmentTable.tableName + "(" + Constants.assignmentTable.taskId + "," + Constants.assignmentTable.assignmentId + "," + Constants.assignmentTable.formId + "," + Constants.assignmentTable.userId + "," + Constants.assignmentTable.name + "," + Constants.taskTable.startDate + "," + Constants.taskTable.endDate + "," + Constants.taskTable.status + "," + Constants.assignmentTable.createdBy + " ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
          return this.database.executeSql(saveQuery, assignmentDataArray)
            .then((data) => {
              return { insertedData: data, status: 1 }
            })
            .catch(e => {
              return { status: 0 }
            });
        }
        else {
          let taskDataArray = [assignmentData.name, assignmentData.startDate, assignmentData.endDate, assignmentData.status, assignmentData.assignmentId];
          const updateQuery = "update " + Constants.assignmentTable.tableName + " set " + Constants.assignmentTable.name + "=?," + Constants.assignmentTable.startDate + "=?," + Constants.assignmentTable.endDate + "=?," + Constants.assignmentTable.status + "=? where " + Constants.assignmentTable.assignmentId + "=?";
          return this.database.executeSql(updateQuery, taskDataArray)
            .then((data) => {
              return { insertedData: data, status: 1 }
            })
            .catch(e => {
              return { status: 0 }
            });
        }
      })
      .catch(e => {
        return { status: 0 }
      });
  }

  getAssignments() {
    return this.database.executeSql("select * from " + Constants.assignmentTable.tableName + " where " + Constants.assignmentTable.userId + " =?", [this.commonService.getUserInfo().username])
      .then((data) => {
        return { data: data.rows, status: 1 }
      })
      .catch(e => {
        return { status: 0 }
      });
  }
  assignmentSearch(search, filter) {
    if (filter == "Reassigned") {
      filter = "Reassigned"
    }
    let searchQuery

    let condition



    if (search != Constants.nullValue && filter == Constants.nullValue) {
      searchQuery = "select * from " + Constants.assignmentTable.tableName + " Where " + Constants.assignmentTable.name + " like '%" + search + "%' and " + Constants.assignmentTable.userId + " =?"
      condition = [this.commonService.getUserInfo().username];

    } else if (search == Constants.nullValue && filter != Constants.nullValue) {
      searchQuery = "select * from " + Constants.assignmentTable.tableName + " Where " + Constants.assignmentTable.userId + " =? and " + Constants.assignmentTable.status + "=?"
      condition = [this.commonService.getUserInfo().username, filter];

    } else if (search != Constants.nullValue && filter != Constants.nullValue) {
      searchQuery = "select * from " + Constants.assignmentTable.tableName + " Where " + Constants.assignmentTable.userId + " =? and " + Constants.assignmentTable.name + " like '%" + search + "%' and " + Constants.assignmentTable.status + "=?"
      condition = [this.commonService.getUserInfo().username, filter];


    }
    return this.database.executeSql(searchQuery, condition)
      .then((data) => {
        return { data: data.rows, status: 1 }
      })
      .catch(e => {
        return { status: 0 }
      });
  }

  createReferenceListTable() {
    const taskTableQuery = "create table if not exists " + Constants.referenceListTabe.tableName + "(" + Constants.referenceListTabe.autoIncId + " integer primary key autoincrement," + Constants.referenceListTabe.name + " varchar(500)," +  Constants.referenceListTabe.value + " text," + Constants.referenceListTabe.version + " varchar(50))"
    this.database.executeSql(taskTableQuery, [])
      .then(() => {})
      .catch(e => {});
  }

  checkAndUpdateRefList(refData, version) {
    var count = Object.keys(refData).length;
    var incVal = 0
    
    for (let ref in refData) {
      let searchQuery = "select * from " + Constants.referenceListTabe.tableName + " Where " + Constants.referenceListTabe.name + " =?";
      let refName = Object.keys(refData[ref])[0]
      let condition = [refName];
      this.database.executeSql(searchQuery, condition)
        .then((data) => {
          if (data.rows.length) {
            let updateFormWidgetArray = [JSON.stringify(refData[ref][refName]),version[ref][refName],refName];
            let updateQuery = "update " + Constants.referenceListTabe.tableName + " set " + Constants.referenceListTabe.value + "=?,"+Constants.referenceListTabe.version+"=?  where " + Constants.referenceListTabe.name + "=?";
            return this.database.executeSql(updateQuery, updateFormWidgetArray)
              .then((data) => {
                ++incVal;
                if(incVal == count)
                  return { insertedData: data, status: 1 }
              })
              .catch(e => {
                return { status: 0 }
              });
          }
          else {
          let assignmentDataArray = [refName, version[ref][refName], JSON.stringify(refData[ref][refName])];
          const saveQuery = "insert into " + Constants.referenceListTabe.tableName + "(" + Constants.referenceListTabe.name + "," + Constants.referenceListTabe.version + "," + Constants.referenceListTabe.value+ " ) VALUES (?, ?, ?)";
          return this.database.executeSql(saveQuery, assignmentDataArray)
            .then((data) => {
              ++incVal;
              if(incVal == count)
                return { insertedData: data, status: 1 }
            })
            .catch(e => {
              return { status: 0 }
            });
          }
        })
        .catch(e => {
          return { status: 0 }
        });
    }
  }

  getRefList(dynamicDropdownTable, columnName,limit,offset,searchText) {
    let searchQuery = "select * from " + Constants.referenceListTabe.tableName + " Where " + Constants.referenceListTabe.name + " =?";
    let condition = [dynamicDropdownTable];
    return this.database.executeSql(searchQuery, condition)
      .then((data) => {
        return { data: data.rows, status: 1 }
      })
      .catch(e => {
        return { status: 0 }
      });
  }
  getAllRefList() {
    let searchQuery = "select * from " + Constants.referenceListTabe.tableName;
    let condition = [];
    return this.database.executeSql(searchQuery, condition)
      .then((data) => {
        return { data: data.rows, status: 1 }
      })
      .catch(e => {
        return { status: 0 }
      });
  }
  checkAndUpdateLookUpTable(refData, version) {
    var count = Object.keys(refData).length;
    var incVal = 0
    this.lookupDataReady.next(false);
    for (let ref in refData) {
      let searchQuery = "select * from " + Constants.lookUpTabel.tableName + " Where " + Constants.lookUpTabel.name + " =?";
      let refName = Object.keys(refData[ref])[0]
      let condition = [refName];
      this.database.executeSql(searchQuery, condition)
        .then((data) => {
          if (data.rows.length) {
            let updateFormWidgetArray = [JSON.stringify(refData[ref][refName]),version[ref][refName].__v, refName];
            let updateQuery = "update " + Constants.lookUpTabel.tableName + " set " + Constants.lookUpTabel.value + "=?,"+Constants.lookUpTabel.version+"=?  where " + Constants.lookUpTabel.name + "=?";
            return this.database.executeSql(updateQuery, updateFormWidgetArray)
              .then((data) => {
                ++incVal;
                console.log("Lookup table data updated : ", data);
                this.lookupDataReady.next(true);
                if(incVal == count)
                  return { insertedData: data, status: 1 }
              })
              .catch(e => {
                this.lookupDataReady.next(true);
                return { status: 0 }
              });
          }
          else {
          let assignmentDataArray = [refName, version[ref][refName].__v, JSON.stringify(refData[ref][refName])];
          const saveQuery = "insert into " + Constants.lookUpTabel.tableName + "(" + Constants.lookUpTabel.name + "," + Constants.lookUpTabel.version + "," + Constants.lookUpTabel.value+ " ) VALUES (?, ?, ?)";
          return this.database.executeSql(saveQuery, assignmentDataArray)
            .then((data) => {
              ++incVal;
              console.log("Lookup table data inserted : ", data);
              this.lookupDataReady.next(true);
              if(incVal == count)
                return { insertedData: data, status: 1 }
            })
            .catch(e => {
              this.lookupDataReady.next(true);
              return { status: 0 }
            });
          }
        })
        .catch(e => {
          this.lookupDataReady.next(true);
          return { status: 0 }
        });
    }
  }
  getDependencyConditionsList(formId){
    let searchQuery = "select * from " + Constants.dependencyConditionsTable.tableName + " Where " + Constants.dependencyConditionsTable.formId + " =?";
    let condition = [formId];
    return this.database.executeSql(searchQuery, condition)
      .then((data) => {
        return { data: data.rows, status: 1 }
      })
      .catch(e => {
        return { status: 0 }
      });
  }

  checkAndUpdateDependencyConditions(dependencyCondData) {
    var count = Object.keys(dependencyCondData).length;
    var incVal = 0
    
    for (let ref in dependencyCondData) {
      let searchQuery = "select * from " + Constants.dependencyConditionsTable.tableName + " Where " + Constants.dependencyConditionsTable.formId + " =?";
      let refName = dependencyCondData[ref]._id;
      let condition = [refName];
      this.database.executeSql(searchQuery, condition)
        .then((data) => {
          // 
          if (data.rows.length) {
            let updateFormWidgetArray = [JSON.stringify(dependencyCondData[ref].conditions), refName];
            let updateQuery = "update " + Constants.dependencyConditionsTable.tableName + " set " + Constants.dependencyConditionsTable.value + "=? where " + Constants.dependencyConditionsTable.formId + "=?";
            return this.database.executeSql(updateQuery, updateFormWidgetArray)
              .then((data) => {
                ++incVal;
                if(incVal == count)
                  return { insertedData: data, status: 1 }
              })
              .catch(e => {
                return { status: 0 }
              });
          }
          else {
          let assignmentDataArray = [refName, JSON.stringify(dependencyCondData[ref].conditions)];
          const saveQuery = "insert into " + Constants.dependencyConditionsTable.tableName + "(" + Constants.dependencyConditionsTable.formId + "," + Constants.dependencyConditionsTable.value+ " ) VALUES (?, ?)";
          return this.database.executeSql(saveQuery, assignmentDataArray)
            .then((data) => {
              ++incVal;
              if(incVal == count)
                return { insertedData: data, status: 1 }
            })
            .catch(e => {
              return { status: 0 }
            });
          }
        })
        .catch(e => {
          return { status: 0 }
        });
    }
  }
  getLookUpTable(dynamicDropdownTable, columnName) {
    let searchQuery = "select * from " + Constants.lookUpTabel.tableName + " Where " + Constants.lookUpTabel.name + " =?";
    let condition = [dynamicDropdownTable];
    return this.database.executeSql(searchQuery, condition)
      .then((data) => {
        return { data: data.rows, status: 1 }
      })
      .catch(e => {
        return { status: 0 }
      });
  }
}
