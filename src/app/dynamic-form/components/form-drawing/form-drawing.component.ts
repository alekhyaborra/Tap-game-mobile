import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { CanvasWhiteboardOptions, CanvasWhiteboardComponent, CanvasWhiteboardService, CanvasWhiteboardUpdate } from 'ng2-canvas-whiteboard';
import { NavParams, ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Constants } from 'src/app/constants/constants';
import { ToastService } from 'src/app/sharedServices/toast.service';
import { ConditionalExpr } from '@angular/compiler';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
@Component({
  selector: 'app-form-drawing',
  templateUrl: './form-drawing.component.html',
  styleUrls: ['./form-drawing.component.scss'],
})
export class FormDrawingComponent implements OnInit {
  changeStatus: any;
  pencilwidth: number = 2;
  canvasPosition: any;
  imageIcons = Constants.imageIcons;
  hideMe: boolean;
  imgData:any;
  imgDataURL: any;
  @ViewChild('canvasWhiteboard') canvasWhiteboard: CanvasWhiteboardComponent;
  @Output() onUndo = new EventEmitter<any>();
  saveCanvasData() {
    let canvasContext = this.canvasWhiteboard.canvas.nativeElement.toDataURL();
    this.changeStatus(canvasContext);
    this.closeModal();
  }
  positionCanvas(event) {
    this.hideMe=false
    this.canvasPosition = event;
  }

  undoCanvasData() {
    this.uuidRedo.push(this.uuidArr[this.uuidArr.length - 1])
    this._canvasWhiteboardService.undoCanvas(this.uuidArr[this.uuidArr.length - 1]);
    this.uuidArr.pop();
  }
  redoCanvasData() {
    this.uuidArr.push(this.uuidRedo[this.uuidRedo.length - 1])
    this._canvasWhiteboardService.redoCanvas(this.uuidRedo[this.uuidRedo.length - 1]);
    this.uuidRedo.pop()
  }
  onPressUp(event) {
    this.hideMe = false;
  }
  uuidArr: any = [];
  uuidRedo: any = [];
  sendBatchUpdate(update: CanvasWhiteboardUpdate[]) {
    this.uuidRedo.push(update[0].UUID)
    if (this.uuidRedo.indexOf(update[0].UUID) == -1) {
      this.uuidRedo.push(update[0].UUID)
    }
    if (this.uuidArr.indexOf(update[0].UUID) == -1) {
      this.uuidArr.push(update[0].UUID)
    }
    this.hideMe = false;

  }
  onCanvasSave(event){
  }
  onCanvasUndo(event){
  }
  onCanvasRedo(event){
  }
  closeModal() {
    this.modalCtrl.dismiss();
  }
  clearCanvasData() {
    this._canvasWhiteboardService.clearCanvas();
    this.uuidArr = []
    this.uuidRedo = []

  }

  lineWidth(width) {
    this.hideMe = false;
    this.pencilwidth = width
  }
  toastForText() {
    this.toastcontroller.showToast(Constants.toastForText)
  }
  applyText(data) {
    let ctx = this.canvasWhiteboard.canvas.nativeElement.getContext('2d');
    ctx.font = "15px Comic Sans MS";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    setTimeout(() => {
      ctx.fillText(data, this.canvasPosition.clientX, this.canvasPosition.clientY);
    }, 500);
  }
  addText(data) {
    this.hideMe = false;
    setTimeout(() => {
      this.applyText(data.text)
    }, 500);
  }


  hide() {
    this.hideMe = true;
  }
  canvasOptions: CanvasWhiteboardOptions = {
    drawButtonEnabled: false,
    drawingEnabled: true,
    drawButtonClass: 'drawButtonClass',
    clearButtonEnabled: false,
    clearButtonText: 'Clear',
    undoButtonText: 'Undo',
    undoButtonEnabled: false,
    redoButtonText: 'Redo',
    redoButtonEnabled: false,
    colorPickerEnabled: true,
    saveDataButtonEnabled: false,
    saveDataButtonText: 'Save',
    shouldDownloadDrawing: false,
    lineWidth: this.pencilwidth,
    scaleFactor: 1,
  };
  constructor(private modalCtrl: ModalController,
    private _canvasWhiteboardService: CanvasWhiteboardService,
    private navParams: NavParams,
    private alertController: AlertController,
     private file: File,
    private toastcontroller: ToastService,
    private base64: Base64,) {
    this.changeStatus = this.navParams.get("change");
  }

  ionViewWillEnter(){
    // setTimeout(() => {
    // let path = this.imgData.substr(0, this.imgData.lastIndexOf('/') + 1);
    //      let FileIamge=this.imgData.substr(this.imgData.lastIndexOf('/') + 1)
    //       var a = FileIamge.replace(/%20/g, " ");
    //       this.file.readAsDataURL(path, a)
    //             .then(base64File => {
    //               this.imgData=base64File;
    //             })
    //             .catch((err) => {
    //                 console.log('Error reading file')
    //             })
    //           }, 500);

  }
  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      header: 'Write your Annotation',
      inputs: [
        {
          name: 'text',
          type: 'text',
          placeholder: 'Write your Annotation'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            this.addText(data)
          }
        }
      ]
    });

    await alert.present();
  }
  ngOnInit() {  
    if(this.imgData.match('data:image/png;base64')){
       }
       else {
         this.base64.encodeFile(this.imgData).then((res) => {
           this.imgData = res;
         });
       }
   }
}
