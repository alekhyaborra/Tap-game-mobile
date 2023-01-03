import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormsService } from 'src/app/forms/forms.service';
import { CommonService } from 'src/app/sharedServices/commonServices/common.service';
import { Constants } from 'src/app/constants/constants';
import { ApiUrls } from 'src/app/constants/api-urls';

@Component({
  selector: 'app-asset-form',
  templateUrl: './asset-form.component.html',
  styleUrls: ['./asset-form.component.scss'],
})
export class AssetFormComponent implements OnInit {

  showSketchingTool: boolean = false;
  icon = Constants.imageIcons;
  searchBy: string = Constants.nullValue
  limit: number = Constants.assetRecordsLimit;
  offset: number;
  // imgUrl='https://picsum.photos/200';
  // assetFormsList: formListStructure[];
  assetFormsList: any[]
  @Input()
  isHistory;
  @Input()
  toolbarButtonConf
  @Output()
  selectedMapAction: EventEmitter<string> = new EventEmitter<string>();
  url: any
  constructor(
    private commonService: CommonService,
    private formService: FormsService,

  ) { }

  ngOnInit() {
    this.assetFormsList = [];
    this.offset = 1
    this.url = ApiUrls.baseUrl
    this.getAssetFormsList()
  }

  showTool() {
    if (this.toolbarButtonConf.actionStarted || this.toolbarButtonConf.drawStarted)
      return;
    if (this.showSketchingTool) {
      this.showSketchingTool = false
    } else {
      this.showSketchingTool = true
    }
    this.selectedAction(Constants.geometryActionTypes.drawingMenu, null)
  }

  selectedAction(actionType, assetForm) {
    // console.log(assetForm)
    if (assetForm) {
      this.commonService.setAssetFormData(assetForm);
      this.commonService.setAssetFormId(assetForm._id);
    }
    if (actionType == Constants.geometryActionTypes.drawPoint || actionType == Constants.geometryActionTypes.drawLine || actionType == Constants.geometryActionTypes.drawArea) {
      this.showTool();
    }

    this.selectedMapAction.emit(actionType);
  }

  getAssetFormsList() {
    const userInfo = this.commonService.getUserInfo();
    // const url = ApiUrls.baseUrl + ApiUrls.getAssetForms + '/' + this.searchBy + '/' + userInfo._id + '/' + this.limit + '/' + this.offset++ + '/' + Constants.assetModelType;
    const url = ApiUrls.baseUrl + ApiUrls.getAssetForms + '/' + this.searchBy + '/' + userInfo._id + '/' + this.limit + '/' + this.offset++  ;
    this.formService.getForms(url, this.searchBy)
      .subscribe(res => {
        this.assetFormsList = this.assetFormsList.concat(res.formsList);

        this.assetFormsList.forEach(element => {
          if(element.imageurl){
            element.imageurl= ApiUrls.unsecureUrl + "/" + element.imageurl
          }else{
            element.imageurl = this.icon.point
          }
        })
        console.log(this.assetFormsList)
        // this.assetFormsList = ["point","triangle","rectangle","line","point3","triangle1","rectangle1","line1","triangle","rectangle","line","point3","triangle1","rectangle1","line1"]

      }, error => {
        this.commonService.showErrorResponseAlert(error.status, error.message);
      })
  }

}
