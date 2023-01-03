import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiUrls } from '../../constants/api-urls';
import { Constants } from '../../constants/constants';
import { LoadingService } from '../../sharedServices/loading.service';
import { formListStructure } from './forms-list';
import { FormsService } from '../forms.service';
import { IonItemSliding } from '@ionic/angular';
import { InfoModalComponent } from '../../sharedComponents/info-modal/info-modal.component';
import { CommonService } from '../../sharedServices/commonServices/common.service';
import { HeaderInputs } from 'src/app/sharedComponents/header/headerInputs';
import { SearchService } from 'src/app/sharedComponents/header/search/search.service';
import { DownloadService } from 'src/app/sharedServices/download.service';
import { ToastService } from 'src/app/sharedServices/toast.service';
import { ModalsService } from '../../sharedServices/modals.service';
import { HeaderComponent } from '../../sharedComponents/header/header.component';
import { DisplayConstants } from '../../constants/constants';
import { DataSync } from '@awesome-cordova-plugins/data-sync/ngx';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-forms-list',
  templateUrl: './forms-list.page.html',
  styleUrls: ['./forms-list.page.scss']
})
export class FormsListPage implements OnInit {

  @ViewChild(HeaderComponent) headerComponent: HeaderComponent;

  imageIcons = Constants.imageIcons;
  stopInfiniteScroll: boolean;
  searchBy: string = Constants.nullValue;
  searchEnabled: boolean;
  searchOffset = 1;
  currentState = 'forms';
  hideEllipse = true;
  hideFilter = true;
  hideMap = true;
  formListHeader: string;
  loaderText = Constants.infiniteScrollText;
  offset: number;
  limit: number = Constants.recordsLimit;
  formsList: formListStructure[];
  formListKeys = Constants.formListKeys;
  refresh = Constants.refresh;
  headerInputs: HeaderInputs;
  selectiondData: any = {
    action: [{ icon: this.imageIcons.sync, action: Constants.selectAction.sync }],
    count: 0
  };
  selectedElements: Array<string>;
  selectedFormsCount: number;
  networkStatus: boolean;
  formListData: boolean;
  displayProperties = DisplayConstants.properties;
  ellipsePopoverList: Array<string> = [];
  constructor(
    private router: Router,
    private loader: LoadingService,
    private formService: FormsService,
    private commonService: CommonService,
    private searchService: SearchService,
    private downloadService: DownloadService,
    private toastService: ToastService,
    private modalService: ModalsService,
    private dataSync: DataSync
  ) { }

  ngOnInit() {
    this.formListData = false;
    this.headerInputs = {
      formId: Constants.undefined,
      taskId: Constants.undefined,
      assignmentId: Constants.undefined,
      tasks: false,
      forms: true
    }
    this.stopInfiniteScroll = false;
    this.offset = 1;
    this.selectedElements = [];
    this.selectedFormsCount = 0;
    this.formsList = [];
    this.searchEnabled = false;
    this.formListHeader = this.displayProperties.dashboardFormName;
    this.getFormsList();
    this.commonService.networkStatus.subscribe(status => {
      this.networkStatus = (<any>status);
    });
    this.networkStatus = this.commonService.getApplicationNetworkStatus();
    this.ellipsePopoverList = [
      this.displayProperties.sync,
      this.displayProperties.selectAll,
      this.displayProperties.download
    ];
  }

  doRefresh(event) {
    this.offset = 1;
    this.searchBy = Constants.nullValue;
    this.headerComponent.searchComponent.search = Constants.nullValue;
    setTimeout(() => {
      this.ngOnInit();
      event.target.complete();
    }, 500);
  }

  getFormsList() {
    const userInfo = this.commonService.getUserInfo();
    const url = ApiUrls.baseUrl + ApiUrls.getForms + '/' + this.searchBy + '/' + userInfo._id + '/' + this.limit + '/' + this.offset++ ;
    this.formService.getForms(url, this.searchBy)
      .subscribe(res => {
        this.formListData = true;
        this.formsList = this.formsList.concat(res.formsList);
        this.commonService.setPageData(this.formsList)
        if (res.infiniteScrollDisable) {
          this.disableInfiniteScroll();
        }
        // this line of code will update the sync status of the form when this page is loaded
        if (this.subscription && this.subscription != undefined) {
          this.subscription.unsubscribe();
        }
        this.syncStatusOnInterval()

      }, error => {
        this.formListData = true;
        this.commonService.showErrorResponseAlert(error.status, error.message);
        this.disableInfiniteScroll();
      });
  }

  formsListSearchEvent(event) {
    this.offset = 1;
    this.formsList = [];
    this.searchBy = event.pattern;
    this.getFormsList();

  }
  executSelectedEvent(event: string) {
    if (event === 'clear') {
      this.clearAction();
    }
  }

  clearAction() {
    this.selectiondData.count = 0;
    this.selectedFormsCount = 0;
    this.selectedElements = [];
  }

  formsSelected(formId) {
    if (this.commonService.getApplicationNetworkStatus()) {
      this.selectedElements.push(formId);
      this.selectedFormsCount = this.selectedFormsCount + 1;
      this.selectiondData.count = this.selectedFormsCount;
    }
  }

  formsDeSelected(formId) {
    if (this.commonService.getApplicationNetworkStatus()) {
      this.selectedElements.splice(this.selectedElements.indexOf(formId), 1);
      this.selectedFormsCount = this.selectedFormsCount - 1;
      this.selectiondData.count = this.selectedFormsCount;
    }
  }

  getRecords(formId, formName) {
    this.router.navigate(['dashboard/formsList/records', formName, formId]);
  }

  formInfo(formId, itemSliding: IonItemSliding) {
    this.loader.present();
    const url = ApiUrls.baseUrl + ApiUrls.getFormInfo + '/' + formId;
    this.formService.getFormInfo(url, formId)
      .subscribe(res => {
        this.loader.dismiss();
        const componentProperties = {
          info: res.formInfo,
          type: Constants.infoTypes.form
        };
        this.modalService.openPopover(InfoModalComponent, '', componentProperties, undefined, function () {
          itemSliding.close();
        });
      });
  }

  formDownload(formId, itemSliding: IonItemSliding) {
    itemSliding.close();
    this.downloadService.saveForm(formId, Constants.nullValue, Constants.nullValue, callbackRes => {
      if (callbackRes.status) {
        this.toastService.showToast(Constants.downloadComplete);
      } else {
        this.toastService.showToast(Constants.internalServerProblem);
      }
    })
  }

  loadMoreData(event) {
    if (this.searchEnabled) {
      this.searchOffset++;
      const userInfo = this.commonService.getUserInfo();
      const url = ApiUrls.searchList + '/' + this.searchBy + '/' +
        this.currentState + '/' + userInfo._id + '/' + 'undefined' + '/' + Constants.recordsLimit + '/' + this.searchOffset;
      this.searchService.getSearchedData(url)
        .subscribe(response => {
          const responseData = JSON.parse((<any>response).data).data;
          if (responseData.page >= responseData.pages) {
            this.disableInfiniteScroll();
          }
          this.formsList = this.formsList.concat(responseData.docs);
        });
    } else {
      this.getFormsList();
    }
    event.target.complete();
  }

  disableInfiniteScroll() {
    this.stopInfiniteScroll = true;
  }

  enableInfiniteScroll() {
    this.stopInfiniteScroll = false;
  }
  // below method will return form sync status 
  checkSyncStatus: any = "null";
  subscription: Subscription;

  // this method will update the status with 2.5 seconds of interval
  syncStatusOnInterval() {
    const source = interval(2500);
    this.subscription = source.subscribe(val => this.syncStatusQuery());
  }
  // once a form sync is done this method will check which is in queue and start that sync
  checkQueueSyncProcess() {
    if (this.commonService.formSyncId.length > 0) {
      for (let i = 0; i < this.commonService.formSyncId.length; i++) {
        if (i == 0) {
          this.syncFormRecords(this.commonService.formSyncId[i])
        }
      }
    }
  }
  // this method will return the sync status with percentage 
  syncStatusQuery() {
    let formData = this.formsList
    let that = this
    let count = 0;
    for (let i = 0; i < formData.length; i++) {
      let formId = formData[i]._id
      var obj = { 'assignmentId': "null", 'authorization': this.commonService.getUserInfo().token, 'isSync': '5', 'ip': ApiUrls.host, "formId": formId };
      this.dataSync.coolMethod(JSON.stringify(obj)).then(function (result) {
        if (result.status === 202) {
          count = count + 1
          that.checkSyncStatus = formId
          formData[i]['syncStatus'] = true
          formData[i]['successSync'] = result.success / result.total * 100
          formData[i]['totalSync'] = result.total
          that.formsList = formData
        } else {
          formData[i]['syncStatus'] = false
          that.formsList = formData
          if (i == formData.length - 1 && count == 0) {
            that.checkSyncStatus = "null"
            if (that.subscription && that.subscription != undefined) {
              that.subscription.unsubscribe();
              setTimeout(() => {
                that.checkQueueSyncProcess()
              }, 2500);

            }
          }
        }
      });
      that.formsList = formData
    }
  }



  // sync process
  syncFormRecords(formId: string) {
    // this will add form sync id to array
    this.commonService.addformSyncIdToArray(formId)
    if (this.checkSyncStatus == "null") {
      const obj = { 'formId': formId, 'assignmentId': "null", 'authorization': this.commonService.getUserInfo().token, 'isSync': '3', 'ip': ApiUrls.host };
      this.dataSync.coolMethod(JSON.stringify(obj)).then((result) => {
        if (result.status === 200) {
          // below code is for sync progress
          if (this.subscription && this.subscription != undefined) {
            this.subscription.unsubscribe();
          }
          this.syncStatusOnInterval()
          this.toastService.showToast(this.displayProperties.syncProcess, 2000);
        } else if (result.status === 204) {
          this.commonService.removeFormSyncId(formId)
          setTimeout(() => {
            this.checkQueueSyncProcess()
          }, 2500);
          this.toastService.showToast(this.displayProperties.noRecordFound, 2000);
        } else {
          this.toastService.showToast(this.displayProperties.internalProcessProblem);
        }
      }, (err) => {
        this.toastService.showToast(this.displayProperties.internalProcessProblem);
      });
    } else {
      this.toastService.showToast("This form added to queue for sync", 2000);
    }

  }


}
