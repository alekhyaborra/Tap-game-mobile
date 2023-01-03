import { Component, OnInit } from '@angular/core';
import { Constants } from '../../../constants/constants';
import { DisplayConstants } from '../../../constants/constants';

@Component({
  selector: 'app-task-tab',
  templateUrl: './task-tab.component.html',
  styleUrls: ['./task-tab.component.scss'],
})
export class TaskTabComponent implements OnInit {
  taskIcon: string;
  displayProperties = DisplayConstants.properties;
  constructor() { }

  ngOnInit() {
   this.taskIcon = Constants.imageIcons.tasks;
  }

}
