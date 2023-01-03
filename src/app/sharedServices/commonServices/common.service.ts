import { StorageService } from './../storage.service';
import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { AlertService } from '../../sharedServices/alert.service';
import { LoadingService } from '../loading.service';
import { Router } from '@angular/router';
import { Device } from '@awesome-cordova-plugins/device/ngx';
import { Storage } from '@ionic/storage';
import { Constants, DisplayConstants } from 'src/app/constants/constants';
import { ToastController } from '@ionic/angular';
import { BehaviorSubject, Subject } from 'rxjs';
import { Diagnostic } from '@awesome-cordova-plugins/diagnostic/ngx';
import { FormGroup } from '@angular/forms';
@Injectable({
  providedIn: 'root'
})
export class CommonService {
  
  userDetails: any;
  user: any = {};
  username: any;
  formDBInfo: any;
  taskDBInfo: any;
  WODBInfo: any;
  pageData: any;
  WOData: any;
  filterData: any;
  isApplicationOnline: boolean;
  taskDueDate: string;
  mediaData: Array<any> = [];
  selectedWorkordersCount: number = 0;
  notificationRecord: any;
  recordId: any
  appVersion: number;
  syncId: Array<any> = [];
  formSyncId: Array<any> = [];
  taskId:any;
  recordId_copy:any;

  selectedObjcetsToshowOnMap = {
    "new": [],
    "re-assign": [],
    "saved": []
  }
  private messageSource = new BehaviorSubject('');
  currentMessage = this.messageSource.asObservable();

  public wOSaveSubject = new BehaviorSubject('');
  wOSubject = this.wOSaveSubject.asObservable();

  private networkToggleSubject = new BehaviorSubject('');
  networkStatus = this.networkToggleSubject.asObservable();

  public FieldSearchSubject = new Subject<string>();
  Fieldsearch = this.FieldSearchSubject.asObservable();

  private MapMarkerClikeInvite = new BehaviorSubject('');
  MapMarkerClikeInviteRef = this.MapMarkerClikeInvite.asObservable();

  private gpsToggleSubject = new BehaviorSubject('');
  gpsToggle = this.gpsToggleSubject.asObservable();

  public appVersionUpdate = new Subject<string>();
  
  // events comments by Narendra
  private fooSubject = new Subject<any>();

  downloadStatus: any;
  private downloadPercentageBO = new BehaviorSubject<Object>({ assignmentId: '', percentage: '' });
  downloadPercentageBORef = this.downloadPercentageBO.asObservable();
  downloadPercentage: any;
  formFillerStatus: any;
  tableWidgetIds = [];
  requireTWIds = new BehaviorSubject('');
  requireTWIdsBBO = this.requireTWIds.asObservable();
  mapType: any;
  geoJsonDataArray = {};
  geoTaggingInProgressImagesIds = [];

  fileAttachments: Array<any> = [{}];

  removedUploadFiles = [];
  displayProperties = DisplayConstants.properties;
  geoTagNumbers: any;
  draggedLatLngs: any;
  mapwidgetId: any;
  public srcCoords = new Subject();
  public destCoords = new Subject();
  setAllFieldsForTableList:FormGroup[] = [];
  public currentLocation = new Subject();
  formId: string;
  fieldsUnderHeader : any;
  assetFormDetails: any;
  assetFormId: any;
  constructor(private location: Location,
    private alertService: AlertService,
    //private device: Device,
    private storage: Storage,
    private router: Router,
    private loader: LoadingService,
    private toast: ToastController,
    private storageService: StorageService,
    private diagnostic: Diagnostic

  ) { }

  goBack() {
    this.location.back();
    
  }

  showGpsEnableAlert(msg) {
    let successCallback = (isAvailable) => {
      if (!isAvailable) {
        this.alertService.presentAlert(msg);
      }
    }
    let errorCallback = (e) => console.error(e);
    this.diagnostic.isLocationEnabled().then(successCallback).catch(errorCallback);

  }
  showErrorResponseAlert(errorCode, errorMessage) {
    if (this.loader.isLoading)
      this.loader.dismiss();
    switch (errorCode) {
      case 401: {
        this.alertService.presentAlert(this.displayProperties.sessionExpired);
        this.storage.clear();
        this.router.navigate(['login']);
        break;
      }
      case 404: {
        this.alertService.presentAlert(errorMessage || this.displayProperties.internalServerProblem);
        break;
      }
      default: {
        this.alertService.presentAlert(errorMessage || this.displayProperties.internalServerProblem);
        break;
      }
    }
  }

  showSuccessResponseAlert(statusCode, message, callBack) {
    switch (statusCode) {
      case 200: {
        callBack(1);
        break;
      }
      case 201: {
        callBack(1);
        break;
      }
      case 204: {
        this.alertService.presentAlert(message);
        callBack(0);
        break;
      }
      default: {
        this.alertService.presentAlert(this.displayProperties.internalServerProblem);
        callBack(0);
        break;
      }
    }
  }
  errorHandleOnDB(errorCode, errorMessage) {
    if (errorCode == 401) {
      this.storage.clear();
      this.router.navigate(['login']);
    }
  }

  setUserInfo(userInfo) {
    this.userDetails = userInfo;
  }
  getUserInfo() {
    return this.userDetails;
  }

  setMediaData(mediaData) {
    this.mediaData = mediaData;
  }
  getMediaData() {
    return this.mediaData;
  }


  formsubmitSuccess(recordId: string) {
    this.messageSource.next(recordId);
  }

  formSaveSuccess(data: any) {
    this.wOSaveSubject.next(data);
  }

  setFormDBInfo(formInfo) {
    this.formDBInfo = formInfo;
  }
  getFormDBInfo() {
    return this.formDBInfo;
  }

  setTaskDBInfo(taskInfo) {
    this.taskDBInfo = taskInfo;
  }
  getTaskDBInfo() {
    return this.taskDBInfo;
  }

  setWODBInfo(WOInfo) {
    this.WODBInfo = WOInfo;
  }
  getWODBInfo() {
    return this.WODBInfo;
  }
  setPageData(pageData) {
    this.pageData = pageData;
  }
  getPageData() {
    return this.pageData;
  }

  setWOData(WOData) {
    this.WOData = WOData;
  }
  setrecordId_copy(recordId_copy) {
    this.recordId_copy = recordId_copy;
  }
  getrecordId_copy() {
    return this.recordId_copy;
  }
  getWOData() {
    return this.WOData;
  }
  updateWODataOfflineId(id) {
    this.WOData.id = id;
  }

  setFilterData(data) {
    this.filterData = data;
  }
  getFilterData() {
    return this.filterData;
  }

  setApplicationNetworkStatus(status) {
    this.isApplicationOnline = status;
  }
  getApplicationNetworkStatus() {
    return this.isApplicationOnline;
  }

  setTaskDueDate(date) {
    this.taskDueDate = date
  }
  detTaskDueDate() {
    return this.taskDueDate;
  }

  changeNetworkStatus(status) {
    this.networkToggleSubject.next(status);
  }

  serachvalue(text){
    this.FieldSearchSubject.next(text)
  }
  setMapMarkerClikeInvite(id, status, prvStatus, displayValue, offlineId = null) {
    if (id)
      this.MapMarkerClikeInvite.next(id + "," + status + "," + prvStatus + "," + displayValue + "," + offlineId);
    else
      this.MapMarkerClikeInvite.next(undefined);
  }
  setSelectedWorkordersCount(count) {
    this.selectedWorkordersCount = count;
  }
  getSelectedWorkordersCount() {
    return this.selectedWorkordersCount;
  }
  setSelectedObjectToShowOnMap(object, displayFieldId, workOrderListKeys) {

    let latLongs: any;
    Object.keys(object).forEach(element => {
      let elemIndex = element.indexOf("Location");
      if ( elemIndex != -1) {
        if(object[element] && !latLongs)
          latLongs = object[element]
      }
    });
    if (latLongs) {
      if (!this.removeExistingObjcet(object)) {
        this.prepareselectedObjcetsToshowOnMapObj(object, latLongs, displayFieldId, workOrderListKeys)
      }
    }

  }

  prepareselectedObjcetsToshowOnMapObj(object, latLongs, displayFieldId, workOrderListKeys) {
    let markerInfoOPbj = {};
    markerInfoOPbj['displayValue'] = object[displayFieldId] || null;
    markerInfoOPbj['status'] = object[workOrderListKeys.status];
    markerInfoOPbj['dueDate'] = object[workOrderListKeys.dueDate] || null;
    markerInfoOPbj['startDate'] = object[workOrderListKeys.startDate] || null;
    markerInfoOPbj['formId'] = object[workOrderListKeys.formId] || null;
    markerInfoOPbj['AssignmentId'] = object[workOrderListKeys.assignmentId] || null;
    markerInfoOPbj['recordId'] = object[workOrderListKeys.recordId] || null;
    markerInfoOPbj['offlineId'] = object[workOrderListKeys.offlineId] || null;
    markerInfoOPbj['formName'] = object[workOrderListKeys.formName] || null;


    // let htmlViewDescription = `<div>
    // <ion-grid>
    //     <ion-row>
    //       <ion-col>`+object[displayFieldId]+`</ion-col>
    //     </ion-row>

    //     <ion-row>
    //       <ion-col><b>Status</b></ion-col>
    //       <ion-col>`+object[workOrderListKeys.status]+`</ion-col>
    //     </ion-row>
    //     <ion-row>
    //       <ion-col><b>Due date</b></ion-col>
    //       <ion-col>`+object[workOrderListKeys.dueDate] +`</ion-col>
    //    </ion-row>

    //    <ion-row>
    //     <ion-col>
    //         <div id="myWork">heloooo venki how r u </div>
    //         <ion-button expand="full" id="mapBtn" >Fill Form</ion-button>
    //     </ion-col>
    //    </ion-row>

    // </ion-grid>
    // </div>`
    let newLatLong = latLongs.split(',')
    let longlat = [];
    if (this.getMapType() == Constants.mapTypes.googleMap) {
      longlat[0] = parseFloat(newLatLong[1]);
      longlat[1] = parseFloat(newLatLong[0]);
    }
    else {
      longlat[0] = newLatLong[1];
      longlat[1] = newLatLong[0];
    }

    let localObj = {
      "type": "Feature",
      "_id": object._id,
      "id": object._id,
      "properties": { "markerInfo": markerInfoOPbj },
      "geometry": { "type": "Point", "coordinates": longlat }
    }
    if (object.status == Constants.status.new) {
      this.selectedObjcetsToshowOnMap.new.push(localObj)
    }
    else if (object.status == Constants.status.reassigned) {
      this.selectedObjcetsToshowOnMap["re-assign"].push(localObj)
    }
    else if (object.status == Constants.status.saved) {
      this.selectedObjcetsToshowOnMap["saved"].push(localObj)
    }
  }
  makeDefaultSelectedObjectToShowOnMap() {
    this.selectedObjcetsToshowOnMap = {
      "new": [],
      "re-assign": [],
      "saved": []
    }
  }
  removeExistingObjcet(objcet) {
    let existingCount = 0;
    for (let key in this.selectedObjcetsToshowOnMap) {
      let list = this.selectedObjcetsToshowOnMap[key].filter(function (el) { return el._id != objcet._id });
      if (list.length != this.selectedObjcetsToshowOnMap[key].length) {
        existingCount++;
        this.selectedObjcetsToshowOnMap[key] = list;
        return existingCount;
      }
    }
    return existingCount;

  }
  getSelectedObjectToShowOnMap() {
    return this.selectedObjcetsToshowOnMap;
  }
  setSelectedObjectToShowFromMap(data) {
    this.selectedObjcetsToshowOnMap = data;
  }
  setDownloadInProgress(status) {
    this.downloadStatus = status;
  }
  getDownloadInProgress() {
    return this.downloadStatus;
  }

  setPercentage(data: any) {
    this.downloadPercentageBO.next(data);
  }

  setDownloadPercntag(downloadPercentage) {
    this.downloadPercentage = downloadPercentage
  }
  getDownloadPercntag() {
    return this.downloadPercentage;
  }

  setNotificationRecord(record) {
    this.notificationRecord = record;
  }
  getNotificationRecord() {
    return this.notificationRecord;
  }

  setFormFillerLoadStatus(formFillerStatus) {
    this.formFillerStatus = formFillerStatus;
  }

  getFormFillerLoadStatus() {
    return this.formFillerStatus;
  }
  setRecordId(id) {
    this.recordId = id
  }
  getRecordId() {
    return this.recordId
  }

  setMandatoryTWIds(tableWidgetIds) {
    this.tableWidgetIds = tableWidgetIds;
  }

  getMandatoryTWIds() {
    return this.tableWidgetIds;
  }

  requireTWSubject(tWIds) {
    this.requireTWIds.next(tWIds);
  }

  setMapType(maptype) {
    this.mapType = maptype;
  }

  getMapType() {
    return this.mapType;
  }

  mapState() {
    return 'dashboard/tasksList/' + "osm";
  }

  setGeoJsonData(data) {
    this.geoJsonDataArray = data;
  }

  getGeoJsonData() {
    return this.geoJsonDataArray;
  }

  geometryFormData = new BehaviorSubject('');
  geometryFormDataRef = this.geometryFormData.asObservable();
  setGeometryFormData(data) {
    this.geometryFormData.next(data);
  }

  geometryPropertiesData;
  setGeometryProperties(data) {
    this.geometryPropertiesData = data;
  }

  getGeometryProperties() {
    return this.geometryPropertiesData;
  }

  geometryFormSkelton: Array<any> = [];
  setGeometryFormSkelton(data) {
    this.geometryFormSkelton = data;
  }

  getGeometryFormSkelton() {
    return this.geometryFormSkelton;
  }
  setAppVersion(version) {
    this.appVersion = version;
    this.appVersionUpdate.next(version);
  }

  setGeoTaggingInprogressImagesId(imageId) {
    this.geoTaggingInProgressImagesIds.push(imageId);
  }

  getGeoTaggingInprogressImagesIds() {
    return this.geoTaggingInProgressImagesIds;
  }

  removeGeoTaggingInprogressImagesId(imageId) {
    const index = this.geoTaggingInProgressImagesIds.indexOf(imageId);
    if (index > -1) {
      this.geoTaggingInProgressImagesIds.splice(index, 1);
    }
  }

  setFileAttachments(filesData) {
    this.fileAttachments = filesData;
  }
  getFileAttachments() {
    return this.fileAttachments;
  }

  setRemoveUploadedFiles(removedUploadFiles) {
    this.removedUploadFiles.push(removedUploadFiles);
  }
  setRemoveFilesList(list) {
    this.removedUploadFiles = [...this.removedUploadFiles, ...list];
  }
  getRemoveUploadedFiles() {
    return this.removedUploadFiles;
  }
  clearRemoveUploadedFiles() {
    this.removedUploadFiles = [];
  }

  // Abhilash Code for FormSync:
  addSyncIdToArray(obj) {
    const index = this.syncId.findIndex((e) => e === obj);
    if (index === -1) {
      this.syncId.push(obj);
    } else {
      this.syncId[index] = obj;
    }
  }

  addformSyncIdToArray(obj) {
    const index = this.formSyncId.findIndex((e) => e === obj);
    if (index === -1) {
      this.formSyncId.push(obj);
    } else {
      this.formSyncId[index] = obj;
    }
  }

  removeSyncId(obj) {
    const index = this.syncId.findIndex((e) => e === obj);
    if (index === -1) {
    } else {
      this.syncId.splice(index, 1)
    }
  }

  removeFormSyncId(obj) {
    const index = this.formSyncId.findIndex((e) => e === obj);
    if (index === -1) {
    } else {
      this.formSyncId.splice(index, 1)
    }
  }

  reflist = [];
  setRefList(list) {
    this.reflist = list
  }

  getRefList() {
    return this.reflist;
  }
  setGeoTagNumbers(geoTags) {
    this.geoTagNumbers = geoTags;
  }
  getGeoTagNumbers() {
    return this.geoTagNumbers;
  }
  setdragLatLng(latLngs) {
    this.draggedLatLngs = latLngs;
  }
  getdragLatLng() {
    return this.draggedLatLngs;
  }
  gpsTrack(status) {
    this.gpsToggleSubject.next(status);

    this.gpsToggle.subscribe(() => {
    })
  }
  setMapWidgetId(id) {
    this.mapwidgetId = id;
  }

  getMapWidgetId() {
    return this.mapwidgetId;
  }
  setTaskId(id) {
    this.taskId = id;
  }
  getTaskId() {
    return this.taskId;
  }
  getFormId() {
    return this.formId;
  }
  setFormId(formId) {
    this.formId = formId;
  }

  setSrcCoords(data){
    this.srcCoords.next(data);
  }
  setDestCoords(data){
    this.destCoords.next(data);
  }
setAllFieldsForTable(list){
    this.setAllFieldsForTableList = list;
  }

  getAllFieldsForTable(){
    return this.setAllFieldsForTableList;
  }

  setCurrentCoords(data){
    this.currentLocation.next(data);
  }

  setFieldsUnderHeader(data){
    this.fieldsUnderHeader = data
  }

  getHeaderFieldsbyHeaderId(headerId) {
    return this.fieldsUnderHeader[headerId];
  }

  setAssetFormData(AssetFormData) {
    this.assetFormDetails = AssetFormData;
  }

  getAssetFormData() {
    return this.assetFormDetails; 
  }

  setAssetFormId(AssetFormId) {
    this.assetFormId = AssetFormId;
  }

  getAssetFormId() {
    return this.assetFormId; 
  }

}
