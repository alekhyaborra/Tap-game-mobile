import { Injectable } from '@angular/core';
import { RestApiService } from '../../sharedServices/rest-api.service';
import { CommonService } from '../../sharedServices/commonServices/common.service';
import { LoadingService } from '../../sharedServices/loading.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeometryServicesService {

  constructor(
    private restApiService: RestApiService,
    private commonService: CommonService,
    private loadingService: LoadingService
  ) { }


  getGeometryObjectForm(url): Observable<any> {
    this.loadingService.present();
    const headers = this.restApiService.getHeadersForGet();
    return new Observable<any>(observer => {
      this.restApiService.getServiceProcess(url, headers)
        .subscribe(res => {
          const returnData = { data : res};
          observer.next(returnData);
          observer.complete();
          this.loadingService.dismiss();
        }, error => {
          this.loadingService.dismiss();
        })
    });
  }
}
