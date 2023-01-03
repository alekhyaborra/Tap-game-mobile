import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Constants } from '../../constants/constants';
@Component({
  selector: 'app-map-menu',
  templateUrl: './map-menu.component.html',
  styleUrls: ['./map-menu.component.scss'],
})
export class MapMenuComponent implements OnInit {
  icon=Constants.imageIcons;
  @Input()
  toolbarButtonConf
  @Input()
  isHistory;
  @Output()
  selectedMapAction: EventEmitter<string> = new EventEmitter<string>();
  geometryActionTypes = Constants.geometryActionTypes;

  constructor() { }

  ngOnInit() {}

  selectedAction(actionType){
    if(this.toolbarButtonConf.actionStarted || this.toolbarButtonConf.drawStarted)
      return;
    this.selectedMapAction.emit(actionType);
  }

  openMapMenu(event) {
    if(this.toolbarButtonConf.actionStarted || this.toolbarButtonConf.drawStarted)
      event.stopPropagation();
  }
  
}
