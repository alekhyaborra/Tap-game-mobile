import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../sharedServices/storage.service';
import { HttpClient } from '@angular/common/http';
import { apiUrls } from '../constants/api-urls';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx'


@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements OnInit {

  constructor(private router:Router,private storage:StorageService, private http: HttpClient ,private socialSharing: SocialSharing) { }

  ngOnInit() {}
  rewards(){
    this.router.navigate(["rewards"])

  }
  share(){
    // this.router.navigate(["share"])
    this.socialSharing.share('refer to your friends')
  
}

  
  home(){
    this.router.navigate(["home"])

  }

  logout(){
    this.storage.get('userInfo').then((userInfo)=>{
      console.log(this.storage.tapCount)
      console.log(this.storage.dailyCount)
      console.log(userInfo)
      console.log(userInfo.tapCount)
      console.log(userInfo.dailyCount)
      this.http.get(apiUrls.tap+this.storage.tapCount+"/"+userInfo.email+'/'+this.storage.dailyCount).subscribe((res:any)=>{
        console.log(res)
        this.storage.remove('userInfo');
        this.storage.tapCount=null
        this.storage.dailyCount = null
        this.router.navigate(['signin']);
      })
    
    });
  }

  contact(){
    this.router.navigate(["contactus"])
  }

}
