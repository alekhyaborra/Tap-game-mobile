import { Component, OnInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { Field } from '../../models/field.interface';
import { FieldConfig } from '../../models/field-config.interface';
import { FormGroup, FormArray } from '@angular/forms';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { ModalController, PopoverController } from '@ionic/angular';
import { ImageViewerModalComponent } from '../image-viewer-modal/image-viewer-modal.component';
import { widgetKeys } from '../../object-keys-constants';
import { FormDataDistributionService } from '../../form-data-distribution.service';
import { Constants } from '../../../constants/constants';
import { ModalsService } from '../../../sharedServices/modals.service';
import { EllipsePopoverComponent } from '../../../sharedComponents/ellipse-popover/ellipse-popover.component';
import { FormModuleconstants } from '../../form-module-constants';
import { CommonService } from '../../../sharedServices/commonServices/common.service';
import { WebView } from '@awesome-cordova-plugins/ionic-webview/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { FormDrawingComponent } from '../form-drawing/form-drawing.component';
import { ApiUrls } from '../../../constants/api-urls';
import { RestApiService } from '../../../sharedServices/rest-api.service';
import { ToastService } from '../../../sharedServices/toast.service';
import { LoadingService } from '../../../sharedServices/loading.service';
import * as watermark from 'watermarkjs';
import { GeoLocationService } from '../../../sharedServices/geo-location.service';
import * as exif from 'exif-js';
import {TagValues, IExifElement, IExif, dump, insert } from 'piexif-ts';
import { Diagnostic } from '@awesome-cordova-plugins/diagnostic/ngx';
import { Device } from '@awesome-cordova-plugins/device/ngx';

@Component({
  selector: 'form-camera',
  templateUrl: './form-camera.component.html',
  styleUrls: ['./form-camera.component.scss'],
})
export class FormCameraComponent implements Field, OnInit, AfterViewChecked {

  nullValue = Constants.nullValue;
  config: FieldConfig;
  group: FormGroup;
  imageCaptured: any;
  widgetKey: any;
  historyView: boolean;
  expendedHeaderId: any;
  derivedFields: any;
  derivedFieldsCopy: any;
  isDerivedField: boolean = false;
  bOSubscribe: any;
  data: any;
  cameraSource = this.camera.PictureSourceType.CAMERA;
  gallerySourc = this.camera.PictureSourceType.PHOTOLIBRARY;
  tableWidgetId: any;
  tableWidgetIndex: any;
  isTable: boolean;
  allMetaData: any;
  latValue = null;
  longValue = null;
  geoTaggingInproressIds ;
  sourceType;
  imgUrl: any;
  ImageFileName:any;
  //  FileIamge:any
  constructor(
    private camera: Camera,
    private modalController: ModalController,
    private formDataDistributionService: FormDataDistributionService,
    private modalsService: ModalsService,
    private commonService: CommonService,
    private webView: WebView,
    private file: File,
    private popoverController: PopoverController,
    private restApiService: RestApiService,
    private toastService: ToastService,
    private loader: LoadingService,
    private geoLocationService: GeoLocationService,
    private diagnostic : Diagnostic,
    private changeDetectorRef: ChangeDetectorRef,
    private device: Device,
  ) {
    this.widgetKey = widgetKeys.keys;
  }

  async openImage(imgUrl,FileIamge) {
    // this.imgUrl = success.nativeURL;
    const modal = await this.modalController.create({
      component: ImageViewerModalComponent,
      componentProps: {
        imgData: imgUrl,
        imgfile:this.ImageFileName,
        Header: this.config[this.widgetKey.label],
        footer: FormModuleconstants.retake,
        change: this.retakeImage.bind(this),
        annotated: this.imageAnnotation.bind(this),
        delete: this.deleteImage.bind(this),
        fieldid: this.config[widgetKeys.keys._id],
        edit: true,
        historyView: this.historyView
      }
    });
    modal.present();
  }
  imageAnnotation(img) {
    this.watermarkImage(img);
  }

  // water mark process
  watermarkImage(img) {
    if (this.config[widgetKeys.keys.isGeotagginEnable] && this.sourceType === this.cameraSource) {
      this.commonService.setGeoTaggingInprogressImagesId( this.config[widgetKeys.keys._id]);
       console.log('water mark',this.config[widgetKeys.keys._id] )



      let successCallback = (isAvailable) => {
        if(!isAvailable){
          this.toastService.showToast(Constants.unableToGetLocation);
          const obj =  {coords: {latitude: 'NA', longitude: 'NA'}};
          this.imageProcessAfterGettingGPsResponse(obj, img, 0);
          }else{
          this.geoLocationService.getLatLong().then((resp) => {
            this.imageProcessAfterGettingGPsResponse(resp, img, 1);
          }, (error) => {
            this.toastService.showToast(Constants.unableToGetLocation);
            const obj =  {coords: {latitude: 'NA', longitude: 'NA'}};
            this.imageProcessAfterGettingGPsResponse(obj, img, 0);
          
          })
        }
      }
      let errorCallback = (e) => console.error(e);
      this.diagnostic.isLocationEnabled().then(successCallback).catch(errorCallback);
  
    } else {
      const today = new Date();
      const date = (today.getMonth() + 1) + '-' +  today.getDate() + '-' + today.getFullYear();
      watermark([img])
      .image(watermark.text.lowerRight( date, '22px Arial', '#0099cc', 0.9))
        .then(image => {
          this.createFolder(image.src, null, null);
        });
    }
  }

  // add geo tagging to photo and add annotaion on top of photo
  imageProcessAfterGettingGPsResponse(resp, img, GpsStatus) {
    const today = new Date();
    const date = (today.getMonth() + 1) + '-' +  today.getDate() + '-' + today.getFullYear();
    const latLong = resp.coords.latitude + ',' + resp.coords.longitude;
    this.placWatermarkProcess(img, latLong + '   ' + date, resp.coords.latitude, resp.coords.longitude);
    if (GpsStatus) {
      this.toastService.showToast('Geo tag added successfully on top of image');
    }
  }
  placWatermarkProcess(img, text, lat, longi) {
    watermark([img])
    .image(watermark.text.lowerRight( text, '22px Arial', '#0099cc', 0.9))
      .then(image => {
        this.createFolder(image.src, lat, longi);
      });
  }

  imageSavingIntoGallery( blob, filename, lat , longi) {
      this.file.writeFile(this.file.externalApplicationStorageDirectory + 'images/', filename, blob).then(
      res => {
        let mediaData: any = [];
        this.group.get(this.config[this.widgetKey._id]).setValue(this.webView.convertFileSrc(res.nativeURL));
        this.imgUrl = res.nativeURL;
        mediaData = this.commonService.getMediaData() ? this.commonService.getMediaData() : [];
        console.log(mediaData)
        const index = mediaData.findIndex(record => record.options.params.fieldId == this.config[this.widgetKey._id]);
        if (index > -1) {
          mediaData.splice(index, 1);
        }
        const options = {
          fileKey: 'image',
          fileName: filename,
          chunkedMode: false,
          mimeType: 'png',
          exifData : this.allMetaData,
          lat: lat,
          longi: longi,
          sourceType: this.sourceType,
          isGeotagginEnable : this.config[widgetKeys.keys.isGeotagginEnable],
          params: {
            fieldId: this.config[widgetKeys.keys._id],
            correctPath: res.nativeURL.replace('file:///', ''),
          }
        };
        mediaData.push({ options: options, path: res.nativeURL.replace('file:///', '') });
        this.commonService.setMediaData(mediaData);
        console.log(mediaData)
        this.commonService.removeGeoTaggingInprogressImagesId(this.config[widgetKeys.keys._id]);
      },
      err => console.log('Error saving image to gallery ', err)
     );
  }
  geoTagggingProcess(img, lati, longi) {
    
      // // update geo tag details into image
      const zeroth: IExifElement = {};
      const exifRef: IExifElement = {};
      const gps: IExifElement = {};
      zeroth[TagValues.ImageIFD.Make] = this.allMetaData.Make;
      exifRef[TagValues.ExifIFD.DateTimeOriginal] = this.allMetaData.DateTime;
      gps[TagValues.GPSIFD.GPSVersionID] = [7, 7, 7, 7];
      gps[TagValues.GPSIFD.GPSDateStamp] = '1999:99:99 99:99:99';
      gps[TagValues.GPSIFD.GPSLongitude] = [1219323420, 10000000];
      gps[TagValues.GPSIFD.GPSLatitude] =   [366132304, 10000000];
      gps[TagValues.GPSIFD.GPSLatitudeRef] = 'N';
      gps[TagValues.GPSIFD.GPSLongitudeRef] = 'W';
      const   exifObj: IExif = {'0th': zeroth, 'Exif': exifRef, 'GPS': gps};
      const exifStr = dump(exifObj);
      const newImg = img.replace('png', 'jpeg');
      const exifImage = insert(exifStr, img);
      return exifImage;
   }

  async drawImage(img,FileIamge) {
    const modal = await this.modalController.create({
      component: FormDrawingComponent,
      componentProps: {
        imgData: img,
        imgfile:this.ImageFileName,
        changeStatus: this.imageAnnotation.bind(this)
      }
    });
    modal.present();
  }
  loaded(e) {
    if (this.config[widgetKeys.keys.isGeotagginEnable] &&  this.sourceType === this.cameraSource ) {
      const that = this;
      that.allMetaData = {img: 'test.png', date: new Date()};
      // exif.getData(e.target, function() {
          // that.allMetaData = exif.getAllTags(this);
      //     let long = exif.getTag(e.target, 'GPSLongitude');
      //     let lat = exif.getTag(e.target, 'GPSLatitude');
      //     if (!long || !lat) {
      //       return;
      //     } else {
      //     }
      //     long = that.convertDegToDec(long);
      //     lat = that.convertDegToDec(lat);
      //     that.latValue = exif.getTag(e.target, 'GPSLongitude');
      //     that.longValue = exif.getTag(e.target, 'GPSLatitude');
      // });
    }
  }
  convertDegToDec(arr) {
    return (arr[0].numerator + arr[1].numerator / 60 + (arr[2].numerator / arr[2].denominator) / 3600).toFixed(4);
  }

  cameraCapture(formcontrolNameRef: any, sourceTypeVal) {
    this.popoverController.dismiss();
    this.sourceType = sourceTypeVal;
      const options: CameraOptions = {
        quality: 20,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        correctOrientation: true,
        sourceType: sourceTypeVal
      };
      let correctPath;
      let currentName;
      this.camera.getPicture(options).then((imageData) => {
        this.imageCaptured = imageData;
        correctPath = imageData.substr(0, imageData.lastIndexOf('/') + 1);
        if (sourceTypeVal === this.cameraSource) {
          currentName = imageData.substring(imageData.lastIndexOf('/') + 1);
          this.imageCaptured = this.imageCaptured.substring(8);
        } else {
          currentName = imageData.substring(imageData.lastIndexOf('/') + 1, imageData.lastIndexOf('?'));
          this.imageCaptured = this.imageCaptured.substring(8, this.imageCaptured.lastIndexOf('?'));
        }
        this.copyFileToLocalDir(correctPath, currentName, currentName, formcontrolNameRef);
      }, (err) => {
        console.log(err);
      })
      .catch(error=>{
        console.log(error)
      })
  //  }
  }

  copyFileToLocalDir(namePath, currentName, newFileName, formcontrolNameRef) {
    let mediaData: any = [];
    this.file.copyFile(namePath, currentName, this.file.externalApplicationStorageDirectory, newFileName).then(success => {
      mediaData = this.commonService.getMediaData() ? this.commonService.getMediaData() : [];
      console.log(mediaData)
      let index = mediaData.findIndex(record => record.options.params.fieldId == formcontrolNameRef);
      if (index > -1) {
        mediaData.splice(index, 1);
      }

      const options = {
        fileKey: 'image',
        fileName: currentName,
        chunkedMode: false,
        mimeType: 'JPEG',
        params: {
          fieldId: this.config[widgetKeys.keys._id]
        },
        exifData: this.allMetaData
      };
      mediaData.push({ options: options, path: this.imageCaptured });
      this.group.get(formcontrolNameRef).setValue(this.webView.convertFileSrc(success.nativeURL));
      
      this.imgUrl = success.nativeURL;
      this.drawImage(this.imgUrl,currentName);
      this.ImageFileName=currentName
      this.commonService.setMediaData(mediaData);
       console.log(mediaData)
    }, error => {
      console.log(error);
    });
  }
  createFolder(img, lat, lng) {
    let realData = img.split(",")[1];
    let blob = this.b64toBlob(realData, 'image/jpeg');
    let filename = new Date().getTime() + ".png";
    this.file.checkDir(this.file.externalApplicationStorageDirectory, 'images')
      .then(_ => {
        this.imageSavingIntoGallery(blob, filename, lat, lng);
      })
      .catch(err => {
        this.file.createDir(this.file.externalApplicationStorageDirectory, 'images', false).then(result => {
          this.imageSavingIntoGallery(blob, filename, lat, lng);
        })
          .catch(err => {
            this.toastService.showToast(Constants.somethingWentWrong);
          })
      });
  }

  retakeImage(event) {
    this.cameraCapture(this.config[this.widgetKey._id], this.cameraSource);
  }

  deleteImage() {
    this.imageCaptured = this.nullValue;
    let mediaData: any = [];
    mediaData = this.commonService.getMediaData() ? this.commonService.getMediaData() : [];
    let index = mediaData.findIndex(record => record.options.params.fieldId == this.config[widgetKeys.keys._id]);
    if (index > -1) {
      mediaData.splice(index, 1);
    }
    this.group.get(this.config[widgetKeys.keys._id]).setValue("");
    this.imgUrl = '';
    this.commonService.setMediaData(mediaData);
  }

  get tableWidgetArray() {
    return this.group.get(this.tableWidgetId) as FormArray;
  }
  viewPreview() {
    if (this.historyView) {
      this.loader.present()
      let imgUrl = ApiUrls.getImageorVideo + "/" + this.commonService.getRecordId() + "/" + this.config[widgetKeys.keys._id]
      const headers = this.restApiService.getHeadersForGet();
      try {
        this.restApiService.getServiceProcess(imgUrl, headers).subscribe(res => {
                         if(this.loader.isLoading){ this.loader.dismiss(); }
          if (res['status'] == 204) {
            this.toastService.showToast(Constants.noDataFound);

          }
          else if (res['status'] == 200) {
            this.openImage(imgUrl,this.ImageFileName);
          }
          else if(res['status'] == 500){
            this.toastService.showToast(Constants.noDataFound);
          }
        })
      } catch (e) {
          if(this.loader.isLoading){ this.loader.dismiss(); }
        this.openImage(imgUrl,this.ImageFileName);
      }
    }
  }
  ngOnInit() {
    this.geoTaggingInproressIds =  this.commonService.getGeoTaggingInprogressImagesIds();
    var recordId_copy =  this.commonService.getrecordId_copy();
    if (this.group.get(this.config[this.widgetKey._id]).value && (this.commonService.getWOData().recordStatus == Constants.statusValue["Reassigned"] || this.historyView)) {
      let imgUrl = ApiUrls.getImageorVideo + "/" + this.commonService.getRecordId() + "/" + this.config[widgetKeys.keys._id] + "/" + Math.random();
      this.group.get(this.config[this.widgetKey._id]).setValue(imgUrl?imgUrl:'');
      this.imgUrl = imgUrl?imgUrl:'';
    }else{
          let camValue = this.group.get(this.config[widgetKeys.keys._id]).value ? this.group.get(this.config[widgetKeys.keys._id]).value : '';
      this.group.get(this.config[widgetKeys.keys._id]).setValue(this.webView.convertFileSrc(camValue));
      this.imgUrl = this.webView.convertFileSrc(camValue);
    }
    this.bOSubscribe = this.formDataDistributionService.hederOpen.subscribe(expendedHeaderId => {
      this.expendedHeaderId = expendedHeaderId;
    });

  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy() {
    if (this.bOSubscribe) {
      this.bOSubscribe.unsubscribe();
    }
  }

  getImage(event, id) {
    if (!this.historyView) {
      const componentProps = {
        popoverList: FormModuleconstants.cameraActionList,
      }
      const that = this;
      this.modalsService.openPopover(EllipsePopoverComponent, 'custom-ellipse-popover', componentProps, event, function (data) {
        if (data == FormModuleconstants.cameraActionList[0])
          that.cameraCapture(id, that.cameraSource);
        else if (data == FormModuleconstants.cameraActionList[1])
          that.cameraCapture(id, that.gallerySourc);
      })
    } else {
    }
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


}
