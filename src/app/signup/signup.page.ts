import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import {apiUrls} from '../../app/constants/api-urls';
import {AlertServiceService} from '../sharedServices/alert-service.service'


@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage {
  username:string = "";
  name: string='';
  email: string="";
  password: string="";

  constructor(private http: HttpClient, private navCtrl: NavController,private router:Router,private alertService:AlertServiceService) {}

  submit() {
    const body = {
      username: this.username,
      name: this.name,
      email: this.email,
      password: this.password
    };
    // let registerData = this.http.post('http://localhost:5000/register', body).subscribe(
    //   (response) => {
    //     console.log(response);
    //     this.navCtrl.navigateForward('/home');
    //   },
    //   (error) => {
    //     console.error(error);
    //   }
    // );


    this.http.post(apiUrls.register, body).subscribe((res: any) => {
      console.log(res);
      if(res.status==200){
        this.alertService.presentToast('User registered successfully')
        this.router.navigate(["signin"])
      
      // } else if(res.status==409){
      //   this.alertService.presentAlert('Email already registered')
      // } else if(res.status == 400){
      //   this.alertService.presentAlert('Missing required fields')
      }
    },
    error=>{
      console.log(error)
      if(error.status==409){
        this.alertService.presentAlert('Email already registered')
      }else if(error.status==400){
        this.alertService.presentAlert('Missing required fields')
      }
    })
  }
  redirect(){
    this.router.navigate(["signin"])
  }
}
