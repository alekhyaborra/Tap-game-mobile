import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ChartType } from 'chart.js';
import { MultiDataSet } from 'ng2-charts';
import { Constants } from '../../../constants/constants';
import { SliderServiceService } from '../../slider-service.service';
import { CommonService } from '../../../sharedServices/commonServices/common.service';
import { DisplayConstants } from '../../../constants/constants';

@Component({
  selector: 'app-task-info',
  templateUrl: './task-info.component.html',
  styleUrls: ['./task-info.component.scss'],
})
export class TaskInfoComponent implements OnInit {
  @Input()
  doughnutChartLabels: any;
  @Input()
  doughnutChartType: ChartType;
  @Input()
  legend:any;
  @Input()
  doughnutColors: any[];
  @Input()
  sliderType: any;
  @Input() taskCheck: any;
  taskChartData: MultiDataSet = [[0,0]];
  tasktotalCount: number;
  DataStatus = false;
  DataES = false;
  loaderStatus = true;
  redIcon: string;
  greenIcon: string;
  yellowIcon: string;
  displayProperties = DisplayConstants.properties;
updateCount: any;
  @Output() countChecked: EventEmitter<boolean> = new EventEmitter(false);
  constructor(
    private sliderServiceService: SliderServiceService,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    const taskData =  this.commonService.getTaskDBInfo();
    if(taskData) {
        if(this.taskCheck){
          this.getData();
        }
        else {
          this.loaderStatus = false;
          this.DataES = false;
          this.DataStatus = true;
          this.taskChartData = taskData.chartData;
          this.tasktotalCount = taskData.totalCount;
        }
        this.updateCountOnNotification();
    } else {
      this.getData();
    }
    this.redIcon = Constants.imageIcons.red;
    this.greenIcon = Constants.imageIcons.green;
    this.yellowIcon = Constants.imageIcons.yellow;
  }
 updateCountOnNotification(){
    if(this.updateCount){
      this.updateCount.unsubscribe();
    }
    else{
      this.updateCount = this.sliderServiceService.updateCount.subscribe((res) => {
        if(res && this.tasktotalCount !== res.totalCount){
          this.DataStatus = true;
          this.loaderStatus = false;
          this.commonService.setTaskDBInfo(res);
          this.taskChartData =  res.chartData;
          this.tasktotalCount = res.totalCount;
        }
      }, (err) => {
    });
    }  }

  getData() {
    this.DataES = false;
    this.loaderStatus = true;
  
    this.sliderServiceService.getTaskData().subscribe(response => {
      this.DataStatus = true;
      this.loaderStatus = false;
      this.commonService.setTaskDBInfo(response);
      this.taskChartData =  response.chartData;
      this.tasktotalCount = response.totalCount;
      this.taskCheck = false;
      this.countChecked.emit(this.taskCheck);    }, error => {
      this.loaderStatus = false;
      this.DataES = true;
      this.DataStatus = false;
      this.commonService.errorHandleOnDB(error.status, error.message);
    });
  }

}