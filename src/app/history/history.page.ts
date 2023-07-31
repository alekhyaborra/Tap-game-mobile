import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {apiUrls} from '../../app/constants/api-urls';
import { StorageService } from '../sharedServices/storage.service';


@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  userInfo: any;
  items:any[];

  constructor(private http: HttpClient,private storage:StorageService) { }

  ngOnInit() {


    
  }
  ionViewWillEnter(){
    this.storage.get("userInfo").then(data=>{
      if(data){
        this.userInfo=data
        this.http.get(apiUrls.history+"/"+ this.userInfo.email).subscribe((res:any)=>{
          console.log(res)
          this.items = res.data.history
          console.log(this.items)
        })
      }
    })
  }

}
