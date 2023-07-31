import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../sharedServices/storage.service';
import { HttpClient } from '@angular/common/http';
import { apiUrls } from '../constants/api-urls';


@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements OnInit {

  constructor(private router:Router,private storage:StorageService, private http: HttpClient) { }

  ngOnInit() {}
  rewards(){
    this.router.navigate(["rewards"])

  }
  history(){
    this.router.navigate(["history"])

  }
  home(){
    this.router.navigate(["home"])

  }

  logout(){
    this.storage.get('userInfo').then((userInfo)=>{
      this.http.get(apiUrls.tap+this.storage.tapCount+"/"+userInfo.email+'/'+this.storage.dailyCount).subscribe((res:any)=>{
        console.log(res)
      })
      this.storage.remove('userInfo');
  
      this.router.navigate(['signin']);
    });
  }

  contact(){
    this.router.navigate(["contactus"])
  }

}
