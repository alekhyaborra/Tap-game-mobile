import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../sharedServices/commonServices/common.service';
import { DisplayConstants } from '../../../constants/constants';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
})
export class UserInfoComponent implements OnInit {
  username: string;
  displayProperties = DisplayConstants.properties;
  constructor(
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.username = this.commonService.getUserInfo().name;
  }

}
