import { Component, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { FieldConfig } from '../../models/field-config.interface';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { SignatureViewModalComponent } from './signature-view-modal/signature-view-modal.component';
import { ImageViewerModalComponent } from '../image-viewer-modal/image-viewer-modal.component';
import { widgetKeys } from '../../object-keys-constants'
import { FormDataDistributionService } from '../../form-data-distribution.service'
import { FormModuleconstants } from '../../form-module-constants';
import { WebView } from '@awesome-cordova-plugins/ionic-webview/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { CommonService } from '../../../sharedServices/commonServices/common.service';
import { LoadingService } from 'src/app/sharedServices/loading.service';
import { ApiUrls } from 'src/app/constants/api-urls';
import { RestApiService } from 'src/app/sharedServices/rest-api.service';
import { Constants } from 'src/app/constants/constants';
import { ToastService } from 'src/app/sharedServices/toast.service';
import { Keyboard } from '@awesome-cordova-plugins/keyboard/ngx';
@Component({
  selector: 'app-form-signature',
  templateUrl: './form-signature.component.html',
  styleUrls: ['./form-signature.component.scss'],
})
export class FormSignatureComponent implements OnInit, AfterViewChecked {
  config: FieldConfig;
  group: FormGroup;
  signatureDataValue: any
  widgetKey: any;
  signatureKey: any;
  historyView: boolean
  expendedHeaderId: any;
  derivedFields: any;
  derivedFieldsCopy: any;
  isDerivedField: boolean = false;
  bOSubscribe: any;
  data: any;
  tableWidgetId: any;
  tableWidgetIndex: any;
  isTable: boolean;
  // mediaAlreadyAttached: boolean;
  mediaAlreadyAttached: boolean = false;
  constructor(private modalCtrl: ModalController,
    private storage: Storage,
    private formDataDistributionService: FormDataDistributionService,
    private webView: WebView,
    private file: File,
    private commonService: CommonService,
    private loader: LoadingService,
    private restApiService: RestApiService,
    private toastService: ToastService,
    private keyBoard: Keyboard,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    this.widgetKey = widgetKeys.keys;
  }

  get tableWidgetArray() {
    return this.group.get(this.tableWidgetId) as FormArray;
  }

  async openImage(img) {
    const modal = await this.modalCtrl.create({
      component: ImageViewerModalComponent,
      componentProps: {
        imgData: img,
        Header: this.config[this.widgetKey.label],
        footer: FormModuleconstants.rewrite,
        change: this.openSignatureModal.bind(this),
        delete: this.deleteImage.bind(this),
        edit: false,
        historyView: this.historyView
      }
    });
    modal.present();
  }

  openSignature(signature) {
    if(this.keyBoard.isVisible) {
      this.keyBoard.hide();
      setTimeout(() => {
        this.openSignatureModal(signature);
      }, 150);
    } else {
      this.openSignatureModal(signature);
    }
  }

  async openSignatureModal(signature){
    if(!this.historyView){
    this.group.get(this.config[this.widgetKey._id]).markAsDirty();
    this.signatureKey=signature
    const modal=await this.modalCtrl.create({
      component:SignatureViewModalComponent,
      componentProps:{
        signature:signature,
        Header:this.config[this.widgetKey.label],
        change:this.signatureDataValue1.bind(this)
      }
    });
    modal.present();
  }else{
  }
  }

  deleteImage() {
    let mediaData: any = [];
    mediaData = this.commonService.getMediaData() ? this.commonService.getMediaData() : [];
    let index = mediaData.findIndex(record => record.options.params.fieldId == this.config[widgetKeys.keys._id]);
    if (index > -1) {
      mediaData.splice(index, 1);
    }
    this.group.get(this.config[this.widgetKey._id]).setValue('');
    this.commonService.setMediaData(mediaData);
  }
  signatureDataValue1(img) {
    let realData = img.split(",")[1];
    let blob = this.b64toBlob(realData, 'image/jpeg');
    let filename = new Date().getTime() + ".png";
    this.file.checkDir(this.file.applicationStorageDirectory, 'signatures')
      .then(_ => {
        this.createSignatureFile(filename, blob);
      })
      .catch(err => {
        this.file.createDir(this.file.applicationStorageDirectory, 'signatures', false).then(result => {
          this.createSignatureFile(filename, blob);
        })
          .catch(err => {
            this.toastService.showToast(Constants.somethingWentWrong);
          })
      });
  }

  b64toBlob(b64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = 512;
    var byteCharacters = atob(b64Data);
    var byteArrays = [];
    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);
      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
  createSignatureFile(filename, blob) {
    this.file.writeFile(this.file.applicationStorageDirectory + 'signatures/', filename, blob).then(response => {
      let mediaData: any = [];
      this.group.get(this.config[this.widgetKey._id]).setValue(this.webView.convertFileSrc(response.nativeURL));
      let imageName = response.name;
      mediaData = this.commonService.getMediaData() ? this.commonService.getMediaData() : [];
      let signatureTimeStamp = this.group.get(this.config[widgetKeys.keys._id]).value;
      let index = mediaData.findIndex(record => record.options.params.fieldId == this.config[this.widgetKey._id] && record.options.params.timestamp == signatureTimeStamp);
      if (index > -1) {
        mediaData.splice(index, 1);
      }
      let options = {
        fileKey: "image",
        fileName: imageName,
        chunkedMode: false,
        mimeType: "png",
        params: {
          fieldId: this.config[widgetKeys.keys._id],
          correctPath: response.nativeURL.replace('file:///', ''),
        }
      };
      mediaData.push({ options: options, path: response.nativeURL.replace('file:///', '') });
      this.mediaAlreadyAttached = false;
      this.commonService.setMediaData(mediaData);
    }).catch(err => {
      this.toastService.showToast(Constants.somethingWentWrong);
    })
  }

  viewPreview() {
    if (this.historyView || this.commonService.getWOData().recordStatus == Constants.statusValue["Reassigned"]) {
      this.loader.present()
      let imgUrl = ApiUrls.getImageorVideo + "/" + this.commonService.getRecordId() + "/" + this.config[widgetKeys.keys._id]
      let url = ApiUrls.fetchImageOrVideoExists + "/" + this.commonService.getRecordId() + "/" + this.config[widgetKeys.keys._id]
      const headers = this.restApiService.getHeadersForGet();
      try {
        this.restApiService.getServiceProcess(url, headers).subscribe(res => {
                         if(this.loader.isLoading){ this.loader.dismiss(); }
         
         
          if (res['status'] == 204) {
            this.toastService.showToast(Constants.noDataFound)
          }
          else if (res['status'] == 200) {
            this.openImage(imgUrl)
          }
        })
      } catch (e) {
                       if(this.loader.isLoading){ this.loader.dismiss(); }
         
         
        this.openImage(url)
      }
    }
  }
  ngOnInit() {
    if (this.group.get(this.config[this.widgetKey._id]).value && (this.commonService.getWOData().recordStatus == Constants.statusValue["Reassigned"] || this.historyView)) {
      let imgUrl = ApiUrls.getImageorVideo + "/" + this.commonService.getRecordId() + "/" + this.config[widgetKeys.keys._id] + "/" + Math.random();
      this.group.get(this.config[this.widgetKey._id]).setValue(imgUrl ? imgUrl : '');
      this.changeDetectorRef.detectChanges();
    } else {
      let sigValue = this.group.get(this.config[widgetKeys.keys._id]).value ? this.group.get(this.config[widgetKeys.keys._id]).value : '';
            this.group.get(this.config[widgetKeys.keys._id]).setValue(this.webView.convertFileSrc(sigValue));
            this.changeDetectorRef.detectChanges();
        }

    this.formDataDistributionService.hederOpen.subscribe(expendedHeaderId => {
      this.expendedHeaderId = expendedHeaderId;
    });
    const fieldIndex = this.derivedFields.indexOf(this.config[widgetKeys.keys._id])
    if (fieldIndex > -1) {
      this.isDerivedField = true;
      this.bOSubscribe = this.formDataDistributionService.derivedFieldRef.subscribe(derivedFields => {
        if (typeof derivedFields == widgetKeys.dataTypes.object) {
          const fieldIndex = derivedFields.indexOf(this.config[widgetKeys.keys._id])
          if (fieldIndex > -1) {
            this.isDerivedField = true;
            this.group.get(this.config[widgetKeys.keys._id]).reset();
          }
          else {
            if (this.data){
              this.group.get(this.config[widgetKeys.keys._id]).setValue(this.webView.convertFileSrc(this.file.applicationStorageDirectory + "signatures/" + this.data[this.config[widgetKeys.keys._id]] + ".png"));
            }
            this.isDerivedField = false;
          }
        }
      });
    }
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy() {
    if (this.bOSubscribe) {
      this.bOSubscribe.unsubscribe();
    }
  }
}
