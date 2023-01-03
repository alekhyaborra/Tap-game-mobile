import { Component, OnInit, Input } from '@angular/core';
import { Constants } from 'src/app/constants/constants';
import { HeaderInputs } from '../header/headerInputs';
import { CommonService } from 'src/app/sharedServices/commonServices/common.service';
import { ApiUrls } from 'src/app/constants/api-urls';
import { HistoryService } from './history.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastService } from 'src/app/sharedServices/toast.service';
import { LoadingService } from '../../sharedServices/loading.service';
@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.scss'],
})
export class HistoryListComponent implements OnInit {
  @Input()
  headerInputs: HeaderInputs;
  stopInfiniteScroll  = false;
  loaderText = Constants.infiniteScrollText;
  page: string;
  displayKey: any;
  pageId: String;
  historyRecords: Array<string> = [];
  responseData: any;
  historyKey = Constants.historyKey;
  noDataFound = Constants.noDataAlert;
  offset = 1;
  imageIcons = Constants.imageIcons;
  historyListData: boolean;
  searchBy: any;
  @Input() search: string;
  constructor(private commonService: CommonService,
    private historyservice: HistoryService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
  }

  

  openForm(recordId,recordId_copy, recordStatus) {
   this.commonService.setWOData({ recordStatus: recordStatus });
   this.commonService.setrecordId_copy(recordId_copy);
    this.router.navigate(['/dashboard/history/form', recordId, this.route.snapshot.params.formId]);
  }
  historySearch(event) {
    this.enableInfiniteScroll();
    this.offset = 1;
    this.searchBy = event.pattern;
    this.historyRecords = [];
      this.getHistoryList();
  }
  ngOnInit() {
    this.historyListData = false;
    this.route.paramMap.subscribe(params => {
      if (params.get('assignmentId') !== 'undefined') {
        this.page = 'tasks';
        this.pageId = params.get('assignmentId');
      } else if (params.get('formId') !== 'undefined') {
        this.page = 'forms';
        this.pageId = params.get('formId');
      } else {
        this.page = 'wo';
        this.pageId = 'undefined';
      }
    });
    this.getHistoryList();
  }
  getHistoryList() {
    const userInfo = this.commonService.getUserInfo();
    const url = ApiUrls.history + '/' + this.page + '/' + userInfo._id + '/' +
     this.pageId + '/' + (this.searchBy || Constants.nullValue) + '/' + Constants.recordsLimit + '/' + this.offset++;
    this.historyservice.getHistoryRecords(url)
      .subscribe(response => {
       this.historyRecords = this.historyRecords.concat(response.historyInfo.docs);
          this.historyListData = true;
          this.displayKey = response.historyInfo[Constants.historyKey.displaykey];
        if (response.infiniteScrollDisable) {
          this.disableInfiniteScroll();
        }
      }, error => {
        this.historyListData = true;
        this.commonService.showErrorResponseAlert(error.status, error.message);
      });

  }
  loadMoreData(event) {
    this.getHistoryList();
    event.target.complete();
  }

  disableInfiniteScroll() {
    this.stopInfiniteScroll = true;
  }

  enableInfiniteScroll() {
    this.stopInfiniteScroll = false;
  }

}

