import { Component, OnInit, Renderer2, ViewChild, Output } from '@angular/core';
import { Platform, IonContent, ModalController, NavParams } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { FormModuleconstants } from  "../../../form-module-constants"
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';

@Component({
  selector: 'app-signature-view-modal',
  templateUrl: './signature-view-modal.component.html',
  styleUrls: ['./signature-view-modal.component.scss'],
})
export class SignatureViewModalComponent implements OnInit {

  @ViewChild('myCanvas') canvas: any;
  canvasElement: any;
  lastX:number
  lastY:number
  saveX: number;
  saveY: number;
  changeStatus:any;
  signatureDataValue:any;
  signatureData:any;
  clear:string =FormModuleconstants.clear;
  save:string =FormModuleconstants.save;
  close:string =FormModuleconstants.close;
  Header:any;
  constructor(private navParams:NavParams,
    private storage: Storage,private modalCtrl:ModalController,
    public renderer: Renderer2, private plt: Platform,private androidPermissions: AndroidPermissions) { 
      this.changeStatus =  this.navParams.get("change");
    }

    ngAfterViewInit(){
      this.canvasElement = this.canvas.nativeElement;
      this.renderer.setAttribute(this.canvasElement,'width',this.plt.width()+'');
      this.renderer.setAttribute(this.canvasElement,'height',this.plt.height()+'');
    }
    handleStart(ev){
      this.lastX=ev.touches[0].pageX
      this.lastY=ev.touches[0].pageY
    }
    handleMove(ev){
      let ctx = this.canvasElement.getContext('2d');
      let currentX = ev.touches[0].pageX ;
      let currentY = ev.touches[0].pageY ;
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(this.lastX, this.lastY);
      ctx.lineTo(currentX, currentY);
      ctx.closePath();
      ctx.stroke();
      this.lastX = currentX;
      this.lastY = currentY;
    }
    handleEnd(ev){
    }

    clearCanvasImage(){
      let ctx = this.canvasElement.getContext('2d');
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); 
    }
    saveCanvasImage() {
      var dataUrl = this.canvasElement.toDataURL();
      this.signatureDataValue=dataUrl
      let ctx = this.canvasElement.getContext('2d');
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      this.closeModal();
      this.changeStatus(dataUrl);
    }

    closeModal(){
      this.modalCtrl.dismiss();
      }
      
      checkPermission(){
    
        this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
            err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
        );
        this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE, this.androidPermissions.PERMISSION.GET_ACCOUNTS]);
  }

  ngOnInit() {
    this.checkPermission()
  }

}
