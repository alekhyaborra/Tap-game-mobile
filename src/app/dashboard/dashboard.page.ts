import { StorageService } from './../sharedServices/storage.service';
import { Component, OnInit, ViewEncapsulation, ViewChild, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from '../constants/constants';
import { CommonService } from '../sharedServices/commonServices/common.service';
import { QueryProcessService} from '../offline/query-process/query-process.service';
import { DisplayConstants } from '../constants/constants';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardPage implements OnInit {
  @ViewChild('slider') appSliderContainer;
  taskName: string;
  formName: string;
  workOrderName: string;
  intervel:any;
  inv: any;
  networkStatus: boolean;
  notificationIcon: string;
  settingIcon: string;
  isAppLatestVersion: boolean = true;
  displayProperties = DisplayConstants.properties;
  checkCountOfTask: boolean = false;  
  constructor(
    private router: Router,
    private commonservice: CommonService,
    private queryProcessService: QueryProcessService,
    private storageService: StorageService,
    private storage : Storage,

  ) {
   
   }

  ionViewWillEnter() {
   this.checkCountOfTask = true;
    this.storage.get("userInfo").then((userInfo) => {
      this.appSliderContainer.sliderType = 0;
      this.appSliderContainer.manualslideStart = false;
      this.intervel = setInterval(() => { 
        if (this.router.url == '/dashboard') {
          if (!this.appSliderContainer.manualslideStart) {          
            this.appSliderContainer.autoSlide();
          }
          else {
            this.inv = setInterval(() => {
              this.appSliderContainer.manualslideStart = false;
            }, 10000);
          }
        }
       }, 5000);
    });
  
  }

  ionViewWillLeave() {
   this.checkCountOfTask = false;
    clearInterval(this.intervel);
    clearInterval(this.inv);
  }
 entryCheck(ev){
      this.checkCountOfTask = ev;
  }
  ngOnInit() {
    this.commonservice.showGpsEnableAlert(DisplayConstants.properties.turnOngpsMessage)
    setTimeout(() => this.isLatestVersion() , 1000);
    this.taskName = Constants.dashboardTaskName;
    this.formName = Constants.dashboardFormName;
    this.workOrderName = Constants.dashboardWorkOrderName;
    this.commonservice.networkStatus.subscribe(status=>{
      this.networkStatus = (<any>status);
    })
    this.networkStatus = this.commonservice.getApplicationNetworkStatus();
    this.notificationIcon = Constants.imageIcons.notifications;
    this.settingIcon = Constants.imageIcons.settings;
  }
  
  gotoFormsList() {
    this.router.navigate(["/dashboard/formsList"]);
  }

  gotoTasksList() {
    this.router.navigate(["/dashboard/tasksList",Constants.nullString]);
  }

  notifications() {
    this.router.navigate(["/dashboard/notifications"]);
  }

  settings() {
    this.router.navigate(["/dashboard/settings"]);
  }

  isLatestVersion() {
    let versionnow;
    this.queryProcessService.getAppVersion().then(res=>{
      versionnow = res;
   

    this.storageService.storeVersionApp(versionnow)


    let version = this.storageService.getStoreAppVersion()
      if (Constants.appVersion === version) {
        this.isAppLatestVersion = true;
      } else {
        this.isAppLatestVersion = false;
      }
    })
 }

}
