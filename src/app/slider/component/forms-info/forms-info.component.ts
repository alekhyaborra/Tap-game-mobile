import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ChartType } from 'chart.js';
import { MultiDataSet } from 'ng2-charts';
import { Constants } from '../../../constants/constants';
import { SliderServiceService } from '../../slider-service.service';
import { CommonService } from '../../../sharedServices/commonServices/common.service';
import { DisplayConstants } from '../../../constants/constants';

@Component({
  selector: 'app-forms-info',
  templateUrl: './forms-info.component.html',
  styleUrls: ['./forms-info.component.scss'],
})
export class FormsInfoComponent implements OnInit {
  
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
  formChartData: MultiDataSet = [[0]];
  formtotalCount: number;
  formDataStatus = false;
  formDataES = false;
  loaderStatus = true;
  redIcon: string;
  greenIcon: string;
  yellowIcon: string;
  displayProperties = DisplayConstants.properties;
 @Output() countChecked: EventEmitter<boolean> = new EventEmitter(false);
  constructor(
    private sliderServiceService: SliderServiceService,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    const formData =  this.commonService.getFormDBInfo();
    if (formData) {
if(this.taskCheck){
        this.getData();
      }
      else {
      this.loaderStatus = false;
      this.formDataES = false;
      this.formDataStatus = true;
      this.formChartData = formData.chartData;
      this.formtotalCount = formData.totalCount;
  }
    } else {
      this.getData();
    }
    this.redIcon = Constants.imageIcons.red;
    this.greenIcon = Constants.imageIcons.green;
    this.yellowIcon = Constants.imageIcons.yellow;
  }

  getData() {
    this.formDataES = false;
    this.loaderStatus = true;
    this.sliderServiceService.getFormChartData().subscribe(response => {
if(response.status === Constants.offlineStatus){
        const formData =  this.commonService.getFormDBInfo();
        if(formData){
          this.loaderStatus = false;
          this.formDataES = false;
          this.formDataStatus = true;
          this.formChartData = formData.chartData;
          this.formtotalCount = formData.totalCount;
        }
      }
      else {
      this.formDataStatus = true;
      this.loaderStatus = false;
      this.commonService.setFormDBInfo(response);
      this.formChartData = response.chartData;
      this.formtotalCount = response.totalCount;
  } 
    }, error => {
      this.loaderStatus = false;
      this.formDataES = true;
      this.formDataStatus = false;
      this.commonService.errorHandleOnDB(error.status, error.message);
    })
  }

}
