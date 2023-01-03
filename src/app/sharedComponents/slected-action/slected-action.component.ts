import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Constants } from '../../constants/constants';

@Component({
  selector: 'app-slected-action',
  templateUrl: './slected-action.component.html',
  styleUrls: ['./slected-action.component.scss'],
})
export class SlectedActionComponent implements OnInit {
  selectAction = Constants.selectAction;
  @Input()
  inputData:any;
  
  constructor() {}

  ngOnInit() {}

  @Output()
  emitSelectedAction: EventEmitter<string> = new EventEmitter<string>();
  
  selectedAction(action){
    this.emitSelectedAction.emit(action);
  }

  
}
