import { Component, OnInit, Input } from '@angular/core';
import { ChartType } from 'chart.js';
import { MultiDataSet } from 'ng2-charts';
import { Constants } from '../../../constants/constants';
import { SliderServiceService } from '../../slider-service.service';
import { CommonService } from '../../../sharedServices/commonServices/common.service';
import { DisplayConstants } from '../../../constants/constants';

@Component({
  selector: 'app-work-order-info',
  templateUrl: './work-order-info.component.html',
  styleUrls: ['./work-order-info.component.scss'],
})
export class WorkOrderInfoComponent implements OnInit {

  @Input()
  doughnutChartLabels: any;
  @Input()
  doughnutChartType: ChartType;
  @Input()
  legend: any;
  @Input()
  doughnutColors: any[];
  @Input()
  sliderType: any;

  wOChartData: MultiDataSet = [[0, 0, 0]];
  wOtotalCount: number;
  DataStatus: boolean = false;
  DataES: boolean = false;
  loaderStatus: boolean = true;
  redIcon: string;
  greenIcon: string;
  yellowIcon: string;
  displayProperties = DisplayConstants.properties;
  
  constructor(
    private sliderServiceService: SliderServiceService,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    
    const WOData = this.commonService.getWODBInfo();
    if (WOData) {
      this.loaderStatus = false;
      this.DataES = false;
      this.DataStatus = true;
      this.wOChartData = WOData.chartData;
      this.wOtotalCount = WOData.totalCount;
    }
    else {
      this.getData();
    }
    this.redIcon = Constants.imageIcons.red;
    this.greenIcon = Constants.imageIcons.green;
    this.yellowIcon = Constants.imageIcons.yellow;
  }

  getData() {
    this.DataES = false;
    this.loaderStatus = true;
    this.sliderServiceService.getWOData().subscribe(response => {
      this.DataStatus = true;
      this.loaderStatus = false;
      this.commonService.setWODBInfo(response);
      this.wOChartData = response.chartData;
      this.wOtotalCount = response.totalCount;
    }, error => {
      this.loaderStatus = false;
      this.DataES = true;
      this.DataStatus = false;
      this.commonService.errorHandleOnDB(error.status, error.message);
    })
  }

}
