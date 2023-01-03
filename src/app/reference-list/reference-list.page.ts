import { Component, OnInit, NgZone } from '@angular/core';
import { Constants, DisplayConstants } from 'src/app/constants/constants';
import { ReferenceListService } from './reference-list.service';
import { ToastService } from '../sharedServices/toast.service';
import { CommonService } from '../sharedServices/commonServices/common.service';
import { ApiUrls } from '../constants/api-urls';
import { DownloadService } from '../sharedServices/download.service';
import { RestApiService } from '../sharedServices/rest-api.service';
import { LoadingService } from '../sharedServices/loading.service';

@Component({
  selector: 'app-reference-list',
  templateUrl: './reference-list.page.html',
  styleUrls: ['./reference-list.page.scss'],
})
export class ReferenceListPage implements OnInit {
  settingsHeader: string = DisplayConstants.properties.referenceListLabel;
  hideHeaderButtons = true;
  ellipsePopoverList: Array<string> = [];
  displayProperties = DisplayConstants.properties;
  referenceList: Array<any> = [];
  imageIcons = Constants.imageIcons;
  networkStatus: boolean;
  
  constructor(
    private referenceListService: ReferenceListService,
    private toastService: ToastService,
    private commonService: CommonService,
    private downloadService: DownloadService,
    public loadingService: LoadingService,
    private ngZone: NgZone,
    private restApiService: RestApiService
  ) { }

  ngOnInit() {
    this.getReferenceList();
    this.commonService.networkStatus.subscribe(status => {
      this.networkStatus = (<any>status);
    });
    this.networkStatus = this.commonService.getApplicationNetworkStatus();
  }

  getReferenceList() {
    this.referenceListService.getReferenceList()
      .then((res) => {
        if (res['status']) {
          this.ngZone.run(() => {
            this.referenceList = res['data'];
          });          
        }
        else {
          this.toastService.showToast(this.displayProperties.internalServerProblem);
        }
      })
  }

  updateReferenceList(data) {
    this.loadingService.present();
    let url = ApiUrls.referenceList;
    let refData = { "refList": [{'name': data.name,'version': data.version}]};
    this.restApiService.postServiceProcess(url, refData).subscribe(
      responseData => {
        if (responseData['referenceList'] &&  responseData['referenceList'].length > 0) {
          this.downloadService.downloadRerList(responseData['referenceList'], responseData['version']);
          this.toastService.showToast(Constants.refListUpdateMsg)
        }
        else {
          this.toastService.showToast(Constants.refListMsg)
        }
        this.loadingService.dismiss();
      },
      error => {
      });
  }
}
