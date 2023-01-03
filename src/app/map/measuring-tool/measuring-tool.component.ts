import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-measuring-tool',
  templateUrl: './measuring-tool.component.html',
  styleUrls: ['./measuring-tool.component.scss'],
})
export class MeasuringToolComponent implements OnInit {
  @Input() distance: any;
  @Input() name: any;
  constructor( private modalController: ModalController ) { }

  ngOnInit() {
  }

  closeMeasuringTool(){
      this.modalController.dismiss();
  }



}
