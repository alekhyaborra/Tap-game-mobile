import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonService } from '../../sharedServices/commonServices/common.service';
import { Constants } from '../../constants/constants';
import { EllipsePopoverComponent } from '../ellipse-popover/ellipse-popover.component';
import { ModalsService } from 'src/app/sharedServices/modals.service';
import { Router } from '@angular/router';
import { ToastService } from '../../sharedServices/toast.service';

@Component({
  selector: 'app-form-header',
  templateUrl: './form-header.component.html',
  styleUrls: ['./form-header.component.scss'],
})
export class FormHeaderComponent implements OnInit {
  query:any
  imageIcons = Constants.imageIcons
  networkStatus:boolean;
  saveButtonStatus:boolean = true;
  @Input()
  Header:string;
  @Input()
  hideButtons:boolean;
  @Input()
  ellipseList : Array<string>;

  @Output()
  getFilledFormData:EventEmitter<string> = new EventEmitter<string>();

  @Output()
  saveFilledFormData:EventEmitter<string> = new EventEmitter<string>();

  @Output()
  openSketching:EventEmitter<string> = new EventEmitter<string>();

  @Output() public back = new EventEmitter;
  @Output() public popUpback = new EventEmitter;
  
  @Output()
  addAttachment: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  Searchvalue: EventEmitter<string> = new EventEmitter<string>();
  
  @Input()
  showSaveButton:boolean;
  @Input()
  isAttcheMentIconEnable = false;
  searchIcon: boolean = false;
  constructor(private commonservice: CommonService,
    private modalService: ModalsService,
    public router: Router,
    private toastService: ToastService
    ) { }

  ngOnInit() {
    this.commonservice.networkStatus.subscribe(status => {
      this.networkStatus = (<any>status);
    });
    this.networkStatus = this.commonservice.getApplicationNetworkStatus();
  }

  goBack() {
    if (this.router.url.includes('tasksList') || this.router.url.includes('formFiller') ) {
      this.back.emit();
    } else if (this.router.url.includes('osmSketching') ) {
      this.popUpback.emit();
    } else {
      this.commonservice.goBack();
    }
  }
  submitForm() {
    if (this.commonservice.getGeoTaggingInprogressImagesIds().length  === 0 ) {
      this.getFilledFormData.emit();

    } else {
      this.toastService.showToast(Constants.geoTaggginginProgress);
    }
  }

  saveForm()  {
    if (!this.saveButtonStatus) {
      return;
    }
    if (this.commonservice.getGeoTaggingInprogressImagesIds().length  === 0 ) {
      this.saveButtonStatus = false;
      this.saveFilledFormData.emit();

    } else {
      this.toastService.showToast(Constants.geoTaggginginProgress);
    }
  }

  async openPopover(ev: any) {
    const componentProps = {
      popoverList: this.ellipseList,
      // headerInputs: this.headerInputs
    };
    const that = this;
    this.modalService.openPopover(EllipsePopoverComponent, 'custom-ellipse-popover', componentProps, ev, function (data) {
      switch (data) {
        case Constants.ellipseListConstants.sketching: {
          that.openSketching.emit();
          break;
        }
        case Constants.ellipseListConstants.attachmnet: {
          that.addFiles();
          break;
        }
        // tslint:disable-next-line:no-switch-case-fall-through
        default: {
          break;
        }
      }
    });
  }

  addFiles() {
    this.addAttachment.emit();
  }
  search(event) {
    this.query = event.detail.value;
    this.Searchvalue.emit(this.query);
  }

  icon(check){
    if(!check){
      this.query = '';
      this.Searchvalue.emit(this.query);
    }
    else if(check){
      this.Searchvalue.emit(this.query);
    }
  }
}
