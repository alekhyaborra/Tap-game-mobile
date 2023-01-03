import { Component, OnInit, ViewChild } from '@angular/core';
import { Constants } from '../../constants/constants';
import { ActivatedRoute } from '@angular/router';
import { HistoryListComponent } from 'src/app/sharedComponents/history-list/history-list.component';
import { DisplayConstants } from '../../constants/constants';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  @ViewChild(HistoryListComponent) historyComponent: HistoryListComponent;
  ellipsePopoverList
  hideFilter = true;
  hideMap = true;
  history: string;
  hideEllipse = true;
  searchBy: any;
  displayProperties = DisplayConstants.properties;
  constructor(private route: ActivatedRoute) { }
  search(event) {
    this.historyComponent.historySearch(event);
  }
  ngOnInit() {
    this.history = this.displayProperties.historyLabel;
    this.route.paramMap.subscribe(params => {
    });
  }

}
