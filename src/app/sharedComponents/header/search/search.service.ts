import { Injectable } from '@angular/core';
import { RestApiService } from 'src/app/sharedServices/rest-api.service';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(
    private restService : RestApiService
  ) { }

  getSearchedData(url){
   
    const headers = this.restService.getHeadersForGet();
    const response:any = this.restService.getServiceProcess(url,headers);
    return from(response)
    
    // fromPromise(response);  
  }

}
