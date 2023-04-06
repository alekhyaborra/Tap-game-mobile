import { Component, OnInit, ViewChild, NgZone, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Constants } from '../../constants/constants';
import { WorkOrdersService } from './work-orders.service';
import { PopoverController, IonContent } from '@ionic/angular';
import { InfoModalComponent } from '../../sharedComponents/info-modal/info-modal.component';
import { LoadingService } from '../../sharedServices/loading.service';
import { ApiUrls } from '../../constants/api-urls';
import { workOrdersListStructure } from './work-orders';
import { workOrderInfoStructure } from './work-orders-info';
import { CommonService } from '../../sharedServices/commonServices/common.service'
import { HeaderInputs } from 'src/app/sharedComponents/header/headerInputs';
import { ToastService } from '../../sharedServices/toast.service';
import { FilterService } from '../../sharedServices/filter.service';
import { ModalsService } from '../../sharedServices/modals.service';
import { forkJoin, BehaviorSubject } from 'rxjs';
import { QueryProcessService } from '../../offline/query-process/query-process.service';
import { AlertController, IonItemSliding } from '@ionic/angular';
import { HeaderComponent } from '../../sharedComponents/header/header.component';
import { DisplayConstants } from '../../constants/constants';
import { AlertService } from '../../sharedServices/alert.service';
import { Diagnostic } from '@awesome-cordova-plugins/diagnostic/ngx';
import { DataSync } from '@awesome-cordova-plugins/data-sync/ngx';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-records-list',
  templateUrl: './work-orders.page.html',
  styleUrls: ['./work-orders.page.scss'],
  providers: [ModalsService]
})
export class WorkOrdersPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  @ViewChild(HeaderComponent) headerComponent: HeaderComponent;
  imageIcons = Constants.imageIcons;
  stopInfiniteScroll: boolean;
  searchEnabled: boolean;
  taskId: string;
  formId: string;
  taskName: string;
  notificationId: string;
  hideFilter: boolean = false;
  hideMap: boolean = false;
  hideEllipse: boolean = false;
  showSyncButton: boolean = false;
  displayField: any = {};
  plusPlacement: string;
  assignmentId: string;
  selectedgroup = Constants.nullValue;
  workOrderHeader: string;
  loaderText = Constants.infiniteScrollText;
  orderType;
  savedWOWithoutStatus: any;
  offset: number;
  initCount: number = 0;
  sqLiteData: any;
  limit: number = Constants.recordsLimit;
  filterElements = Constants.filter;
  filterParams = Constants.filterParams;
  filterObject;
  groupbyKey: string = Constants.nullValue;
  selectedFilter = {
    recordsby: Constants.nullValue,
    sortby: Constants.nullString
  };

  workOrders: workOrdersListStructure[];
  preRecord: any = []
  saveRecord: any = []
  workOrdersCopy: workOrdersListStructure[];
  workOrderListKeys = Constants.workOrderListKeys;
  recordStatus = Constants.status;
  statusName = Constants.statusName;
  refresh = Constants.refresh;
  woDataLoaded: boolean
  searchBy: any = Constants.nullValue;
  filterBy: any = Constants.nullValue;
  selectiondData: any = {
    action: [
      {
        icon: this.imageIcons.download,
        action: Constants.selectAction.download
      },
      { icon: this.imageIcons.sync, action: Constants.selectAction.sync }
    ],
    count: 0
  };
  selectedWorkOrders: Array<any> = [];
  selectedWorkOrdersForSync: Array<any> = [];
  selectedObj: any = {};
  selectedWorkOrderCount: number;
  headerInputs: HeaderInputs;
  savedWOIds: Array<string>;
  networkStatus: boolean;
  displayProperties = DisplayConstants.properties;
  ellipsePopoverList: Array<string> = [];
  isPrepopAttached: string = 'false';
  isDate: boolean = false;
  public syncCount = new BehaviorSubject<number>(null);
  searchResultISO: any = null;
  searchResultIND: any = null;
  displayForEVForm = [];
  fromDate: any;
  toDate: any;
  date: number;
  fromRecord:boolean;
  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private woservice: WorkOrdersService,
    public popoverController: PopoverController,
    private loader: LoadingService,
    private commonService: CommonService,
    private filterService: FilterService,
    private toastService: ToastService,
    private modalService: ModalsService,
    private queryProcessService: QueryProcessService,
    private alertController: AlertController,
    private dataSync: DataSync,
    private ngZone: NgZone,
    private datePipe: DatePipe,
    private diagnosticService: Diagnostic,
    private alertService: AlertService
  ) {
  }
  callMoreData() {
    if (this.workOrders.length < Constants.recordsLimit && !this.stopInfiniteScroll) {
      this.moreRecords();
    }
  }
  callingFunction() {
    this.offset = 1;

    this.workOrders = []
    this.workOrdersCopy = []
    if ((this.route.snapshot.params.notificationId != "null" && this.route.snapshot.params.notificationId != undefined) && this.initCount == 1) {
      this.showRecordFromNotification();
    } else {
      if (this.filterBy == Constants.nullValue && this.date == Constants.nullValue) {
        this.woWithoutFilterCall()
      } else {
        this.woWithFilterCall()
      }

    }
  }
  ngOnInit() {
    this.fromRecord = true
    this.showSyncButton = false;
    this.route.paramMap.subscribe(params => {
      this.taskId = params.get('taskId');
      this.assignmentId = params.get('assignmentId');
    })
    this.commonService.setTaskId(this.taskId)
    this.commonService.showGpsEnableAlert(DisplayConstants.properties.turnOngpsMessage)

    this.ellipsePopoverList = [this.displayProperties.historyLabel];
    //this.commonService.setMapType(Constants.mapTypes.mapBox);
    this.woDataLoaded = false
    // this.loader.present();
    //remove slected work orders to shwo on map if any 
    this.initCount++;
    this.commonService.makeDefaultSelectedObjectToShowOnMap();
    this.commonService.setSelectedWorkordersCount(0);

    this.workOrders = [];
    this.searchEnabled = false;
    this.stopInfiniteScroll = false;
    this.orderType = Constants.nullString;
    this.offset = 1;
    this.workOrdersCopy = [];
    this.selectedWorkOrders = [];
    this.selectedWorkOrderCount = 0;
    this.savedWOIds = [];
    this.commonService.formSaveSuccess("");
    this.commonService.currentMessage.subscribe(message => {
      if (message != null) {
        let index = -1;
        let savedDataIndex = -1;
        try {
          index = this.workOrders.findIndex(record => record[this.workOrderListKeys.recordId] == message);
        } catch (error) {

        }
        try {
          savedDataIndex = this.workOrders.findIndex(record => record[this.workOrderListKeys.offlineId] == message)
        } catch (error) {
        }

        if (index > -1)
          this.workOrders.splice(index, 1);
        else if (savedDataIndex > -1) {
          this.workOrders.splice(savedDataIndex, 1);
        }
      }
    });
    this.commonService.networkStatus.subscribe(status => {
      this.networkStatus = (<any>status);
    })
    this.networkStatus = this.commonService.getApplicationNetworkStatus();
    //this for changing WO status after saving it.
    this.commonService.wOSubject.subscribe(data => {
      setTimeout(() => {
      this.ngZone.run(()=> {
      if (data != "") {
        let index = -1;
        let savedDataIndex = -1;
        try {
          index = this.workOrders.findIndex(record => record[this.workOrderListKeys.recordId] === data[this.workOrderListKeys.recordId] && record[this.workOrderListKeys.recordId] != undefined);
        } catch (error) {
        }
        try {
          savedDataIndex = this.workOrders.findIndex(record => record[this.workOrderListKeys.offlineId] == data['insertId'])
        } catch (error) {
        }
        try {
          if (index > -1) {
              this.workOrders[index][Constants.workOrderListKeys.status] = Constants.status.saved;
              this.workOrders[index][Constants.workOrderListKeys.isValid] = data['isValid'];
              this.workOrders[index][Constants.workOrderListKeys.offlineId] = data['insertId'];
              this.workOrders[index][this.displayField] = data['insertData'] ? data['insertData'][this.displayField] : data['displayValue'];
              this.commonService.updateWODataOfflineId(data['insertId']);
          } else if (savedDataIndex > -1) {
              this.workOrders[savedDataIndex][this.displayField] = data['displayValue']
              this.commonService.updateWODataOfflineId(data['insertId']);
          } else {
              this.workOrders.push(data['insertData']);
              this.displayField = data['displayFields'];

          }
        }
        catch (e) {
        }
      }
    })
  }, 500);
    });

    this.loadWorkOrders();
    if(this.taskId){
      this.getIsPrePop();
      this.frequencyCheck();
    }
    this.syncCount.subscribe((recordSyncCount) => {
      setTimeout(() => {
      this.ngZone.run(() =>{
      if (recordSyncCount == 0  ) {
          
          this.doRefresh('refresh');
          this.clearAction();
           
      }
    })
  }, 500);
    })
    // this.woWithoutFilterCall();
  }

  //  ionViewDidEnter(){
  //   this.doRefresh('refresh');
  //  }

 ionViewDidLeave(){
  this.clearAction();
  // this.frequencyCheck();
}

  getIsPrePop(){
    this.ngZone.run(()=> {
      let url = ApiUrls.baseUrl + '/mobileservices/isPrepopAttached/'+this.taskId;
      this.woservice.getIsPrePop(url, this.taskId).subscribe((res) => {
          this.isPrepopAttached = res['data']['isPrepopAttached'].toString();
      }, err => { });
    });
  }

  frequencyCheck(){
    this.ngZone.run(()=> {
      let url = ApiUrls.baseUrl + '/mobileservices/frequencyCheck/' + this.assignmentId + '/' + this.commonService.getUserInfo()._id;
      // console.log(url);
      this.woservice.frequencyCheck(url).subscribe((res) => {
        if(res.data.status == 208){
          this.isPrepopAttached = 'true'
        }
      }, err => { });
    });
  }

  ionViewWillEnter() { 
    this.route.paramMap.subscribe(params => {
      this.assignmentId = params.get('assignmentId');
      // console.log("willEnter",this.assignmentId);
    })
    let url = ApiUrls.baseUrl + '/mobileservices/frequencyCheck/' + this.assignmentId + '/' + this.commonService.getUserInfo()._id;
      // console.log(url);
      this.woservice.frequencyCheck(url).subscribe((res) => {
        // console.log(res);
        if(this.loader.isLoading){
          if(this.loader.isLoading){ this.loader.dismiss(); }
          }
        if(res.data.status == 208){
          this.isPrepopAttached = 'true';
        }
        else {
        }
      }, err => { 
        if(this.loader.isLoading){
          if(this.loader.isLoading){ this.loader.dismiss(); }
          }
      });
      // 
      //  
  }



  loadWorkOrders() {
    setTimeout(() => {
    this.ngZone.run(()=>{
    this.route.paramMap.subscribe(params => {
      this.formId = params.get('formId');
      this.taskId = params.get('taskId');
      this.taskName = params.get('taskName');

      this.notificationId = params.get('id');

      this.assignmentId = params.get('assignmentId');
      this.commonService.setFormId(this.formId);
      if (this.router.url.includes("formsList")) {
        this.plusPlacement = "center";
        this.hideFilter = true;
        this.hideMap = true;
        this.workOrderHeader = params.get('formName');
      }
      else if (this.router.url.includes("tasksList")) {
        this.plusPlacement = "center";
        this.filterObject = [
          {
            Heading: this.filterElements.recordsby,
            Elements: [this.filterElements.new, this.filterElements.saved, "Reassigned"]
          }
        ]
        this.workOrderHeader = params.get('assignmentName');
      }

      // if (this.router.url.includes("formsList")) {
      //   this.getSavedWO()
      //     .subscribe(res => {
      //       this.woDataLoaded = true
      //       this.workOrders = this.workOrders.concat(res.wO);
      //       this.displayField = res.displayFields;
      //       if (!res.wO.length)
      //       this.disableInfiniteScroll();
      //       this.commonService.setPageData(this.workOrders);
      //     })
      // }
      // else {
      //   this.callingFunction()
      // }
      // if (this.router.url.includes('formsList')) {
      //   this.displayField = res.displayFields;
      // }
      this.callingFunction();

    });
  })
}, 500);
    this.headerInputs = {
      formId: (this.formId || Constants.undefined),
      taskId: (this.taskId || Constants.undefined),
      assignmentId: (this.assignmentId || Constants.undefined),
      tasks: false,
      forms: false
    }
  }

  woWithFilterCall() {
    setTimeout(() => {
    this.ngZone.run(()=>{
    this.workOrders = [] 
    this.workOrdersCopy = []
    forkJoin([this.getWorkorderList(), this.getSavedWO()]).subscribe((results: any) => {
      this.sqLiteData = results[1]
      this.woDataLoaded = true
      this.displayField = results[0].displayFields;
      if (results[0].wO.length > 0 && results[1].wO.length == 0) {
        this.workOrders = this.workOrders.concat(results[0].wO);
        this.workOrdersCopy = JSON.parse(JSON.stringify(this.workOrders));
        this.commonService.setPageData(this.workOrders);
        if (results[0].infiniteScrollDisable) {
          this.disableInfiniteScroll();
        }
      }
      else if (results[0].wO.length == 0 && results[1].wO.length > 0) {
        this.displayField = results[1].displayFields;
        if (this.filterBy == Constants.filter.reassigned || this.filterBy == Constants.filter.new) {
        } else {
          this.workOrders = this.workOrders.concat(results[1].wO);
          this.commonService.setPageData(this.workOrders);
        }
      }
      else if (results[0].wO.length > 0 && results[1].wO.length > 0) {
        const thisRef = this;
        thisRef.workOrders = this.workOrders.concat(results[0].wO);
        thisRef.workOrdersCopy = JSON.parse(JSON.stringify(thisRef.workOrders));
        if (thisRef.filterBy == Constants.filter.reassigned) {
          results[1].wO.forEach(function (wO) {

            const index = thisRef.workOrders.findIndex(record => record._id === wO.recordId);

            if (index > -1) {
              thisRef.workOrders.splice(index, 1);
            }
          })
        } else {

          results[1].wO.forEach(function (wO) {
            const index = thisRef.workOrders.findIndex(record => record._id === wO.recordId);
            thisRef.savedWOIds.push(wO.recordId);
             const formValues = JSON.parse(wO['formValues']);
              thisRef.workOrders[index][Constants.workOrderListKeys.formValues] = formValues; 
            if (index > -1) {
              thisRef.workOrders.splice(index, 1);
            }
            else {
              if (thisRef.filterBy == Constants.statusName[0]) {
               // console.log("new records so ignored concat")  
              } else {
                thisRef.workOrders = thisRef.workOrders.concat(wO);
              }
            }
          })
          if (thisRef.workOrders.length < Constants.recordsLimit) {
            this.moreRecords()
          }

        }
        this.commonService.setPageData(this.workOrders);
      }
      this.route.paramMap.subscribe(params => {
        this.notificationId = params.get('notificationId');
        if (this.notificationId != Constants.nullString) {
          const index = this.workOrders.findIndex(x => x[this.workOrderListKeys.recordId] == this.notificationId)
          this.content.scrollToPoint(0, index * 80, 1500);
        }

      })
    }, error => {
      this.woDataLoaded = true
    });
  })
   }, 500);
  }

  woWithoutFilterCall() {
    setTimeout(() => {
    this.ngZone.run(()=>{
     this.workOrders = []
     this.workOrdersCopy = []
    forkJoin([this.getWorkorderList(), this.getSavedWO()]).subscribe((results: any) => {
      
      console.log(results)
      this.woDataLoaded = true;
      this.displayField = results[0].displayFields;
      if (results[0].wO.length > 0 && results[1].wO.length == 0) {
        this.workOrders = []
        this.preRecord = results[0].wO
          this.workOrders = this.workOrders.concat(results[0].wO);
          this.workOrders = this.workOrders.concat(this.saveRecord);
          console.log(this.workOrders)
          this.workOrdersCopy = JSON.parse(JSON.stringify(this.workOrders));
        this.commonService.setPageData(this.workOrders);
        if (results[0].infiniteScrollDisable) {
          this.disableInfiniteScroll();
        } else {
          this.enableInfiniteScroll();
        }


      } else if (results[0].wO.length === 0 && results[1].wO.length > 0) {
        this.ngZone.run(()=> {
        this.displayField = results[1].displayFields;
        this.saveRecord = results[1].wO
        this.workOrders = []
          this.workOrders = this.workOrders.concat(this.preRecord);
          
          this.workOrders = this.workOrders.concat(results[1].wO);

        console.log(this.workOrders)
        console.log(results[1].wO)
        this.commonService.setPageData(this.workOrders);
        })
      } else if (results[0].wO.length > 0 && results[1].wO.length > 0) {
        this.displayField = results[1].displayFields;
          const thisRef = this;
          thisRef.preRecord = results[0].wO
          thisRef.workOrders = this.workOrders.concat(results[0].wO);
          thisRef.workOrdersCopy = JSON.parse(JSON.stringify(thisRef.workOrders));
          results[1].wO.forEach(function (wO) {
            const index = thisRef.workOrders.findIndex(record => record._id === wO.recordId);
            thisRef.savedWOIds.push(wO.recordId);
            if (index > -1) {
              const formValues = JSON.parse(wO['formValues']);
              thisRef.workOrders[index][Constants.workOrderListKeys.status] = Constants.status.saved;
              thisRef.workOrders[index][thisRef.displayField] = formValues[thisRef.displayField];
              thisRef.workOrders[index][Constants.workOrderListKeys.offlineId] = wO[Constants.saveWO.autoIncId];
              thisRef.workOrders[index][Constants.workOrderListKeys.isValid] = wO[Constants.saveWO.isValid];
            }
            else {
              thisRef.workOrders = thisRef.workOrders.concat(wO);
            }
          })
          this.commonService.setPageData(this.workOrders);
      }
      this.route.paramMap.subscribe(params => {
        this.notificationId = params.get('notificationId');
        if (this.notificationId != Constants.nullString) {
          const index = this.workOrders.findIndex(x => x[this.workOrderListKeys.recordId] == this.notificationId)
          this.content.scrollToPoint(0, index * 80, 1500);
        }
        // this.doRefresh(Event);
      })
    }, error => {
      if (this.loader.isLoading) {
        if (this.loader.isLoading) { 
          this.loader.dismiss(); 
        };
      }
      this.woDataLoaded = true
    });
 
})
}, 500);
  }

  doRefresh(event) {

    this.selectedFilter = {
      recordsby: Constants.nullValue,
      sortby: Constants.nullString
    };
    this.searchBy = Constants.nullValue
    this.filterBy = Constants.nullValue
    this.headerComponent.searchComponent.search = Constants.nullValue;
    setTimeout(() => {
      this.workOrders = [];
      this.loadWorkOrders();
       if(event.target){
      event.target.complete();
     }
    }, 500);
  }

  getWorkorderList(): any {
    const url = ApiUrls.getWorkOrders + "/" + this.commonService.getUserInfo()._id + "/" + (this.assignmentId || Constants.nullValue) + "/" + (this.formId || Constants.nullValue) + "/" + (this.searchBy || Constants.nullValue) + "/" + (this.filterBy || Constants.nullValue) + "/" + this.limit + "/" + this.offset  + "/" + (this.fromDate || Constants.nullValue) + "/"  + (this.toDate || Constants.nullValue);
    return this.woservice.getWorkOrders(url, this.taskId || Constants.nullValue, this.formId || Constants.nullValue, this.assignmentId || Constants.nullValue, this.offset++, this.searchBy, this.filterBy,this.date,this.fromDate,this.toDate);
  }

  getSavedWO(): any {
    return this.woservice.getSaveWO(this.taskId || Constants.nullValue, this.formId || Constants.nullValue, this.assignmentId || Constants.nullValue, this.searchBy || Constants.nullValue, this.filterBy || Constants.nullValue)
  }

  getSavedWOWithoutStatus(): any {
    return this.woservice.getSaveWO(this.taskId || Constants.nullValue, this.formId || Constants.nullValue, this.assignmentId || Constants.nullValue, Constants.nullValue, this.filterBy || Constants.nullValue)
  }

  showRecordFromNotification() {
    this.woDataLoaded = true
    const data = this.commonService.getNotificationRecord();
    this.workOrders = this.workOrders.concat(data.data.data);
    this.displayField = data.data.displayField;
    // this.loader.dismiss();
  }

  executSelectedEvent(event: string) {
    if (event == 'download') {
      this.download();
    } else if (event == 'clear') {
      this.clearAction();
    } else {
      this.sync()
    }
  }
  download() {

  }
  sync() {

  }
  clearAction() {
    this.showSyncButton = false;
    this.selectiondData.count = 0;
    this.selectedWorkOrderCount = 0;
    this.selectedWorkOrders = [];
    this.selectedWorkOrdersForSync = [];
    this.commonService.setSelectedWorkordersCount(0);
    this.commonService.setSelectedObjectToShowFromMap({ "new": [], "re-assign": [], "saved": [] })
  }

  workOrderSelected(record) {
    if (this.commonService.getApplicationNetworkStatus()) {
      this.commonService.setSelectedObjectToShowOnMap(record, this.displayField, this.workOrderListKeys);
      this.showSyncButton = true;
      if (record[this.workOrderListKeys.recordId]) {
        this.selectedWorkOrders.push(record[this.workOrderListKeys.recordId]);
      } else {
        this.selectedWorkOrders.push(record[this.workOrderListKeys.offlineId]);
      }

      if (record[this.workOrderListKeys.offlineId]) {
        this.selectedWorkOrdersForSync.push({ id: record[this.workOrderListKeys.offlineId], isValid: record[this.workOrderListKeys.isValid] });
      }

      this.selectedWorkOrderCount = this.selectedWorkOrderCount + 1;
      this.selectiondData.count = this.selectedWorkOrderCount;
      this.commonService.setSelectedWorkordersCount(this.selectiondData.count);
    }
    else {
      this.toastService.showToast('Please enable network! ', 2000);
    }

  }

  workOrderDeSelected(record) {
    let index;
    if (this.commonService.getApplicationNetworkStatus()) {
      this.commonService.setSelectedObjectToShowOnMap(record, this.displayField, this.workOrderListKeys);
      if (record[this.workOrderListKeys.recordId]) {
        this.selectedWorkOrders.splice(this.selectedWorkOrders.indexOf(record[this.workOrderListKeys.recordId]), 1);
      } else {
        this.selectedWorkOrders.splice(this.selectedWorkOrders.indexOf(record[this.workOrderListKeys.offlineId]), 1);
      }
      if (record[this.workOrderListKeys.offlineId]) {
        index = this.selectedWorkOrdersForSync.findIndex(x => x.id === record[this.workOrderListKeys.offlineId]);
        this.selectedWorkOrdersForSync.splice(index, 1);
      }
      // else if(record[this.workOrderListKeys.recordId]){
      //   index = this.selectedWorkOrdersForSync.findIndex(x => x.id === record[this.workOrderListKeys.recordId]);
      //   this.selectedWorkOrdersForSync.splice(index, 1);
      // }
      this.selectedWorkOrderCount = this.selectedWorkOrderCount - 1;
      this.commonService.setSelectedWorkordersCount(this.selectedWorkOrderCount);
      this.selectiondData.count = this.selectedWorkOrderCount;
      if (this.selectedWorkOrders.length == 0) {
        this.showSyncButton = false;
      }
    }
  }


  formsSelected(record) {
    if (this.commonService.getApplicationNetworkStatus()) {
      // this.commonService.setSelectedObjectToShowOnMap(record, this.displayField, this.workOrderListKeys);

      if (record[this.workOrderListKeys.offlineId]) {
        this.showSyncButton = true;
        this.selectedWorkOrdersForSync.push({ id: record[this.workOrderListKeys.offlineId], isValid: record[this.workOrderListKeys.isValid] });
      }
       else if(record[this.workOrderListKeys.recordId]){
           this.selectedWorkOrdersForSync.push({id: record[this.workOrderListKeys.recordId], isValid: record[this.workOrderListKeys.isValid]});
       }
      if (record[this.workOrderListKeys.recordId]) {
        this.selectedWorkOrders.push(record[this.workOrderListKeys.recordId]);
      } else {
        this.selectedWorkOrders.push(record[this.workOrderListKeys.offlineId]);
      }
      this.selectedWorkOrderCount = this.selectedWorkOrderCount + 1;
      this.selectiondData.count = this.selectedWorkOrderCount;
      this.commonService.setSelectedWorkordersCount(this.selectiondData.count);
    }
    else {
      this.toastService.showToast('Please enable network! ', 2000);
    }
    // 
    // 

  }

  formsDeSelected(record) {
    let index;
    if (this.commonService.getApplicationNetworkStatus()) {
      // this.commonService.setSelectedObjectToShowOnMap(record, this.displayField, this.workOrderListKeys);
      if (record[this.workOrderListKeys.recordId]) {
        this.selectedWorkOrders.splice(this.selectedWorkOrders.indexOf(record[this.workOrderListKeys.recordId]), 1);
      } else {
        this.selectedWorkOrders.splice(this.selectedWorkOrders.indexOf(record[this.workOrderListKeys.offlineId]), 1);
      }
      if (record[this.workOrderListKeys.offlineId]) {
        index = this.selectedWorkOrdersForSync.findIndex(x => x.id === record[this.workOrderListKeys.offlineId]);
        this.selectedWorkOrdersForSync.splice(index, 1);
      }
      // else if(record[this.workOrderListKeys.recordId]){
      //   index = this.selectedWorkOrdersForSync.findIndex(x => x.id === record[this.workOrderListKeys.recordId]);
      //   this.selectedWorkOrdersForSync.splice(index, 1);
      // }
      this.selectedWorkOrderCount = this.selectedWorkOrderCount - 1;
      this.commonService.setSelectedWorkordersCount(this.selectedWorkOrderCount);
      this.selectiondData.count = this.selectedWorkOrderCount;
      if (this.selectedWorkOrders.length == 0) {
        this.showSyncButton = false;
      }
    }
  }

  openNewForm() {
    if (this.router.url.includes('formsList')) {
      // tslint:disable-next-line:max-line-length
      this.commonService.setWOData({ recordStatus: Constants.nullValue, id: Constants.nullValue, dueDate: Constants.nullValue, taskName: Constants.nullValue });
      this.router.navigate(['/dashboard/formsList/records/formFiller', this.formId, Constants.nullString]);
    } else if (this.router.url.includes('tasksList')) {
      // tslint:disable-next-line:max-line-length
      this.commonService.setWOData({ recordStatus: Constants.nullValue, id: Constants.nullValue, dueDate: Constants.nullValue, taskName: this.route.snapshot.params.taskName });
      // tslint:disable-next-line:max-line-length
      this.router.navigate(['/dashboard/tasksList', this.taskId, this.route.snapshot.params.taskName, this.route.snapshot.params.assignmentId, Constants.nullString, this.route.snapshot.params.formId]);
    }
  }

  openForm(record) {
    // tslint:disable-next-line:max-line-length
    this.commonService.setWOData({ recordStatus: record[Constants.workOrderListKeys.status], id: record[Constants.workOrderListKeys.offlineId], dueDate: record[Constants.workOrderListKeys.dueDate], taskName: record[Constants.workOrderListKeys.taskName] });
    if (this.router.url.includes('formsList')) {
      this.router.navigate(['/dashboard/formsList/records/formFiller', this.route.snapshot.params.formId,
        (record[Constants.workOrderListKeys.recordId] || Constants.nullString)]);
    } else if (this.router.url.includes('tasksList')) {

      this.router.navigate(['/dashboard/tasksList', this.route.snapshot.params.taskId, this.route.snapshot.params.taskName, this.route.snapshot.params.assignmentId, (record[Constants.workOrderListKeys.recordId] || Constants.nullString), record[Constants.workOrderListKeys.formId]]);
    }
  }

  showInfo(recordId, formId, slidingItem: IonItemSliding, status) {
    this.loader.present();
    const that = this;
    const url = ApiUrls.getWorkOrderInfo + "/" + formId + "/" + recordId;
    this.woservice.getInfo(url, formId, status).subscribe(info => {

      info['status'] = status;
      info[Constants.recordInfoKeys.formName] = info.data.formName;
      info[Constants.recordInfoKeys.comments] = info.data.comments;
      info['formNameVisable'] = true;
      const componentProperties = {
        info: info,
        type: Constants.infoTypes.wo
      }
      that.loader.dismiss();
      that.modalService.openPopover(InfoModalComponent, "", componentProperties, undefined, function (data) {
        slidingItem.close();
      })
    })
  }
  showInform(slidingItem: IonItemSliding, status) {
    this.loader.present();
    const that = this;
    let info = {};
    info['status'] = status;
    info['formNameVisable'] = false;
    const componentProperties = {
      info: info,
      type: Constants.infoTypes.wo
    }
    that.loader.dismiss();
    that.modalService.openPopover(InfoModalComponent, "", componentProperties, undefined, function (data) {
      slidingItem.close();
    })

  }
  filterByEvent(value) {
    this.selectedFilter = value;
    if(value.fromDate && value.toDate){
      this.date = 1
      this.fromDate = value.fromDate
      this.toDate = value.toDate
      this.filterBy = value.recordsby
      
    }else{
      this.fromDate = null
      this.toDate = null
      this.date = null
      this.filterBy = value.recordsby
    }
   
    this.workOrders = [];
    this.callingFunction()
  }

  moreRecords(event?) {
    this.ngZone.run(()=>{
      setTimeout(() => {
        // this.workOrders = []
        // this.workOrdersCopy = []
        debugger
    this.getWorkorderList().subscribe(
      res => {
        if (event) {
          event.target.complete();
        }
        if (res.wO.length > 0) {
          if (this.networkStatus) {
            if (this.filterBy != Constants.nullValue) {
              this.sqLiteData.wO.forEach(function (wO) {
                const index = res.wO.findIndex(record => record._id === wO.recordId);
                if (index > -1) {
                  res.wO.splice(index, 1);
                }
              })
            }
            this.workOrdersCopy = this.workOrdersCopy.concat(JSON.parse(JSON.stringify(res.wO)));
            res.wO.forEach(wO => {
              const index = this.workOrders.findIndex(record => record['recordId'] === wO[Constants.workOrderListKeys.recordId]);
              if (index == -1) {
                this.workOrders = this.workOrders.concat(wO);
              }
            });
          } else {
            this.workOrders = this.workOrders.concat(res.wO);
            this.commonService.setPageData(this.workOrders);
          }

        } else {
          this.disableInfiniteScroll()
        }

      },
      err => {

      });
    }, 500);
  })
  }

  // loadMoreData(event) {
  //   this.moreRecords(event);

  // }

  disableInfiniteScroll() {
    this.stopInfiniteScroll = true;
  }

  enableInfiniteScroll() {
    this.stopInfiniteScroll = false;
  }

  searchEventWo(event) {
    this.searchBy = event.pattern;
    this.searchEnabled = event.status;
    this.callingFunction();
  }

  async deleteWorkOrder(id, recordId, slidingItem: IonItemSliding) {
    const index = this.workOrders.findIndex(x => x[Constants.workOrderListKeys.offlineId] == id);
    let message = this.displayProperties.wODeleteConfirmation;
    if (this.workOrders[index][Constants.workOrderListKeys.recordId]) {
      message = this.displayProperties.wODeleteConfirmationPrepop;
    }
    const alert = await this.alertController.create({
      message: message,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Yes',
          handler: () => {
            alert.dismiss();
            this.deleteWO(id, recordId, slidingItem);
          }
        }
      ]
    });
    await alert.present();
  }

  deleteWO(id, recordId, slidingItem: IonItemSliding) {

    slidingItem.close();
    this.queryProcessService.deleteWorkorder(id)
      .then((res) => {
        const index = this.workOrders.findIndex(x => x[Constants.workOrderListKeys.offlineId] == id);
        if (this.workOrders[index][Constants.workOrderListKeys.recordId]) {
          const wOIndex = this.workOrdersCopy.findIndex(x => x[Constants.workOrderListKeys.recordId] == recordId);
          this.workOrders[index][this.displayField] = this.workOrdersCopy[wOIndex][this.displayField]
          this.workOrders[index][Constants.workOrderListKeys.status] = Constants.status.new;
        } else {
          // slidingItem.close();
          this.workOrders.splice(index, 1);
        }
        this.toastService.showToast(this.displayProperties.wODeleted);
      })
      .catch(e => {
        this.toastService.showToast(this.displayProperties.internalServerProblem);
      });
  }

  // select and sync records

  // sycn process
  synAssignment(event) {
    setTimeout(() => {
    this.ngZone.run(()=>{
    let successCallback = (isAvailable) => {
      if (!isAvailable) {
        this.alertService.presentAlert(Constants.unableToGetLocation);
      }
      else {
        let that = this;
        let count: number = null;
        that.syncCount.next(count);
        let displayName = '';
        count = that.selectedWorkOrdersForSync.length;
        that.syncCount.next(count);
        for (let i = 0; i < that.workOrders.length; i++) {
          if (that.selectedWorkOrdersForSync.length > 0) {
            for (let j = 0; j < that.selectedWorkOrdersForSync.length; j++) {
              if (that.workOrders[i].id == that.selectedWorkOrdersForSync[j].id) {
                if (that.selectedWorkOrdersForSync[j].isValid) {
                  const obj = {
                    'recordId': that.workOrders[i]['recordId'], 'offlineId': that.workOrders[i].id, 'assignmentId': that.workOrders[i].assignmentId,
                    'authorization': that.commonService.getUserInfo().token, 'isSync': '1', 'ip': ApiUrls.host + '/'
                  };
                  this.dataSync.coolMethod(JSON.stringify(obj)).then(function (result) {
                    count = --count;
                    that.syncCount.next(count);
                  //  if (count == 0) {
                   //   that.doRefresh('refresh');
                  //  }
                      that.workOrderDeSelected(that.workOrders[i]);
                    });
                }
                else if (!that.selectedWorkOrdersForSync[j].isValid) {
                  displayName = this.ifNotValid(i, j, displayName);
                  count = --count;
                  that.syncCount.next(count);

                  this.toastService.showToast("Please fill all mandatory fields for " + displayName + " and try again", 5000);
                  that.workOrderDeSelected(this.workOrders[i]);
                }

              }
              else {
              }
            }
          }
          // else {
          //   this.toastService.showToast("Please fill the form, save and try again", 5000);
          //   this.workOrderDeSelected(this.workOrders[i]);
          //   // this.clearAction();
          // }

        }
      }
    }
    let errorCallback = (e) => console.error(e);
    this.diagnosticService.isLocationEnabled().then(successCallback).catch(errorCallback);
  })
}, 500);
  }

  ifNotValid(i, j, displayName) {
    if (this.workOrders[i].displayValue == '' || this.workOrders[i].displayValue == undefined) {
      this.ngZone.run(()=>{
      let display = 'empty display fields';
      let check = displayName.match(display);
      if (this.selectedWorkOrdersForSync.length - 1 == j) {
        if (check && check[0] == display) {
        } else {
          displayName = displayName.concat(display) + " ";
        }
      }
      else {
        if (check && check[0] == display) {
        } else {
          displayName = displayName.concat(display) + ", ";
        }
      }
    })
    }
    else {
      if (this.isDate) {
        let latest_date = this.datePipe.transform(this.workOrders[i].displayValue, 'dd-MM-yyyy');
        if (this.selectedWorkOrdersForSync.length - 1 == j) {
          this.ngZone.run(()=>{
          displayName = displayName.concat(latest_date) + " ";
          })
        }
        else {
          displayName = displayName.concat(latest_date) + ", ";
        }
      }
      else {
        if (this.selectedWorkOrdersForSync.length - 1 == j) {
          this.ngZone.run(()=>{
          displayName = displayName.concat(this.workOrders[i].displayValue) + " ";
          })
        }
        else {
          displayName = displayName.concat(this.workOrders[i].displayValue) + ", ";
        }
      }

    }
    return displayName;
  }

}
