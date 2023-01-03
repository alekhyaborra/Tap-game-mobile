import { Component, OnInit } from '@angular/core';
import { ApiUrls } from '../constants/api-urls';
import { Constants, DisplayConstants } from '../constants/constants';
import { NotificationService } from './notification.service';
import { LoadingService } from '../sharedServices/loading.service';
import { Router } from '@angular/router';
import { Notifications } from './notifications'
import { CommonService } from '../sharedServices/commonServices/common.service';
import { ToastService } from '../sharedServices/toast.service';
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  providers:[]
})
export class NotificationsPage implements OnInit {

  nullValue = Constants.nullValue;
  notificationsHeader: string = Constants.notificationsHeader;
  hideHeaderButtons = true;
  ellipsePopoverList: Array<string> = [];
  notification: Notifications[];
  username: any;
  noDataFound = Constants.noDataAlert;
  notificationsKeys = Constants.notificationsKeys;
  notificationNav: string;
  notificationdata = false;
  displayProperties = DisplayConstants.properties;
  networkStatus:any
  constructor(
    private router: Router,
    private loader: LoadingService,
    private notificationService: NotificationService,
    private commonService: CommonService,
    private toastService: ToastService,

  ) { }

  changeNotificationStatus(item) {
    let notificationurl;
    if (item[this.notificationsKeys.recordId]) {
      // tslint:disable-next-line:max-line-length
      notificationurl = ApiUrls.getNotificationRecord + '/' + Constants.notificationType.workOrder + '/' + item[this.notificationsKeys.formId] + '/' + item[this.notificationsKeys.recordId];
    } else {
      // tslint:disable-next-line:max-line-length
      notificationurl = ApiUrls.getNotificationRecord + '/' + Constants.notificationType.taskAssignment + '/' + item[this.notificationsKeys.formId] + '/' + item[this.notificationsKeys.assignmentId];
    }
    this.notificationService.getClickedRecordData(notificationurl)
    .subscribe(res => {
      if(res.data.data) {
        const index = this.notification.findIndex(x => x[this.notificationsKeys._id] == item[this.notificationsKeys._id]);
        this.notification[index][this.notificationsKeys.status] = true;
        this.commonService.setNotificationRecord(res);

        if (item[this.notificationsKeys.recordId]) {
          this.router.navigate(["/dashboard/tasksList", item[this.notificationsKeys.taskId],(item[this.notificationsKeys.taskName] || "null"),item[this.notificationsKeys.assignmentId],item[this.notificationsKeys.assignmentName],item[this.notificationsKeys.formId],item[this.notificationsKeys.recordId]]);
        } else {
          this.router.navigate(["/dashboard/tasksList", item[this.notificationsKeys.assignmentId]]);
        }
        const url = ApiUrls.changeNotificationStatus + item[this.notificationsKeys._id];
        this.notificationService.updateNotificationStatus(url, {status : true}).subscribe(res => {});
      } else {
        this.toastService.showToast('Not available');

      }
      
    }, error => {
      this.loader.dismiss();
    });
  }
  getColor(status) {
    switch (status) {
      case false:
        return '#f2f2f2';
      case 'true':
        return 'white';
    }
  }
getNotifications(){
  // this.loader.present();
    const url = ApiUrls.notifications + this.commonService.getUserInfo()._id;
    this.notificationService.getNotifications(url)
      .subscribe(res => {
        this.notificationdata = true;
        this.notification = res['data'];
        // this.loader.dismiss();
      }, error => {
        this.notificationdata = true;
        this.commonService.showErrorResponseAlert(error.status, error.message);
        // this.loader.dismiss();
      });
}
  ngOnInit() {
    this.notificationsHeader = this.displayProperties.notificationsHeader;
    this.getNotifications();
  }
}
