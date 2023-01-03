import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';
import { Constants } from '../../constants/constants';

@Component({
  selector: 'app-info-modal',
  templateUrl: './info-modal.component.html',
  styleUrls: ['./info-modal.component.scss'],
})
export class InfoModalComponent implements OnInit {

  infoObject:Object;
  objectKeys = Object.keys;
  infoType:string;
  formInfoKeys = Constants.formInfoKeys;
  recordInfoKeys =  Constants.recordInfoKeys;
  taskInfoKeys = Constants.taskInfoKeys;
  statusName = Constants.statusName;
  statusCodes = Constants.status;
  constructor(
    public popoverController: PopoverController,
    private navParams : NavParams
  ) { }

  ngOnInit() {
    this.infoObject = this.navParams.get('info');
    this.infoType = this.navParams.get('type');
  }

  close(){
    this.DismissClick()
  }

  async DismissClick() {
    await this.popoverController.dismiss();
  }

}
