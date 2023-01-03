import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiUrls } from '../../constants/api-urls';
import { Constants } from '../../constants/constants';
import { Router, ActivatedRoute } from '@angular/router';
import { TaskService } from '../task.service';
import { taskListStructure } from './tasks-list';
import { LoadingService } from '../../sharedServices/loading.service';
import { PopoverController, IonItemSliding } from '@ionic/angular';
import { InfoModalComponent } from '../../sharedComponents/info-modal/info-modal.component';
import { CommonService } from '../../sharedServices/commonServices/common.service';
import { ToastService } from '../../sharedServices/toast.service';
import { HeaderInputs } from 'src/app/sharedComponents/header/headerInputs';
import { FilterService } from '../../sharedServices/filter.service';
import { IonContent } from '@ionic/angular';
import { DownloadService } from '../../sharedServices/download.service';
import { ModalsService } from '../../sharedServices/modals.service';
import { HeaderComponent } from '../../sharedComponents/header/header.component';
import { DataSync } from '@awesome-cordova-plugins/data-sync/ngx';
import { DisplayConstants } from '../../constants/constants';
import { QueryProcessService } from 'src/app/offline/query-process/query-process.service';
import { interval, Subscription } from 'rxjs';


@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.page.html',
  styleUrls: ['./tasks-list.page.scss']
})
export class TasksListPage implements OnInit {

  @ViewChild(IonContent) content: IonContent;
  @ViewChild(HeaderComponent) headerComponent: HeaderComponent;

  stopInfiniteScroll: boolean;
  searchBy: string;
  searchEnabled: boolean;
  searchOffset = 1;
  hideEllipse = true;
  hideFilter = false;
  hideMap = true;
  selectedFilter;
  orderType;
  filterBy: any;
  offset: number;
  limit: number = Constants.recordsLimit;
  tasksList: taskListStructure[];
  filterParams = Constants.filterParams;
  filterElements = Constants.filter;
  imageIcons = Constants.imageIcons;
  refresh = Constants.refresh;
  initCount = 0;
  taskListData = false;
  filterObject = [
    {
      Heading: this.filterElements.recordsby,
      Elements: [this.filterElements.assigned, 'Reassigned']
    }
  ];
  ellipsePopoverList: Array<string> = Constants.taskEllipseList;
  taskListKeys = Constants.taskListKeys;
  taskStatus = Constants.status;
  selectiondData: any = {
    action: [{ icon: this.imageIcons.download, action: Constants.selectAction.download },
    { icon: this.imageIcons.sync, action: Constants.selectAction.sync }],
    count: 0
  };
  selectedTasks: Array<string>;
  selectedTaskCount: number;
  notificationId: string;
  networkStatus: boolean;
  downloadingAssignment: any;
  downloadingPercentage: any;

  headerInputs: HeaderInputs;
  displayProperties = DisplayConstants.properties;
  noDataFound = this.displayProperties.noDataFound;
  constructor(
    private router: Router,
    private taskService: TaskService,
    private loader: LoadingService,
    private route: ActivatedRoute,
    public popoverController: PopoverController,
    private commonService: CommonService,
    private toastService: ToastService,
    private filterService: FilterService,
    private downloadService: DownloadService,
    private modalService: ModalsService,
    private dataSync: DataSync,
    private queryProcessService: QueryProcessService
  ) { }

  initialiseConditions() {
    this.initCount++;
    this.selectedFilter = {
      recordsby: Constants.nullValue,
      sortby: Constants.nullValue
    };
    this.stopInfiniteScroll = false;
    this.searchBy = Constants.nullValue;
    this.orderType = Constants.nullString;
    this.offset = 1;
    this.tasksList = [];
    this.selectedTasks = [];
    this.selectedTaskCount = 0;
  }
  ngOnInit() {
    this.filterBy = Constants.nullValue;
    this.searchBy = Constants.nullValue;
    this.taskListData = false;
    this.initialiseConditions();
    this.commonService.downloadPercentageBORef.subscribe(data => {
      this.downloadingAssignment = data['assignmentId'];
      this.downloadingPercentage = data['percentage'];
      if (this.downloadingPercentage >= 100) {
        this.downloadingAssignment = '';
        this.toastService.showToast(Constants.downloadComplete);
      }
    });

    this.headerInputs = {
      formId: Constants.undefined,
      taskId: Constants.undefined,
      assignmentId: Constants.undefined,
      tasks: true,
      forms: false
    };


    if (this.route.snapshot.params.notificationId !== 'null' && this.initCount === 1) {
      this.showRecordFromNotification();
    } else {
      this.getTasksList();
    }
    this.commonService.networkStatus.subscribe(status => {
      this.networkStatus = (<any>status);
    });
    this.networkStatus = this.commonService.getApplicationNetworkStatus();
    this.headerInputs = {
      formId: Constants.undefined,
      taskId: Constants.undefined,
      assignmentId: Constants.undefined,
      tasks: true,
      forms: false,
      taskWo: false
    };
  }

  doRefresh(event) {
    this.selectedFilter = {
      recordsby: Constants.nullValue,
      sortby: Constants.nullString
    };
    this.headerComponent.searchComponent.search = Constants.nullValue;
    setTimeout(() => {
      this.ngOnInit();
      event.target.complete();
    }, 500);
  }

  // below method will return assignments
  checkSyncStatus: any = "null";
  subscription: Subscription;

  syncStatusOnInterval() {
    const source = interval(1500);
    this.subscription = source.subscribe(val => this.syncStatusQuery());

  }
  checkQueueSyncProcess() {
    if (this.commonService.syncId.length > 0) {
      for (let i = 0; i < this.commonService.syncId.length; i++) {
        if (i == 0) {
          this.synAssignment(this.commonService.syncId[i])
        }
      }
    }
  }
  syncStatusQuery() {
    let taskData = this.tasksList
    let that = this
    let count = 0;
    for (let i = 0; i < taskData.length; i++) {
      let assignmentId = taskData[i]._id
      var obj = { 'assignmentId': assignmentId, 'authorization': this.commonService.getUserInfo().token, 'isSync': '4', 'ip': ApiUrls.host, "formId": "null" };
      this.dataSync.coolMethod(JSON.stringify(obj)).then(function (result) {
        if (result.status === 202) {
          count = count + 1
          that.checkSyncStatus = assignmentId
          taskData[i]['syncStatus'] = true
          taskData[i]['successSync'] = result.success / result.total * 100
          taskData[i]['totalSync'] = result.total
          that.tasksList = taskData
        } else {
          taskData[i]['syncStatus'] = false
          that.tasksList = taskData
          if (i == taskData.length - 1 && count == 0) {
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
      that.tasksList = taskData
    }
  }

  getTasksList() {
    const userInfo = this.commonService.getUserInfo();
    const url = ApiUrls.baseUrl + ApiUrls.getTasks + '/' + this.filterBy + '/' +
      this.searchBy + '/' + userInfo._id + '/' + this.limit + '/' + this.offset++;
    this.taskService.getTasksList(url, this.searchBy, this.filterBy)
      .subscribe(res => {
        this.taskListData = true;
        this.tasksList = this.tasksList.concat(res.assignments);
        // commented for now
        // this line of code will update the sync status of the assignment
        if (this.subscription && this.subscription != undefined) {
          this.subscription.unsubscribe();
        }
        this.syncStatusOnInterval()
        if (res.infiniteScrollDisable) {
          this.disableInfiniteScroll();
        }
        this.commonService.setPageData(this.tasksList);
      }, error => {
        this.taskListData = true;
        this.commonService.showErrorResponseAlert(error.status, error.message);
      });
  }

  showRecordFromNotification() {
    const data = this.commonService.getNotificationRecord();
    this.tasksList = this.tasksList.concat(data.data.data);
    this.taskListData = true;
  }



  taskListSearchEvent(event) {
    this.enableInfiniteScroll();
    this.offset = 1;
    this.searchBy = event.pattern;
    this.tasksList = [];
    this.getTasksList();
    this.searchEnabled = event.status;

  }

  executSelectedEvent(event: string) {
    if (event === Constants.selectAction.clear) {
      this.clearAction();
    }
  }

  downloadAssignment(taskId, assignmentId, formId, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.downloadService.checkSavedRecordCount(assignmentId)
      .then(res => {
        if (res['status'] === 1) {
          if (res['data'].item(0).count) {
            this.toastService.showToast(this.displayProperties.savedRecordMsgOne);
          } else {
            this.downloadService.checkTaskDownloaded(taskId)
              .then(res => {
                if (this.commonService.getDownloadInProgress()) {
                  this.toastService.showToast(this.displayProperties.downloadInProgress);
                } else {
                  if (res['status'] === 1) {
                    this.downloadService.deleteDownloadedAWO(assignmentId).then(res => {
                      if (res['status'] === 1) {
                        this.startDownload(taskId, assignmentId, formId);
                      } else {
                        this.toastService.showToast(this.displayProperties.internalServerProblem);
                      }
                    });
                  } else if (res['status'] === 2) {
                    this.startDownload(taskId, assignmentId, formId);
                  } else {
                    this.toastService.showToast(this.displayProperties.internalServerProblem);
                  }
                }
              });
          }
        } else {
          this.toastService.showToast(this.displayProperties.internalServerProblem);
        }
      });

  }

  startDownload(taskId, assignmentId, formId) {
    this.downloadService.getAssignmentData(taskId, assignmentId).subscribe(response => {
      if (response['data'] === undefined) {
        this.toastService.showToast(this.displayProperties.internalServerProblem);
        return;
      }
      this.commonService.setDownloadInProgress(true);
      const taskData = this.prepareTaskData(response);
      this.downloadService.saveTask(taskData)
        .then(res => {
          if (res['status'] === 1) {
            const assignmentData = this.prepareAssignmentData(taskId, assignmentId, formId, response);
            this.downloadService.saveAssignment(assignmentData)
              .then(res => {
                this.commonService.setDownloadPercntag({ assignmentId: assignmentId, percentage: Constants.taskDP });
                if (res['status'] === 1) {
                  this.downloadService.saveForm(formId, taskId, assignmentId, callbackRes => {
                    if (response['data'][Constants.taskDownloadKeys.recordsCount] === undefined || response['data'][Constants.taskDownloadKeys.recordsCount] === 0) {
                      this.toastService.showToast(this.displayProperties.downloadComplete);
                      this.commonService.setDownloadInProgress(false);
                      this.commonService.setPercentage('');
                      return;
                    }
                    if (callbackRes.status === 1) {
                      this.commonService.setDownloadPercntag({ assignmentId: assignmentId, percentage: Constants.formDP });
                      const wOPercentage = Constants.remainingDP / response['data'][Constants.taskDownloadKeys.recordsCount];
                      this.downloadService.getWO(assignmentId, formId, wOPercentage);
                    } else {
                      this.downloadErrorHandle();
                    }
                  });
                } else {
                  this.downloadErrorHandle();
                }
              }, error => {
                this.downloadErrorHandle();
              });
          } else {
            this.downloadErrorHandle();
          }
        }, error => {
          this.downloadErrorHandle();
        });
    }, error => {
      this.downloadErrorHandle();
    });
  }

  downloadErrorHandle() {
    this.commonService.setDownloadInProgress(false);
    this.commonService.setPercentage('');
    this.toastService.showToast(this.displayProperties.internalServerProblem);
  }

  prepareTaskData(response) {
    const taskData = {};
    taskData[Constants.taskTable.taskId] = response['data'][Constants.taskDownloadKeys.taskInfoKey][Constants.taskDownloadKeys.taskInfo.id];
    taskData[Constants.taskTable.userId] = this.commonService.getUserInfo().username;
    taskData[Constants.taskTable.name] = response['data'][Constants.taskDownloadKeys.taskInfoKey][Constants.taskDownloadKeys.taskInfo.name];
    taskData[Constants.taskTable.status] = response['data'][Constants.taskDownloadKeys.taskAssignmentsInfoKey]
    [Constants.taskDownloadKeys.taskInfo.status];
    taskData[Constants.taskTable.createdBy] = response['data']
    [Constants.taskDownloadKeys.taskInfoKey][Constants.taskDownloadKeys.taskInfo.createdBy];
    taskData[Constants.taskTable.startDate] = response['data']
    [Constants.taskDownloadKeys.taskInfoKey][Constants.taskDownloadKeys.taskInfo.startDate];
    taskData[Constants.taskTable.endDate] = response['data']
    [Constants.taskDownloadKeys.taskInfoKey][Constants.taskDownloadKeys.taskInfo.endDate];
    return taskData;
  }

  prepareAssignmentData(taskId, assignmentId, formId, response) {
    const assignmentData = {};
    assignmentData[Constants.assignmentTable.taskId] = taskId;
    assignmentData[Constants.assignmentTable.assignmentId] = assignmentId;
    assignmentData[Constants.assignmentTable.formId] = formId;
    assignmentData[Constants.assignmentTable.userId] = this.commonService.getUserInfo().username;
    assignmentData[Constants.assignmentTable.status] = response['data']
    [Constants.taskDownloadKeys.taskAssignmentsInfoKey][Constants.taskDownloadKeys.taskInfo.status];

    assignmentData[Constants.assignmentTable.name] = response['data']
    [Constants.taskDownloadKeys.taskAssignmentsInfoKey][Constants.taskDownloadKeys.taskAssignmentsInfo.name];
    assignmentData[Constants.assignmentTable.startDate] = response['data']
    [Constants.taskDownloadKeys.taskAssignmentsInfoKey][Constants.taskDownloadKeys.taskAssignmentsInfo.startDate];
    assignmentData[Constants.assignmentTable.endDate] = response['data']
    [Constants.taskDownloadKeys.taskAssignmentsInfoKey][Constants.taskDownloadKeys.taskAssignmentsInfo.endDate];
    assignmentData[Constants.assignmentTable.createdBy] = response['data']
    [Constants.taskDownloadKeys.taskInfoKey][Constants.taskDownloadKeys.taskInfo.createdBy];
    return assignmentData;
  }

  clearAction() {
    this.selectiondData.count = 0;
    this.selectedTaskCount = 0;
    this.selectedTasks = [];
  }

  taskSelected(assignmentId) {
    if (this.commonService.getApplicationNetworkStatus()) {
      this.selectedTasks.push(assignmentId);
      this.selectedTaskCount = this.selectedTaskCount + 1;
      this.selectiondData.count = this.selectedTaskCount;
    }
  }

  taskDeSelected(assignmentId) {
    if (this.commonService.getApplicationNetworkStatus()) {
      this.selectedTasks.splice(this.selectedTasks.indexOf(assignmentId), 1);
      this.selectedTaskCount = this.selectedTaskCount - 1;
      this.selectiondData.count = this.selectedTaskCount;
    }
  }

  getRecords(task) {
    this.notificationId = Constants.nullString;
    this.commonService.setTaskDueDate(task[this.taskListKeys.dueDate]);
    this.router.navigate(['dashboard/tasksList', (task[this.taskListKeys.taskId] || Constants.nullString),
      (task[this.taskListKeys.taskName] || Constants.nullString), task[this.taskListKeys.assignmentId], (task[this.taskListKeys.assignmentName] || Constants.nullString), (task[this.taskListKeys.formId] || Constants.nullString), Constants.nullString]);
  }

  getTaskInfo(taskId, projectId, slidingItem: IonItemSliding) {
    const url = ApiUrls.baseUrl + ApiUrls.getTaskInfo + '/' + projectId + '/' + taskId;
    this.taskService.getTaskInfo(url, taskId)
      .subscribe(res => {
        this.loader.dismiss();
        const componentProperties = {
          info: res['data'],
          type: Constants.infoTypes.task
        };
        this.modalService.openPopover(InfoModalComponent, '', componentProperties, undefined, function () {
          slidingItem.close();
        });
      });
  }

  loadMoreData(event) {
    this.getTasksList();
    event.target.complete();
  }

  disableInfiniteScroll() {
    this.stopInfiniteScroll = true;
  }

  enableInfiniteScroll() {
    this.stopInfiniteScroll = false;
  }

  filterByEvent(value) {
    this.selectedFilter = value;
    this.offset = 1;
    this.filterBy = value.recordsby;
    this.tasksList = [];
    this.getTasksList();

  }

  // sycn process
  synAssignment(assignmentId: string) {
    this.commonService.addSyncIdToArray(assignmentId)
    if (this.checkSyncStatus == "null") {
      const obj = { 'assignmentId': assignmentId, 'authorization': this.commonService.getUserInfo().token, 'isSync': '2', 'ip': ApiUrls.host, "formId": "null" };

      this.dataSync.coolMethod(JSON.stringify(obj)).then((result) => {
        if (result.status === 200) {
          // below code is for sync progress
          if (this.subscription && this.subscription != undefined) {
            this.subscription.unsubscribe();
          }
          this.syncStatusOnInterval()
          this.toastService.showToast(this.displayProperties.syncProcess, 2000);
        } else if (result.status === 204) {

          this.commonService.removeSyncId(assignmentId)
          setTimeout(() => {
            this.checkQueueSyncProcess()
          }, 1500);
          this.toastService.showToast(this.displayProperties.noRecordFound, 2000);
        } else {
          this.toastService.showToast(this.displayProperties.internalProcessProblem);
        }
      }, (err) => {
        this.toastService.showToast(this.displayProperties.internalProcessProblem);
      });
    } else {
      this.toastService.showToast("This assignment added to queue for sync", 2000);
    }
  }

}
