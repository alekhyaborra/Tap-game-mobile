import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { FieldConfig } from '../../dynamic-form/models/field-config.interface';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiUrls } from '../../constants/api-urls';
import { FormBuilderService } from './form-builder.service';
import { DynamicFormComponent } from '../../dynamic-form/containers/dynamic-form/dynamic-form.component';
import { FormHeaderComponent } from '../../sharedComponents/form-header/form-header.component';
import { CommonService } from '../../sharedServices/commonServices/common.service';
import { GeoLocationService } from '../../sharedServices/geo-location.service';
import { Constants } from '../../constants/constants';
import { ToastService } from '../../sharedServices/toast.service';
import { LoadingService } from '../../sharedServices/loading.service';
import { QueryProcessService } from '../../offline/query-process/query-process.service';
import { AlertController, LoadingController, Platform } from '@ionic/angular';
import { DataSync } from '@awesome-cordova-plugins/data-sync/ngx';
import { Validators } from '@angular/forms';
import { ModalsService } from '../../sharedServices/modals.service';
import { AttachmentModalComponent } from '../../sharedComponents/attachment-modal/attachment-modal.component';
import { DisplayConstants } from '../../constants/constants';
import { DownloadService } from '../../sharedServices/download.service';
import { Diagnostic } from '@awesome-cordova-plugins/diagnostic/ngx';
import { RestApiService } from '../../sharedServices/rest-api.service';
@Component({
  selector: 'app-form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.scss'],
})
export class FormBuilderComponent implements OnInit {
  isHistoryView: boolean;
  query:any;
  formHeader:""
  formVersion: string;
  ellipsePopoverList: Array<string> = [Constants.ellipseListConstants.sketching, Constants.ellipseListConstants.attachmnet];
  config: FieldConfig[] = [
  ];
  searchitem:any;
  issearchactive: boolean=false;
  dbData: FieldConfig[] = [];
  dependencyConditions = [];
  recordData = {};
  lastWOInsertedId: any;
  recordStatus: number;
  recordInfo = {};
  derivedFields = [];
  networkStatus: boolean;
  networkStatusBO: any;
  loadingText: string;
  backButton: any;
  displayFieldLocal: any;
  showSaveButton = true;
  isAttcheMentIconEnable = true;
  displayProperties = DisplayConstants.properties;
  @ViewChild(DynamicFormComponent) dynamciForm: DynamicFormComponent;
  @ViewChild(FormHeaderComponent) fosrmHeaderRef: FormHeaderComponent;
  headerFields = [];
  fieldsUnderHeading = [];
  constructor(private route: ActivatedRoute,
    private formBuilderService: FormBuilderService,
    private commonService: CommonService,
    private geoLocationService: GeoLocationService,
    private toastService: ToastService,
    private loader: LoadingService,
    private router: Router,
    private queryProcessService: QueryProcessService,
    private loadingController: LoadingController,
    private platform: Platform,
    private alertController: AlertController,
    private commonservice: CommonService,
    private ngZone: NgZone,
    private dataSync: DataSync,
    protected modalService: ModalsService,
    protected downloadService: DownloadService,
    private diagnostic : Diagnostic,
    private restApiService: RestApiService,

  ) {
    this.backButton = this.platform.backButton.subscribeWithPriority(2, () => {
      this.presentAlertPrompt();
    });
  }
  async presentAlertPrompt() {
    if (this.dynamciForm.form.dirty) {
      const alert = await this.alertController.create({
        message: 'Sure you want to exit?',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
            }
          }, {
            text: 'Yes',
            handler: (data) => {
              this.commonservice.goBack();
            }
          }
        ]
      });

      await alert.present();
    } else {
      this.commonservice.goBack();
    }
  }

  showSecondLoader(lines, text) {
    this.loadingController.create({
      spinner: lines,
      message: text
    }).then((res) => {
      res.present();
      res.onDidDismiss().then((dis) => {
      });
    });
  }

  ionViewDidEnter() {
    this.loadingController.dismiss();
    setTimeout(() => {
      this.loadingController.dismiss();
    }, 100);
  }


  ngOnInit() {
    this.commonService.setFileAttachments([]);
    this.commonservice.clearRemoveUploadedFiles();
    console.log(this.commonservice.getGeoJsonData());

    this.showSecondLoader('dots', this.displayProperties.dotTextFormview);
    this.networkStatusBO = this.commonService.networkStatus.subscribe(status => {
      this.networkStatus = (<any>status);
      if (!status && this.commonService.getFormFillerLoadStatus()) {
        this.saveFilledFormData(true);
      }
      this.commonService.setFormFillerLoadStatus(true);
    })
    this.route.paramMap.subscribe(params => {
      var recordId_copy =  this.commonService.getrecordId_copy();

       this.commonService.setRecordId(recordId_copy);
        // this.commonService.setrecordId_copy(params.get('recordId_copy'));
      if (this.commonService.getWOData()) {
        this.recordStatus = this.commonService.getWOData().recordStatus;
      } else {
        this.recordStatus = Constants.nullValue;
      }
      if (this.router.url.indexOf('history') >= 0) {
        this.isHistoryView = true;
      } else {
        this.isHistoryView = false;
      }

      this.queryProcessService.getForm(params.get('formId')).then(queryResponse => {
        if (queryResponse.status === 1) {
          this.dbData = queryResponse.data.skeleton;
          this.displayFieldLocal = queryResponse.data.formInfo.displayName;
          this.formVersion = queryResponse.data.formInfo.version;
          this.derivedFields = JSON.parse(queryResponse.data.formInfo.derivedFields) ?
          JSON.parse(queryResponse.data.formInfo.derivedFields) : [];
          if (this.recordStatus === Constants.status.saved) {
            this.queryProcessService.getworkOrder(this.commonService.getWOData().id).then(res => {
              this.ngZone.run(() => {
                if (res['data'].length) {
                  const videoOptions = res['data'].item(0).videoOptions.length ? JSON.parse(res['data'].item(0).videoOptions) : [];
                  this.commonservice.setRemoveFilesList(JSON.parse(res['data'].item(0)['formValues']).removedAttachments);
                  this.commonService.setMediaData(videoOptions);
                  this.recordInfo = JSON.parse(res['data'].item(0).formValues);
                  this.recordData = this.recordInfo;
                  let check: any = this.commonservice.getGeoJsonData();
                  if(check && check.features && check.features.length >0){
                    console.log(check);
                  }
                  else {
                    this.recordData[Constants.saveWO.sketching] ?
                    this.commonservice.setGeoJsonData(this.recordData[Constants.saveWO.sketching]) : '';  
                  }
                  //  this.recordData[Constants.saveWO.sketching] ?
                  //   this.commonservice.setGeoJsonData(this.recordData[Constants.saveWO.sketching]) : '';
                }
              });

            });
          }
        } else {
          this.formVersion = Constants.nullValue;
        }

        const url = ApiUrls.getForm + '/' + params.get('formId') + '/' +
        params.get('recordId') + '/' + true + '/' + this.recordStatus + '/' + this.formVersion + '/'
        + Constants.nullValue + '/' + Constants.nullValue + '/' + this.commonService.getUserInfo()._id + '/' + Constants.openform;
        let that = this;
        this.getDependencyConditions(function() {
          that.formBuilderService.getformSkeltonWithPrepopData(url)
            .subscribe(res => {
              const responseData = res['data'];
              if (res.status === '5001') {
                that.config = that.dbData;
                that.recordData = res.data;
              } else {
                if (!responseData.data.isCurrentVersion) {
                  // that.displayFieldLocal = responseData.data.formInfo.displayField[0].id;
                  that.displayFieldLocal = JSON.stringify(responseData.data.formInfo.displayField);
                }
                if (responseData.data.formWidgets) {
                  that.queryProcessService.saveOrUpdateWidgets(responseData.data.formWidgets, responseData.data.formInfo,
                    that.formVersion, Constants.formDownLoadedType.autoDownload,
                    false, JSON.stringify(responseData.data.formInfo.dependentFields));
                  if(responseData.data.referenceList){
                    let forLookUpTable: Array<any> = [];
                    for (let i = 0; i < responseData.data.referenceList.length; i++) {
                      for (let key in responseData.data.referenceList[i]) {
                        let refData = { "refList": [{'name': key,'version': -1}]};
                        forLookUpTable.push(refData);
                      }
                    }
                    // console.log("Look Up table : ", forLookUpTable);
                    that.getAllLookUpTables(forLookUpTable);
                    that.downloadService.downloadRerList(responseData.data.referenceList, responseData.data.version);
                    that.commonservice.setRefList(responseData.data.referenceList);
                  }                
                  that.config = responseData.data.formWidgets;
                  that.derivedFields = responseData.data.formInfo.dependentFields;

                } else {
                  that.config = that.dbData;

                }
                
                if (that.recordStatus === Constants.status.new) {
                  that.recordData = responseData.data.recordInformation;
                } else if (that.recordStatus === Constants.status.saved) {
                  that.recordData = that.recordInfo;
                  that.recordData['recordId'] = responseData.data.recordInformation.recordId;
                } else {
                  that.recordData = responseData.data.recordInformation;
                }
                let check: any = that.commonservice.getGeoJsonData();
                  if(check && check.features && check.features.length >0){
                  console.log(check);
                }
                else {
                  that.recordData[Constants.saveWO.sketching] ?
                  that.commonservice.setGeoJsonData(that.recordData[Constants.saveWO.sketching]) : '';  
                }
              }
              that.config.forEach((element)=>{
                if(element.type == 'heading'){
                  // that.headerFields12.push(element['id']);
                }
              })
              let obj = {}
               
              // for(var i=0; i<that.headerFields12.length; i++){
              //   that.formArr=[]
              //   // console.log("header",that.headerFields12);
              //   for(var j=0; j<that.config.length; j++){
              //     // console.log("config",that.config[j]);
              //     if(that.headerFields12[i] == that.config[j]['isUnderHeading']){
              //       // console.log(that.headerFields12[i],that.config[j]['isUnderHeading']);
              //       that.formArr.push(that.config[j])
                    
              //     }
              //   }
              //   obj[that.headerFields12[i]] =that.formArr
           
              // }
              that.commonService.setFieldsUnderHeader(obj)
              // console.log("Config data : ", obj);

              // const allFruits = Object.assign({that.config}, that.config);
              // console.log("Derived Fields : ", allFruits);

              // console.log("original Record Id : ", responseData.data);
              that.commonService.setRecordId(that.recordData['recordId']);
            }, error => {
              that.config = that.dbData;
              that.recordData = that.recordInfo;
            });
        })
      });
    });
    
  }
 getAllLookUpTables(data){
    let url = ApiUrls.lookUpTableList;
    for (let i = 0; i < data.length; i++) {
      this.restApiService.postServiceProcess(url, data[i]).subscribe(
        (responseData: any) => {
          if (responseData['referenceList'] &&  responseData['referenceList'].length > 0) {
            this.downloadService.downloadLookUpTable(responseData['referenceList'], responseData['version']);
            console.log("checking.... ");
            // this.getDependencyConditions();
          }
          else {
          }
        },
        error => {
        });
    }
}
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy() {
    this.backButton.unsubscribe();
    if (this.networkStatusBO) {
      this.networkStatusBO.unsubscribe();
    }
    this.commonService.setFormFillerLoadStatus(false);
    this.commonService.setMediaData([]);
    this.commonService.setMandatoryTWIds([]);
     this.commonService.setGeoJsonData({});
  }
  getDependencyConditions(cb) {
    // let url = ApiUrls.baseUrl + ApiUrls.derivedConditions;
    // this.formService.getDependencyConditions(url).subscribe((res) => {
    //     if(res.data){
    //       console.log("Derived Conditions : ", res.data);
    //       this.downloadService.downloadDependencyConditions(res.data);
    //     }
    //     else {
          
    //     }
    // }, err => console.log("Error : ", err))

    this.formBuilderService.getFormDependecyConditions(this.route.snapshot.params.formId)
    .subscribe(res => {
      // console.log("res",res);
      this.dependencyConditions = res.data;
      cb();
    }, error => {
      // console.log("-------------------------error-----------------------",error);
      cb();
    })
  }
getOfflineWorkOrderData(id, callback) {
    const that = this;
    this.queryProcessService.getworkOrder(id).then(res => {
      if (res['data'].length) {
        for (let i = 0; i < res['data'].length; i++) {
          that.recordData = JSON.parse(res['data'].item(i).formValues);
          callback(JSON.parse(res['data'].item(i).formValues));
        }
      }
    });
  }
getFilledFormData(): void {
    this.removeDerivedHidenFields();
    if (!this.dynamciForm.valid || this.commonService.getMandatoryTWIds().length > 0) {
      if (!this.dynamciForm.valid) {
        this.addRemovedValideations();
        this.dynamciForm.form.markAsDirty();
        for (const control in this.dynamciForm.form.controls) {
          this.dynamciForm.form.controls[control].markAsDirty();
        }
      }
      if (this.commonService.getMandatoryTWIds().length > 0) {
        this.commonservice.requireTWSubject(this.commonService.getMandatoryTWIds());
      }
      this.toastService.showToast(this.displayProperties.invalidFormEntry);
    } else {
      this.saveFilledFormData(true, true);
    }
  }

  saveFilledFormData(showSaveMsg?, isSubmit?) {
    if (!isSubmit) {
      this.removeDerivedHidenFields();
    }
    try {
      this.showSecondLoader('dots', this.displayProperties.fetchLocation);
      this.queryProcessService.getFormInfoFromSqliteDb(this.route.snapshot.params.formId)
        .then((formDetails) => {
         const that = this;
          this.getLocationBeforePreparing(function (data) {
            that.loadingController.dismiss();
            that.loader.present();
            if (that.commonService.getWOData() && that.commonService.getWOData().recordStatus === Constants.status.saved) {
              if (that.commonService.getWOData().id) {
                data['id'] = that.commonService.getWOData().id;
              }
              that.queryProcessService.updateFormData(data)
                .then(res => {
                  if (res.status) {
                    that.addRemovedValideations();
                    if (!showSaveMsg) {
                      that.toastService.showToast(that.displayProperties.formSave);
                    }
                    // tslint:disable-next-line:max-line-length
                    that.commonService.formSaveSuccess({ _id: that.route.snapshot.params.recordId, insertId: that.commonService.getWOData().id, displayValue: data['formValues'][formDetails.data[Constants.widgetsTable.displayName]], isValid: data[Constants.widgetsTable.isValid] });
                  } else {
                    that.toastService.showToast(that.displayProperties.internalServerProblem);
                  }
                  that.fosrmHeaderRef.saveButtonStatus = true;
                  that.loader.dismiss();
                  const displayValue = data['formValues'][formDetails.data[Constants.widgetsTable.displayName]];

                  if (isSubmit) {
                    that.callToSubmit(that.route.snapshot.params.recordId,
                      that.commonService.getWOData().id,
                      that.route.snapshot.params.assignmentId || Constants.nullValue
                    );
                  } else {
                    that.commonService.setMapMarkerClikeInvite(that.route.snapshot.params.recordId,
                    Constants.status.saved,
                    that.commonService.getWOData().recordStatus,
                    displayValue);
                  }

                });
            } else {
              that.queryProcessService.saveFormData(data)
                .then(res => {
                  let displayValue = null;
                  that.addRemovedValideations();
                  if (res.status) {
                    const insertData = that.prepareInsertedData(data, res, formDetails);
                    that.commonService.getWOData().id = res['insertedData'].insertId;
                    that.lastWOInsertedId = res['insertedData'].insertId;
                       that.commonService.formSaveSuccess({ _id: that.route.snapshot.params.recordId, insertId: res['insertedData'].insertId, insertData: insertData, displayFields: formDetails.data[Constants.widgetsTable.displayName], isValid: data[Constants.widgetsTable.isValid] });
                    if (!showSaveMsg) {
                      that.toastService.showToast(that.displayProperties.formSave);
                    }
                    displayValue = data['formValues'][formDetails.data[Constants.widgetsTable.displayName]];


                  } else {
                    that.toastService.showToast(that.displayProperties.internalServerProblem);
                  }
                  that.fosrmHeaderRef.saveButtonStatus = true;


                  that.loader.dismiss();
                  if (isSubmit) {
                    that.callToSubmit(that.route.snapshot.params.recordId,
                      that.commonService.getWOData().id,
                      that.route.snapshot.params.assignmentId || Constants.nullValue
                    );
                  } else {
                    that.commonService.setMapMarkerClikeInvite(that.route.snapshot.params.recordId, Constants.status.saved,
                      that.commonService.getWOData().recordStatus, displayValue, res['insertedData'].insertId);
                      that.commonService.getWOData().recordStatus = Constants.status.saved;
                  }
                });
            }

          });
          // ended
        });
        
    } catch (e) {
      this.toastService.showToast(this.displayProperties.internalServerProblem);
    }
  }
  

  callToSubmit(recordId, offlineId, assignmentId) {
      const obj = {'recordId': recordId, 'offlineId': offlineId, 'assignmentId': assignmentId,
      'authorization': this.commonService.getUserInfo().token, 'isSync': '1', 'ip': ApiUrls.host};
      const that = this;
      this.dataSync.coolMethod(JSON.stringify(obj)).then((result) => {

                    if (result.status === 200) {
                      that.commonService.formsubmitSuccess((recordId === 'null' || recordId == null) ?
                      that.commonService.getWOData().id : recordId);
                      that.commonService.goBack();
                      that.commonService.setMapMarkerClikeInvite(recordId, Constants.status.submitted,
                        that.commonService.getWOData().recordStatus, Constants.nullValue);
                      this.toastService.showToast(this.displayProperties.workorderSubmitProcess, 2000);
                      this.commonService.setFileAttachments([]);
                    } else if (result.status === 204) {
                      this.toastService.showToast(this.displayProperties.noRecordFound);
                    } else {
                      this.toastService.showToast(this.displayProperties.internalProcessProblem);
                    }


                  }, (err) => {
                    this.toastService.showToast(this.displayProperties.internalProcessProblem);
      });
  }
  enableHighAccuracy: true
  getLocationBeforePreparing(callback) {
    const location = {}
    let successCallback = (isAvailable) => {
      if(!isAvailable){
      location['lati'] = '';
      location['loni'] = '';
      callback(this.prepareDataForSavingWO(location));
      }else{
        this.geoLocationService.getLatLong().then((data) => {
          location['lati'] = data.coords.latitude;
          location['loni'] = data.coords.longitude;
          callback(this.prepareDataForSavingWO(location));   
        }, (error) => {
          location['lati'] = '';
          location['loni'] = '';
          callback(this.prepareDataForSavingWO(location));   
        })
      }
    }
    let errorCallback = (e) => console.error(e);
    this.diagnostic.isLocationEnabled().then(successCallback).catch(errorCallback);
  }

  prepareDataForSavingWO(location) {
    const data = {};
    const formValues = this.dynamciForm.form.getRawValue();
    formValues[Constants.saveWO.sketching] = this.commonservice.getGeoJsonData();
    formValues['removedAttachments'] = this.commonService.getRemoveUploadedFiles();
    data[Constants.saveWO.formId] = this.route.snapshot.params.formId || Constants.nullValue;
    data[Constants.saveWO.userId] = this.commonService.getUserInfo()._id;
    data[Constants.saveWO.formValues] = formValues;
    data[Constants.saveWO.isValid] = this.dynamciForm.valid ? 1 : 0;
    data[Constants.saveWO.taskId] = this.route.snapshot.params.taskId || Constants.nullValue;
    data[Constants.saveWO.recordId] = this.route.snapshot.params.recordId || Constants.nullValue;
    data[Constants.saveWO.recordComments] = '';
    data[Constants.saveWO.recordType] = Constants.status.saved;
    data[Constants.saveWO.lat] = location.lati;
    data[Constants.saveWO.long] = location.loni;
    data[Constants.saveWO.videoOptions]  = JSON.stringify(this.commonService.getMediaData());
    data[Constants.saveWO.isVideoAvailable] = this.commonService.getMediaData() !== undefined && this.commonService.getMediaData().length ? 1 : 0;
    data[Constants.saveWO.assignmentId] = this.route.snapshot.params.assignmentId || Constants.nullValue;
    data[Constants.saveWO.taskName] = this.commonService.getWOData().taskName || Constants.nullValue;
    data[Constants.saveWO.displayValue] = this.dynamciForm.form.getRawValue()[this.displayFieldLocal];
    data[Constants.saveWO.dueDate] = this.commonService.getWOData().dueDate || Constants.nullValue;
    data[Constants.saveWO.insertDate] = new Date().setHours(0, 0, 0, 0);
    return data;
  }

  prepareInsertedData(data, res, formDetails) {
    const insertData = {
      status: 4,
      recordId: data[Constants.saveWO.recordId],
      formId: data[Constants.saveWO.formId],
      taskId: data[Constants.saveWO.taskId],
      displayValue: data[Constants.saveWO.displayValue],
      isValid: data[Constants.saveWO.isValid],
      insertDate: data[Constants.saveWO.insertDate],
      id: res['insertedData'].insertId
    };
    insertData[formDetails.data[Constants.widgetsTable.displayName]] =
    data['formValues'][formDetails.data[Constants.widgetsTable.displayName]];
    return insertData;
  }

  openSketching(event) {
    const state = this.commonservice.getMapType();
    console.log(this.isHistoryView)
    if (this.route.snapshot.params.taskId) {
      this.router.navigate(['dashboard/tasksList/' + Constants.mapTypes.osm + 'Sketching', true, this.isHistoryView]);
    } else {
      this.router.navigate(['dashboard/formsList/' + Constants.mapTypes.osm + 'Sketching', true, this.isHistoryView]);
    }
  }

  removeDerivedHidenFields() {
    this.config.forEach((item) =>{
      if(item["type"] == "heading"){
        this.headerFields.push(item["id"]);
      }
      if(item["isUnderHeading"]){
        this.fieldsUnderHeading.push(item);
      }
    })
    this.derivedFields.forEach((field) => {
       if (this.dynamciForm.form.get(field) &&
       this.dynamciForm.form.get(field).errors && this.dynamciForm.form.get(field).errors['required']) {
         this.dynamciForm.form.get(field).clearValidators();
         this.dynamciForm.form.get(field).updateValueAndValidity();
       }
      if(this.commonService.getHeaderFieldsbyHeaderId(field)){
        this.fieldsUnderHeading = this.commonService.getHeaderFieldsbyHeaderId(field)
        this.fieldsUnderHeading.forEach((headerField)=>{
          if(headerField["isUnderHeading"] == field){
            if (this.dynamciForm.form.get(headerField["id"]) &&
            this.dynamciForm.form.get(headerField["id"]).errors && this.dynamciForm.form.get(headerField["id"]).errors['required']) {
              this.dynamciForm.form.get(headerField["id"]).clearValidators();
              this.dynamciForm.form.get(headerField["id"]).updateValueAndValidity();
            }
          }
        })
       }
     
     });
   }

   addRemovedValideations() {
     for ( let index = 0; index < this.dynamciForm.config.length; index++) {
      if (this.derivedFields.indexOf(this.dynamciForm.config[index]['id']) > -1) {
        this.addValideation(this.dynamciForm.config[index]);
       }
     }
   }

   addValideation(fieldRef) {
     const validationList: any  = [];
     if (fieldRef['isRequired'] && fieldRef['isRequired'] === true) {
       validationList.push(Validators.required);
     }

     if (fieldRef['minLength']) {
       validationList.push(Validators.minLength(fieldRef['minLength']));
     }

     if (fieldRef['maxLength']) {
       validationList.push(Validators.maxLength(fieldRef['maxLength']));
     }
     this.derivedFields.forEach((field) => {
       if (this.dynamciForm.form.get(field)) {
         this.dynamciForm.form.get(field).setValidators(validationList);
         this.dynamciForm.form.get(field).updateValueAndValidity();
       }
     });
   }

   addAttachment() {
    const that = this;
    this.modalService.openModal(AttachmentModalComponent, 'attachment-modal', {recordId: this.route.snapshot.params.recordId},
    function (data) {
      if (that.commonService.getFileAttachments().length) {
        that.dynamciForm.form.markAsDirty();
      }
    });
  }

  searchfields(event){
    this.query = event
  }

  derivedFieldsUnderHeading(config){
    config.forEach((element)=>{
      if(element.type == 'heading'){
        this.headerFields.push(element['id']);
      }
    })
    let obj = {}
    for(var i=0; i<this.headerFields.length; i++){
      this.fieldsUnderHeading=[]
      for(var j=0; j<config.length; j++){
        if(this.headerFields[i] == config[j]['isUnderHeading']){
          this.fieldsUnderHeading.push(config[j])
        }
      }
      obj[this.headerFields[i]] = this.fieldsUnderHeading
    }
    this.commonService.setFieldsUnderHeader(obj);
  }

}

