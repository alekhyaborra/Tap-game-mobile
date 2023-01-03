import { Component, OnInit } from '@angular/core';
import { Constants } from '../../../constants/constants';
import { DisplayConstants } from '../../../constants/constants';
@Component({
  selector: 'app-forms-tab',
  templateUrl: './forms-tab.component.html',
  styleUrls: ['./forms-tab.component.scss'],
})
export class FormsTabComponent implements OnInit {
 
  formIcon: string;
  displayProperties = DisplayConstants.properties;
  constructor() { }

  ngOnInit() {
    this.formIcon = Constants.imageIcons.forms;
  }

}
