import { Injectable } from '@angular/core';
import { RestApiService } from '../sharedServices/rest-api.service';
import { CommonService } from '../sharedServices/commonServices/common.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private restApiService: RestApiService,
    private commonService: CommonService
  ) { }
}
