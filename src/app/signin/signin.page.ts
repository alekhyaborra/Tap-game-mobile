import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { StorageService } from '../sharedServices/storage.service';
import {apiUrls} from '../../app/constants/api-urls';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage {
  email: string = "";
  password: string="";
  profileIcon = "assets/Profile.svg";
  lock = "assets/Lock.svg";
  constructor(private http: HttpClient,private navCtrl: NavController,private router:Router,private storage:StorageService){}

  signIn() {
    
    const body = {
      email:this.email,
      password:this.password
    }
    // this.http.post('http://localhost:5000/login', body).subscribe(((response: any) => {
    //   console.log(response);
    //   this.navCtrl.navigateForward('/home');
    //   // this.storage.set("userInfo",response.data)
    //   if(response.status == 200){
    //     this.router.navigate(["home"])
    //   }
    // }))

    let responseData = this.http.post(apiUrls.login, body).pipe(map(res=>res))
    console.log(responseData)
    responseData.subscribe((res:any)=>{
      console.log(res)
      if(res.status == 200){
            this.storage.set("userInfo",res.data)
            console.log(res.data)
            this.router.navigate(["home"])
          }
    })
  }
  redirect(){
    this.router.navigate(["signup"])
  }

  forgotPassword(){
    this.router.navigate(["forgot-password"])
  }
}
