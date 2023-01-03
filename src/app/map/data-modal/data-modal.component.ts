import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DisplayConstants } from '../../constants/constants';

@Component({
  selector: 'app-data-modal',
  templateUrl: './data-modal.component.html',
  styleUrls: ['./data-modal.component.scss'],
})
export class DataModalComponent implements OnInit {
  data:any;
  displayProperties = DisplayConstants.properties;
  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {}
  closeModal(){
    this.modalController.dismiss()
  }
  saveDataModal(){
    this.modalController.dismiss(this.data);

  }
}
