import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { FormDrawingComponent } from '../form-drawing/form-drawing.component';
import { FormDataDistributionService } from '../../form-data-distribution.service';
import { WebView } from '@awesome-cordova-plugins/ionic-webview/ngx';
import { CommonService } from 'src/app/sharedServices/commonServices/common.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-image-viewer-modal',
  templateUrl: './image-viewer-modal.component.html',
  styleUrls: ['./image-viewer-modal.component.scss'],
})
export class ImageViewerModalComponent implements OnInit {

  changeStatus:any;
  imageCaptured:any;
  deleteImage:any;
  group: FormGroup;
  fieldid:any;
  annotate:any;
  Header:any;
  edit:boolean;
  imgWebView: any;
  historyView:boolean;
  footer:any;
  constructor(private navParams:NavParams,private modalCtrl:ModalController,
    private formDataDistributionService: FormDataDistributionService,
    private webView: WebView,
    private commonService: CommonService,){
    this.changeStatus =  this.navParams.get("change");
    this.annotate =  this.navParams.get("annotated");

    this.deleteImage= this.navParams.get("delete");
    this.imageCaptured=this.navParams.get("imgData");
    this.imgWebView = this.webView.convertFileSrc(this.imageCaptured);
    this.fieldid=this.navParams.get("fieldid")
    this.edit=this.navParams.get("edit")

  }
  retakeImage() {
    this.modalCtrl.dismiss();
    this.changeStatus();
  }
  closeModal(){
    this.modalCtrl.dismiss()
    // this.annotate(this.imageCaptured);
  }
  deleteImageEvent(){
    this.modalCtrl.dismiss();
    this.deleteImage();
  }
  async drawImage(){
    const modal=await this.modalCtrl.create({
      component:FormDrawingComponent,
      componentProps:{
        imgData:this.imageCaptured,
        change:this.annotatedImage.bind(this),
        delete:this.deleteImage.bind(this)

      }
    });
    modal.present();
  }
  annotatedImage(img){
    this.imageCaptured=img
    this.imgWebView=this.imageCaptured;
    this.annotate(this.imageCaptured);
  }
  ngOnInit() {
  }

}
