import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { Constants } from '../../constants/constants';

@Component({
  selector: 'app-sketching-tool',
  templateUrl: './sketching-tool.component.html',
  styleUrls: ['./sketching-tool.component.scss'],
})
export class SketchingToolComponent implements OnInit {
  showSketchingTool:boolean=false;
  icon=Constants.imageIcons;
  geometryActionTypes = Constants.geometryActionTypes;
  @Input()
  toolbarButtonConf
  @Input()
  isHistory;
  @Output()
  selectedMapAction: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {}

  showTool(){
    if(this.toolbarButtonConf.actionStarted || this.toolbarButtonConf.drawStarted)
      return;
    if(this.showSketchingTool){
      this.showSketchingTool=false
    }else{
      this.showSketchingTool=true
    }
    this.selectedAction(Constants.geometryActionTypes.drawingMenu)
  }

  selectedAction(actionType){
    if(actionType == Constants.geometryActionTypes.drawPoint || actionType == Constants.geometryActionTypes.drawLine ||actionType == Constants.geometryActionTypes.drawArea){
      this.showTool();
    }

    this.selectedMapAction.emit(actionType);
  }
}
