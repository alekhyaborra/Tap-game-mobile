import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { Constants } from '../../constants/constants';
import { CommonService } from '../../sharedServices/commonServices/common.service'


@Component({
  selector: 'app-marker-info',
  templateUrl: './marker-info.component.html',
  styleUrls: ['./marker-info.component.scss'],
})
export class MarkerInfoComponent implements OnInit {
  markerInfo:any = {};
  statusName = Constants.statusName;
  constructor(private navParams : NavParams,private router:Router, 
              private commonService: CommonService,
              private modalController: ModalController
            ) { }
  ngOnInit() {
    this.markerInfo = this.navParams.get('markerInfo')
  }
  openForm(){
    this.commonService.setWOData({ recordStatus: this.markerInfo.status, id: this.markerInfo.offlineId || Constants.nullValue, dueDate: Constants.nullValue, taskName: Constants.nullValue });    
    this.router.navigate(["/dashboard/tasksList", this.markerInfo.taskId,this.markerInfo.recordId||Constants.nullString,this.markerInfo.assignmentId, ( this.markerInfo.recordId || Constants.nullString), this.markerInfo.formId]);
    this.modalController.dismiss();
  }

}
