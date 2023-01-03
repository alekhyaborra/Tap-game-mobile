import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Constants } from '../../constants/constants';
import { ChartType } from 'chart.js';
import { MultiDataSet, Color } from 'ng2-charts';
import { interval } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-slider-container',
  templateUrl: './slider-container.component.html',
  styleUrls: ['./slider-container.component.scss'],
})
export class SliderContainerComponent implements OnInit {
 @Input() taskCheck: any;
  @Output() taskCountChecked: EventEmitter<boolean> = new EventEmitter(false);
  doughnutChart: any;
  doughnutChartLabels: any;
  taskDoughnutChartData: MultiDataSet;
  formsDoughnutChartData: MultiDataSet;
  woDoughnutChartData: MultiDataSet;
  doughnutChartType: ChartType;
  legend: any;
  doughnutColors: any[];
  tasktotalCount: any;
  formtotalCount: any;
  wototalCount: any;
  activeCard: number = 1;
  numberOfCards: number = 3;
  sliderType: number = 0;
  manualslideStart: boolean = false;
  initialSlideStatus: boolean = true;
  constructor(
    private router: Router,
  ) {
    
   }

  ngOnInit() {
    this.doughnutChartLabels = "";
    this.doughnutColors = [{ backgroundColor: ['#dc0b0b', '#63ab15', '#DDB410'] }];
    this.doughnutChartType = 'doughnut';
    this.legend = {
      cutoutPercentage: 80,
      tooltips: {
        enabled: false
      },
      elements: {
        arc: {
          borderWidth: 0
        }
      }
    };
  }  

  swipeEvent(event, currentCard) {
    this.manualslideStart = true;
    this.initialSlideStatus = false;  
    //Left Swipe
    if (event.direction == 2) {
      this.sliderType = 1;
      if (currentCard == this.numberOfCards) {
        this.activeCard = 1;
      }
      else {
        this.activeCard = currentCard + 1;
      }      
    }
    //Right swipe
    else if (event.direction == 4) {
      this.sliderType = 2;
      if (currentCard == 1) {
        this.activeCard = this.numberOfCards;
      }
      else {
        this.activeCard = currentCard - 1;
      }
    }
  }

  autoSlide() {
    this.sliderType = 1;  
    if (this.activeCard == this.numberOfCards) {
      this.activeCard = 1;
    }
    else {     
      this.activeCard = this.initialSlideStatus ? 2 : this.activeCard + 1;
      this.initialSlideStatus = false;  
    }
  }

sendToDashboard(ev){
    this.taskCountChecked.emit(ev);
    this.taskCheck = ev;
  }
}
