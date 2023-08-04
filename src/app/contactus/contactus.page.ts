import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {AlertServiceService} from '../sharedServices/alert-service.service';
import { HttpClient } from '@angular/common/http';
import {apiUrls} from '../constants/api-urls';
import { Router } from '@angular/router';




@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.page.html',
  styleUrls: ['./contactus.page.scss'],
})
export class ContactusPage implements OnInit {

  contactForm: FormGroup;

  constructor(private formBuilder: FormBuilder,private alertService:AlertServiceService,private http: HttpClient,private router:Router) { }

  ngOnInit() {
    this.createContactForm();
  }

  createContactForm() {
    this.contactForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      description: ['', Validators.required]
    });
  }

  onSubmit() {

    if (!this.contactForm.valid) {
      console.log(this.contactForm)
      // Replace this code with your desired form submission logic
      this.alertService.presentAlert("Please fill all the fields")

      console.log('alert received successfully!');
    } else{
      const body = {
        username:this.contactForm.value.name,
        email:this.contactForm.value.email,
        des:this.contactForm.value.description
      }
      this.http.post(apiUrls.contact,body).subscribe((res:any)=>{
        console.log(res)
        if(res.status == 200){
          this.alertService.presentAlert("Your query has been submitted. We'll get back to you in 24-48 hrs")
          this.contactForm.reset()
        }
      })     
      
       console.log(this.contactForm)
    }
  }

  navigate(){
    this.router.navigate(['how-to-play'])
  }

}

// Your query has been submitted. We'll get back to you in 24-48 hrs
