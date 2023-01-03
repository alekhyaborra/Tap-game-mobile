import { Injectable } from '@angular/core';
import { RestApiService } from '../../sharedServices/rest-api.service';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Device } from '@awesome-cordova-plugins/device/ngx';
import { CommonService } from '../../sharedServices/commonServices/common.service';
import { ApiUrls } from '../../constants/api-urls';
import { LoadingService } from '../../sharedServices/loading.service';
import { Storage } from '@ionic/storage';
import { Constants } from '../../constants/constants';
import { AlertService } from '../../sharedServices/alert.service';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AttachmentServiceService {

  constructor( private restService: RestApiService,
    private alertService: AlertService,
    private router: Router,
    private device: Device,
    private commonService: CommonService,
    private loadingService: LoadingService,
    private storage: Storage,
    private httpClient: HttpClient,
    private loader: LoadingService) { }
  getUploadFiles(url) {
    const headers = this.restService.getHeadersForGet();
    return new Observable<any>(observer => {
      this.restService.getServiceProcess(url, headers)
        .subscribe(res => {
          try  {
            if (res['status'] === Constants.offlineStatus) {
              this.loader.dismiss();
            } else {
              observer.next(res);
              observer.complete();
              this.loader.dismiss();
            }
          } catch (e) {
            this.loader.dismiss();
          }
        }, error => {
          const returnData = { res: [], infiniteScrollDisable: false };
          observer.next(returnData);
          observer.complete();
          this.loader.dismiss();
        });
    });
  }

  getAttachments(url, type) {
    const headers = this.restService.getHeadersForGet();
    headers['Content-Type'] = type;
    return new Observable<any>(observer => {
      this.restService.getServiceProcess(url, headers)
        .subscribe(res => {
          try  {
            if (res['status'] === Constants.offlineStatus) {
              this.loader.dismiss();
            } else {
              observer.next(res);
              observer.complete();
              this.loader.dismiss();
            }
          } catch (e) {
            this.loader.dismiss();
          }
        }, error => {
          const returnData = { res: [], infiniteScrollDisable: false };
          observer.next(returnData);
          observer.complete();
          this.loader.dismiss();
        });
    });
  }

  getAttachmentConfigureations(url) {
    const headers = this.restService.getHeadersForGet();
    return new Observable<any>(observer => {
      this.restService.getServiceProcess(url, headers)
        .subscribe(res => {
          try  {
            if (res['status'] === Constants.offlineStatus) {
              this.loader.dismiss();
            } else {
              observer.next(res);
              observer.complete();
              this.loader.dismiss();
            }
          } catch (e) {
            this.loader.dismiss();
          }
        }, error => {
          const returnData = { res: [], infiniteScrollDisable: false };
          observer.next(returnData);
          observer.complete();
          this.loader.dismiss();
        });
    });
  }

  getServersFiles(url: string, type) {
    // tslint:disable-next-line:max-line-length
    // const headers = new HttpHeaders({ 'Content-Type': type, 'authorization': 'N/A' });
    return this.httpClient.get(url, {responseType: 'arraybuffer'}).pipe(map(data =>{
            // const data = response.json();
            return data;
    })
)
      // .map(
      //   (response) => {
      //     // const data = response.json();
      //     return response;
      //   }
      // );
  }
}