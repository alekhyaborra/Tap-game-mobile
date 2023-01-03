import { Injectable } from '@angular/core';
import { LoadingService } from '../../sharedServices/loading.service';
import { Observable } from 'rxjs';
import { ApiUrls } from '../../constants/api-urls';
import { RestApiService } from '../../sharedServices/rest-api.service';
import { CommonService } from '../../sharedServices/commonServices/common.service';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';

@Injectable({
  providedIn: 'root'
})
export class GpsTrackerService {

  constructor(private loadingService: LoadingService,
    private restApiService: RestApiService,
    private commonService: CommonService,
    private http: HTTP
  ) { }
  gpsTrackerStatus = false;
  trackLocation(dataRef, backgroundGeolocation) {
    const headers = {
      'Content-Type': 'application/json',
      'X-Access-Token': this.commonService.getUserInfo().token,
      'X-Key': 'U1',
      'authorization': this.commonService.getUserInfo().token
    };
    this.http
      .post(
        ApiUrls.trackAPi, // backend api to post
        dataRef,
        headers
      )
      .then(data => {
        // backgroundGeolocation.finish(); // FOR IOS ONLY
      })
      .catch(error => {
        // backgroundGeolocation.finish(); // FOR IOS ONLY
      });
  }
  sendHelpMail(data) {
    this.loadingService.present();
    return new Observable<any>(observer => {
      this.restApiService.postServiceProcess(ApiUrls.troubleShoot, data).subscribe(
        response => {
          this.loadingService.dismiss();
          observer.next(response);
          observer.complete();
        },
        error => {
           this.loadingService.dismiss();
          this.commonService.showErrorResponseAlert(error.status, error.message);
        });
    });
  }
  getDistance() {
    return 500;
  }
  setGpsTrackerStatus(status) {
    this.gpsTrackerStatus = status;
  }

  getGpsTrackerStatus() {
   return  this.gpsTrackerStatus;
  }
}
