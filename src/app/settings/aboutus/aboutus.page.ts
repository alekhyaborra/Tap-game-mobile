import { Component, OnInit } from '@angular/core';
import { Constants } from '../../constants/constants';
import { StorageService } from 'src/app/sharedServices/storage.service';

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.page.html',
  styleUrls: ['./aboutus.page.scss'],
})
export class AboutusPage implements OnInit {
  hideHeaderButtons:boolean = true;
  changePasswordHeader:string = "About US";
  ellipsePopoverList:Array<string> = [];
  imageIcons = Constants.imageIcons;
  latestAppVersion:any = Constants.appVersion;
    constructor( private storageService: StorageService,
      ) { }

  ngOnInit() {
    
  }
  
}
