import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { Field } from '../../models/field.interface';
import { FieldConfig } from '../../models/field-config.interface';
import { FormGroup, FormArray } from '@angular/forms';
import { widgetKeys } from '../../object-keys-constants';
import { FormDataDistributionService } from '../../form-data-distribution.service';
import { Constants } from '../../../constants/constants';
import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions } from '@awesome-cordova-plugins/media-capture/ngx';
import { CommonService } from '../../../sharedServices/commonServices/common.service';
import { StreamingMedia, StreamingVideoOptions } from '@awesome-cordova-plugins/streaming-media/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { ToastService } from '../../../sharedServices/toast.service';
import { FormBuilderService } from 'src/app/sharedPages/form-builder/form-builder.service';
import { ApiUrls } from 'src/app/constants/api-urls';
import { LoadingService } from 'src/app/sharedServices/loading.service';
import { RestApiService } from 'src/app/sharedServices/rest-api.service';
import { WebView } from '@awesome-cordova-plugins/ionic-webview/ngx';
@Component({
  selector: 'app-form-video',
  templateUrl: './form-video.component.html',
  styleUrls: ['./form-video.component.scss'],
})
export class FormVideoComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @ViewChild('video') video: ElementRef;
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
  tableWidgetId: any;
  tableWidgetIndex: any;
  isTable:boolean;
  videoPlay: boolean = false;
  constructor(
    private formDataDistributionService: FormDataDistributionService,
    private mediaCapture: MediaCapture,
    private commonService: CommonService,
    private streamingMedia: StreamingMedia,
    private file: File,
    private toastService: ToastService,
    private formBuilderService:FormBuilderService,
    private loader:LoadingService,
    private restApiService:RestApiService,
    private apiUrls: ApiUrls,
    private changeRef: ChangeDetectorRef,
    private webView: WebView
  ) {
    this.widgetKey = widgetKeys.keys;
  }

  get tableWidgetArray() {
    return this.group.get(this.tableWidgetId) as FormArray;
  }

  ngOnInit() {
    
  }

  ngAfterViewInit(): void {
    if(this.group.get(this.config[this.widgetKey._id]).value && (this.commonService.getWOData().recordStatus == Constants.statusValue["Reassigned"] || this.historyView)){
      let imgUrl = ApiUrls.getImageorVideo + "/" + this.commonService.getRecordId() + "/" + this.config[widgetKeys.keys._id] + "/" + Math.random();
      this.group.get(this.config[this.widgetKey._id]).setValue(imgUrl?imgUrl:'');
      this.playVideo(this.group.get(this.config[this.widgetKey._id]).value);
    }else{
    let camValue = this.group.get(this.config[widgetKeys.keys._id]).value ? this.group.get(this.config[widgetKeys.keys._id]).value : '';
    this.group.get(this.config[widgetKeys.keys._id]).setValue(camValue);
    this.playVideo(this.group.get(this.config[this.widgetKey._id]).value);
    }

    this.bOSubscribe = this.formDataDistributionService.hederOpen.subscribe(expendedHeaderId => {
      this.expendedHeaderId = expendedHeaderId;
    });
  }

  ngAfterViewChecked(): void {
    this.changeRef.detectChanges();
  }

captureVideocheck(config){
  if(!this.historyView){
this.captureVideo(config)
  }else{
    // this.viewPreview()
  }
}
isvideoReshooted:boolean=false;
  captureVideo(config) {
    let options: CaptureVideoOptions = { duration: config[widgetKeys.keys.videoDuration] }
    try {
      this.mediaCapture.captureVideo(options)
        .then(
          (data: MediaFile[] | CaptureError) => {
            let mediaData: any = [];
            mediaData = this.commonService.getMediaData() ? this.commonService.getMediaData() : [];
            if (mediaData.length > 0) {
              let index = mediaData.findIndex(record => record.options.params.fieldId == config[widgetKeys.keys._id]);
              if (index > -1) {
                mediaData.splice(index, 1);
              }
            }
            let fileName = data[0].name;
            if (config[widgetKeys.keys.vidoeSize] && data[0].size / (1024 * 1024) > config[widgetKeys.keys.vidoeSize]) {
              const msg = "Captured video size is " + (data[0].size / (1024 * 1024)).toFixed(2) + "MB, but the size limit is " + config[widgetKeys.keys.videoDuration] + "MB";
              this.toastService.showToast(msg, 2000);
              return;
            }
            let dir = data[0]['localURL'].split('/');
             dir.pop();
            let fromDirectory = dir.join('/');
            let toDirectory = this.file.externalApplicationStorageDirectory;
            //  this.file.copyFile(fromDirectory, fileName, toDirectory, fileName).then(res => {
            //   })
            let targetPath = data[0].fullPath;
            let path = targetPath.substring(8);
             let options = {
               fileKey: "video",
               fileName: fileName,
               chunkedMode: false,
               mimeType: "video/mp4",
               params: {
                 fieldId: config[widgetKeys.keys._id]
               }
             };
            
            
             mediaData.push({ options: options, path: path })
            //  this.group.get(config[widgetKeys.keys._id]).setValue(this.file.externalApplicationStorageDirectory + fileName);
            this.group.get(config[widgetKeys.keys._id]).setValue(data[0]['fullPath']);
             this.commonService.setMediaData(mediaData);
             this.isvideoReshooted = true;
            this.playVideo(this.group.get(this.config[this.widgetKey._id]).value)
          },
          (err: CaptureError) => {          }
        );
    } catch (error) {
      
      
    }

  }
  

  ngOnDestroy() {
    if (this.bOSubscribe) {
      this.bOSubscribe.unsubscribe();
    }
  }

  deleteVideo(id) {
    let mediaData: any = [];
    mediaData = this.commonService.getMediaData() ? this.commonService.getMediaData() : [];
    let index = mediaData.findIndex(record => record.options.params.fieldId == id);
    if (index > -1) {
      mediaData.splice(index, 1);
    }
    this.group.get(id).setValue("");
    this.commonService.setMediaData(mediaData);
  }
  viewPreview() {
    if (this.historyView) {
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
            this.playVideo(this.group.get(this.config[this.widgetKey._id]).value)
          }
        })
      } catch (e) {
                       if(this.loader.isLoading){ this.loader.dismiss(); }
         
         
        this.playVideo(this.group.get(this.config[this.widgetKey._id]).value)
      }
    }
  }
  playVideo(name) {
    if((this.historyView || this.commonService.getWOData().recordStatus == Constants.statusValue["Reassigned"]) && this.isvideoReshooted == false ){
      let vid = this.video.nativeElement;
      vid.src = name;
      vid.poster = Constants.imageIcons.playVideo;
    }else{
    try {
      let url = this.webView.convertFileSrc(name);
        let vid = this.video.nativeElement;
        vid.src = url;
        vid.poster = Constants.imageIcons.playVideo;
    } catch (error) {
    }
  }
  }

}

