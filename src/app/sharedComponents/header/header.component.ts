import { StorageService } from './../../sharedServices/storage.service';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CommonService } from '../../sharedServices/commonServices/common.service';
import { PopoverController } from '@ionic/angular';
import { Router,ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { FilterModalComponent } from '../filter-modal/filter-modal.component';
import { EllipsePopoverComponent } from '../../sharedComponents/ellipse-popover/ellipse-popover.component';
import { HeaderInputs } from './headerInputs';
import { Constants } from '../../constants/constants';
import { SearchComponent } from './search/search.component';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @ViewChild(SearchComponent) searchComponent : SearchComponent;

  @Input()
  Header:string;
  @Input()
  headerSize: number;
  @Input()
  ellipseList : Array<string>;
  @Input()
  filterObject;
  @Input()
  selectedFilter;
  @Input()
  hideFilter;
  @Input()
  hideMap;
  @Input()
  hideEllipse;
  @Output()
  filterByInPage : EventEmitter<any> = new EventEmitter<any>();
  searchbarColSize : number;
  networkStatus: boolean;
  imageIcons = Constants.imageIcons;
  isAppLatestVersion: boolean;
  @Input()
  headerInputs:HeaderInputs
  @Input()
  showSync;
  @Output() public searchEvent=new EventEmitter;
  @Output()
  syncButton : EventEmitter<any> = new EventEmitter<any>();
  @Input()
  fromRecord;


  versionAlertMsg: string;
  constructor(
    private commonservice:CommonService,
    public popoverController: PopoverController,
    public modalController: ModalController,
    private router: Router,
    private route: ActivatedRoute,
    private storageService: StorageService
  ) { }

  callMe(event){
    this.searchEvent.emit(event)
  }
  ngOnInit() {
    this.versionAlertMsg = Constants.versionUpdateAlertMsg;
     this.isLatestVersion();
    if(this.hideFilter)
      this.searchbarColSize = 12;
    else
     this.searchbarColSize = 10;
    this.commonservice.networkStatus.subscribe(status=>{
      this.networkStatus = (<any>status);
    })
    this.networkStatus = this.commonservice.getApplicationNetworkStatus();
  }  

  goBack(){
    this.commonservice.goBack();
  }

  isLatestVersion() {
    let version = this.storageService.getStoreAppVersion()
      if (Constants.appVersion === version) {
        this.isAppLatestVersion = true;
      } else {
        this.isAppLatestVersion = false;
      }
  
 }

  filterByInHeader(data){
    this.filterByInPage.emit(data);
  }

  gotoMapView(){
    let state = this.commonservice.mapState()
    this.router.navigate([state,this.route.snapshot.params.taskId,this.route.snapshot.params.assignmentId])
   
  }

  sync(){
    this.syncButton.emit();
  }

}
