import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, NgZone } from '@angular/core';
import { Chooser } from '@awesome-cordova-plugins/chooser/ngx';
import { FilePath } from '@awesome-cordova-plugins/file-path/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { CommonService } from '../../sharedServices/commonServices/common.service';
import { Constants } from '../../constants/constants';
import { ModalController, NavParams } from '@ionic/angular';
import { ToastService } from '../../sharedServices/toast.service';
import { ApiUrls } from '../../constants/api-urls';
import { AttachmentServiceService } from './attachment-service.service';
import { InAppBrowser, InAppBrowserOptions  } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { DisplayConstants } from '../../constants/constants';


@Component({
  selector: 'app-attachment-modal',
  templateUrl: './attachment-modal.component.html',
  styleUrls: ['./attachment-modal.component.scss'],
})
export class AttachmentModalComponent implements OnInit {

  fileName;
  uploadedFiles: Array<Object> = [];
  recordId: string;
  historyFiles = [];
  exFiles = [];
  isHistoryView: boolean;
  options: InAppBrowserOptions = {
    location : 'no'
  };
  totalAllowedFiles = Constants.maximumNumberofFiles;
  eachFilesize = Constants.maximumFileSizeinMB;
  allowedFileExtension = ['xlsx', 'pdf', 'jpg', 'png', 'xls', 'doc', 'docx', 'ppt', 'txt', 'pptx'];
  displayProperties = DisplayConstants.properties;
  attachmentConstants = this.displayProperties.attachmentModalheading;
  tapPlusForNewFiles = this.displayProperties.tapPlusForNewFiles;
  filepath: any;
  constructor(
    //protected fileChooser: FileChooser,
    protected filePath: FilePath,
    protected file: File,
    public commonService: CommonService,
    protected modalController: ModalController,
    protected toastService: ToastService,
    private ngZone: NgZone,
    private router: Router,
    private attachmentService: AttachmentServiceService,
    private navParams: NavParams,
    private iab: InAppBrowser,
    private fileOpener: FileOpener,
    private route: ActivatedRoute,
    private chooser: Chooser
  ) { 
    this.filepath=this.file;
  }

  ngOnInit() {
    this.recordId =  this.commonService.getRecordId();
    if (this.router.url.indexOf('history') === -1) {
      this.isHistoryView = false;
      this.uploadedFiles = this.commonService.getMediaData().filter(x => !x.options.params.fieldId);
      this.commonService.setFileAttachments(this.uploadedFiles);
    } else {
        this.getUploadedFiles(this.recordId);
        this.isHistoryView = true;
    }

    this.getUploadedFiles(this.recordId);
    this.getAttachmentConfigureations();
  }

  getUploadedFiles(recordId) {
    const url = ApiUrls.uploadFiles + '/' + this.commonService.getRecordId();
    this.attachmentService.getUploadFiles(url)
      .subscribe(res => {
        if (res.status === 200) {
          if (this.isHistoryView) {
            this.historyFiles = res.data;
          } else {
            this.exFiles = res.data;
          }
        } else if (res.status === 204) {
          if (this.isHistoryView) {
            this.historyFiles = [];
          }
        }
      }, error => {
        this.commonService.showErrorResponseAlert(error.status, error.message);
      });
  }

  getAttachmentConfigureations() {
    const url = ApiUrls.getAttachmmentConfigureation;
    this.attachmentService.getAttachmentConfigureations(url)
      .subscribe(res => {
        if (res.status === 200) {
          this.totalAllowedFiles = res.data.maxFilesAllowedPerRecord;
          this.eachFilesize = res.data.maxSizeOfEachFileAllowedPerRecord;
        }
      }, error => {
        this.commonService.showErrorResponseAlert(error.status, error.message);
      });
  }
  chooseFile() {
    const totalLength = this.commonService.getFileAttachments().length + this.exFiles.length;
    if (totalLength >= this.totalAllowedFiles) {
      this.toastService.showToast(this.displayProperties.maximumFilesText + this.totalAllowedFiles + ' files');
    } else {
      this.chooser.getFileMetadata()
        .then(fileMetaData => {
          console.log(fileMetaData);
           this.file.resolveLocalFilesystemUrl(fileMetaData.uri)   //file plugin version 6.0.2
          //  this.filePath.resolveNativePath(fileMetaData.uri).then((actualFilePath) => {  //file plugin version 7.0.0
          // this.file.resolveLocalFilesystemUrl(actualFilePath)
            .then(file => {
              console.log(file);
              let filename = fileMetaData.name.replace(/ /g, '_');
              let timeStamp = Date.now();
              let fileNameWithTime = filename.substring(0,filename.lastIndexOf('.')) + '_' + timeStamp + filename.substring(filename.lastIndexOf('.'));
              console.log(fileNameWithTime);
              file.getMetadata((meta) => {
                if ((meta.size / 1000) / 1000 > this.eachFilesize) {
                  this.toastService.showToast(this.displayProperties.maximumFileSizeText + this.eachFilesize + ' MB');
                } else {
                  this.file.resolveDirectoryUrl(this.file.externalApplicationStorageDirectory)
                    .then(directoryUrl => {
                      // console.log(directoryUrl);
                      let that = this;
                      file.copyTo(directoryUrl, fileNameWithTime, function (data) {
                        // console.log(data);
                        const fileData = that.commonService.getFileAttachments() ? that.commonService.getFileAttachments() : [];
                        data.nativeURL = data.nativeURL.replace('file:///', '');
                        const fileExtension = data.nativeURL.slice(data.nativeURL.lastIndexOf('.') + 1).toLocaleLowerCase();
                        const options = {
                          fileKey: 'attachment',
                          fileName: fileNameWithTime,
                          chunkedMode: false,
                          mimeType: '',
                          params: {
                            fieldId: null
                          }
                        };
                        that.ngZone.run(() => {
                          const existingFiles = that.commonService.getMediaData();
                          const isExist = existingFiles.filter((item) => item.path === data.nativeURL);
                          if (isExist.length === 0) {
                            if (that.allowedFileExtension.indexOf(fileExtension) > -1) {
                              fileData.push({ options: options, path: data.nativeURL });
                              existingFiles.push({ options: options, path: data.nativeURL });
                              that.commonService.setMediaData([]);
                              that.commonService.setMediaData(existingFiles);
                              // console.log("attaching file ===============----------**********")
                              // console.log(fileData)
                              that.commonService.setFileAttachments(fileData);
                            } else {
                              that.toastService.showToast(fileExtension + 'file not allowed');
                            }
                          } else {
                            that.toastService.showToast('File already attached');
                          }
                        });
                      },err => {
                        // console.log(err);
                        this.toastService.showToast(Constants.fileAttachError);
                      })
                    },err => {
                      // console.log(err);
                      this.toastService.showToast(Constants.fileAttachError);
                    })
                }
              }, error => {
                
                this.toastService.showToast(this.displayProperties.fileAttachError);
              });
            }, err => {
              console.log("err",err);
              this.toastService.showToast(this.displayProperties.fileAttachError);
            })
            .catch
        }, err => {
          // console.log(err);
          this.toastService.showToast(Constants.fileAttachError);
        })
        .catch(e => {
          // console.log(e);
          this.toastService.showToast(this.displayProperties.fileAttachError);
        });
   // }) // file version 7.0.0
  }
    
  }

  close() {
    this.modalController.dismiss();
  }

  removeFile(index) {
      const removedFile = this.commonService.getFileAttachments().splice(index, 1);
      const finalFiels = this.commonService.getMediaData().filter(x => (x.path !== removedFile[0]['path'] && !x.options.params.fieldId));
      this.commonService.setMediaData(finalFiels);
  }

  removeUploadedFile(index) {
    this.commonService.setRemoveUploadedFiles(this.exFiles[index]._id);
    const removedFile = this.exFiles.splice(index, 1);
  }

  public openFile(id: string, fileName: string) {
    const fileExtension = fileName.split('.')[1];
    let type;
    switch (fileExtension) {
      case  'xlsx': {
        type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        break;
      }
      case 'PDF': {
        type = 'application/pdf';
        break;
      }
      case 'jpg': {
        type = 'image/jpeg';
        break;
      }
      case 'png': {
        type = 'image/png';
        break;
      }
      case 'xls': {
        type = 'application/vnd.ms-excel';
        break;
      }
      case 'doc': {
        type = 'application/msword';
        break;
      }
      case 'docx': {
        type = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
      }
      case 'ppt': {
        type = 'application/vnd.ms-powerpoint';
        break;
      }
      case 'txt': {
        type = 'text/plain';
        break;
      }
    }

    const target = '_blank';
    const url = ApiUrls.getAttachment + '/' + id;
    this.attachmentService.getAttachments(url, type).subscribe((res) => {
      const data = btoa(res);
      const file = new Blob([res], {
        type: type
      });
      const blobUrl = window.URL.createObjectURL(file);
      this.iab.create(blobUrl , target, this.options);
    }, (err) => {
      console.log('errorrr');
    });
}

openLocalFile(path, fileName) {
  const filePath: string = 'file:///' + path;
  const that = this;
  const fileType = fileName.split('.')[1];
  let type;
  switch (fileType) {
    case  'xlsx': {
      type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      break;
    }
    case 'PDF': {
      type = 'application/pdf';
      break;
    }
    case 'jpg': {
      type = 'image/jpeg';
      break;
    }
    case 'png': {
      type = 'image/png';
      break;
    }
    case 'xls': {
      type = 'application/vnd.ms-excel';
      break;
    }
    case 'doc': {
      type = 'application/msword';
      break;
    }
    case 'docx': {
      type = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      break;
    }
    case 'ppt': {
      type = 'application/vnd.ms-powerpoint';
      break;
    }
    case 'txt': {
      type = 'text/plain';
      break;
    }
  }
  this.fileOpener.showOpenWithDialog(path, type)
  .then(() => console.log('File is opened'))
  .catch(e => console.log('Error opening file', e));
}

b64toBlob(b64, onsuccess, onerror) {
    const img = new Image();

    img.onerror = onerror;

    img.onload = function onload() {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(onsuccess);
    };

    img.src = b64;
}


getReferredFile(file) {
  const fileType = file.filename.split('.')[1];
  let type;
  switch (fileType) {
    case  'xlsx': {
      type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      break;
    }
    case 'pdf': {
      type = 'application/pdf';
      break;
    }
    case 'jpg': {
      type = 'image/jpeg';
      break;
    }
    case 'png': {
      type = 'image/png';
      break;
    }
    case 'xls': {
      type = 'application/vnd.ms-excel';
      break;
    }
    case 'doc': {
      type = 'application/msword';
      break;
    }
    case 'docx': {
      type = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      break;
    }
    case 'ppt': {
      type = 'application/vnd.ms-powerpoint';
      break;
    }
    case 'txt': {
      type = 'text/plain';
      break;
    }
  }
  const url = ApiUrls.getAttachment + '/' + file._id;
  this.attachmentService.getServersFiles(url, type).subscribe(
    (res: any) => {
      const fileRef = new Blob([res], {
        type: type
      });
      if (fileType === 'png' || fileType === 'jpeg' || fileType === 'svg' || fileType === 'jpg') {
        const blobURL = window.URL.createObjectURL(fileRef);
        this.iab.create(blobURL , '_self', this.options);
      } else {
        this.toastService.showToast(this.displayProperties.notsupport);
      }
    },
    (err: any) => {
      console.log(err);
    }
  );
}

}
