import { Injectable } from '@angular/core';
import {  DownloadService } from '../sharedServices/download.service';

@Injectable({
  providedIn: 'root'
})
export class ReferenceListService {

  constructor(
    private downloadService: DownloadService
  ) { }

  getReferenceList(){
    return this.downloadService.getAllRefList();    
  }
}
