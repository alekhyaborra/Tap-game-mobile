import { Injectable } from '@angular/core';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { Observable } from 'rxjs';
import { Constants } from '../constants/constants';
import { HttpClient } from '@angular/common/http';
import { map, debounce } from 'rxjs/operators';

import { CommonService } from '../sharedServices/commonServices/common.service'

@Injectable({
  providedIn: 'root'
})
export class RestApiService {

  constructor(private http: HTTP, private http1: HttpClient, private commonService: CommonService) {
  }

  getFeatureInfoProcess(url, headers?) {
    if (this.commonService.getApplicationNetworkStatus()) {
      return new Observable(observer => {
        this.http.setServerTrustMode('nocheck');
        this.http.get(url, {},'').then(response => {
          this.commonService.showSuccessResponseAlert(response['status'] || 1001, response['message'] || Constants.internalServerProblem, function (code) {
            if (code) {
              observer.next(JSON.parse(response['data']));
            }
            else {
              observer.error(response['message'] || Constants.internalServerProblem);
            }
          })
        }).catch(error => {
          // this.commonService.showErrorResponseAlert(error.status || 1001, error.message || Constants.internalServerProblem);
          observer.error(error.message || Constants.internalServerProblem);
        })
      })
    } else {
      return new Observable(observer => {
        observer.next({ status: Constants.offlineStatus, message: Constants.offlineServiceHit });
      })
    }
  }


  getServiceProcess(url, headers?) {
    let header = headers? headers : this.getHeadersForGet();
    if (this.commonService.getApplicationNetworkStatus()) {
      return new Observable(observer => {
        this.http.setServerTrustMode('nocheck');
        this.http.get(url, {}, header).then(response => {
          this.commonService.showSuccessResponseAlert(response['status'] || 1001, response['message'] || Constants.internalServerProblem, function (code) {
            if (code) {
              observer.next(JSON.parse(response['data']));
            }
            else {
              observer.error(response['message'] || Constants.internalServerProblem);
            }
          })
        }).catch(error => {
          this.commonService.showErrorResponseAlert(error.status || 1001, error.message || Constants.internalServerProblem);
          observer.error(error.message || Constants.internalServerProblem);
        })
      })
    } else {
      return new Observable(observer => {
        observer.next({ status: Constants.offlineStatus, message: Constants.offlineServiceHit });
      })
    }
  }

  postServiceProcess(url, data) {
    if (this.commonService.getApplicationNetworkStatus()) {
      return new Observable(observer => {
        this.http.setServerTrustMode('nocheck');
        this.http.post(url, data, this.getHeadersForGet()).then(response => {
          this.commonService.showSuccessResponseAlert(response['status'] || 1001, response['message'] || Constants.internalServerProblem, function (code) {
            if (code) {
              observer.next(JSON.parse(response['data']));
            }
            else {
              throw Observable.throw(response['message'] || Constants.internalServerProblem);
            }
          })
        }).catch(error => {

          this.commonService.showErrorResponseAlert(error.status || 1001, error.message || Constants.internalServerProblem);
          throw Observable.throw(error.message || Constants.internalServerProblem);
        })
      })
    } else {
      return new Observable(observer => {
        observer.next({ status: Constants.offlineStatus, message: Constants.offlineServiceHit });
      })
    }
  }

  postServiceProcesswithoutHeader(url, data) {
    if (this.commonService.getApplicationNetworkStatus()) {
      return new Observable(observer => {
        this.http.setServerTrustMode('nocheck');
        this.http.post(url, data,{}).then(response => {
          this.commonService.showSuccessResponseAlert(response['status'] || 1001, response['message'] || Constants.internalServerProblem, function (code) {
            if (code) {
              observer.next(JSON.parse(response['data']));
            }
            else {
              throw Observable.throw(response['message'] || Constants.internalServerProblem);
            }
          })
        }).catch(error => {

          this.commonService.showErrorResponseAlert(error.status || 1001, error.message || Constants.internalServerProblem);
          throw Observable.throw(error.message || Constants.internalServerProblem);
        })
      })
    } else {
      return new Observable(observer => {
        observer.next({ status: Constants.offlineStatus, message: Constants.offlineServiceHit });
      })
    }
  }

  putServiceProcess(url, data, headers) {
    if (this.commonService.getApplicationNetworkStatus()) {
      return new Observable(observer => {
        this.http.setServerTrustMode('nocheck');
        let responseData: any = this.http.put(url, data, headers).then(response => {
          this.commonService.showSuccessResponseAlert(response['status'] || 1001, response['message'] || Constants.internalServerProblem, function (code) {
            if (code) {
              observer.next(JSON.parse(response['data']));
            }
            else {
              throw Observable.throw(response['message'] || Constants.internalServerProblem);
            }
          })
        }).catch(error => {
          this.commonService.showErrorResponseAlert(error.status || 1001, error.message || Constants.internalServerProblem);
          throw Observable.throw(error.message || Constants.internalServerProblem);
        })
      })
    } else {
      return new Observable(observer => {
        observer.next({ status: Constants.offlineStatus, message: Constants.offlineServiceHit });
      })
    }
  }

  // loginService(url, data) {
  //   // this.http.setSSLCertMode('nocheck');
  //   let responseData: any = this.http.post(url, data, {});
  //   return Observable.fromPromise(responseData);
  // }

  loginService(url, data) {
  this.http.setServerTrustMode('nocheck');
  return this.http1.post(url, data).pipe(map(res => res))
 
}
  
  

  getHeadersForGet() {

    const headers = {
      "Content-Type": "application/json",
      "X-Access-Token": this.commonService.getUserInfo().token,
      "X-Key": "U1",
      "authorization": this.commonService.getUserInfo().token
    }
    return headers;
  }

}
