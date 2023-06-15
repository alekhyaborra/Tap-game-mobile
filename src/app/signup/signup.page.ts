import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import {apiUrls} from '../../app/constants/api-urls';

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

  constructor(private http: HttpClient, private navCtrl: NavController,private router:Router) {}

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


    this.http.post(apiUrls.register, body).subscribe(((response: any) => {
      console.log(response);
      // this.navCtrl.navigateForward('/home');
      this.router.navigate(["signin"])
    }))
  }
  redirect(){
    this.router.navigate(["signin"])
  }
}
