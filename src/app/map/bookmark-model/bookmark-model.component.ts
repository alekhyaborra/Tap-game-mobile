import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: 'app-bookmark-model',
  templateUrl: './bookmark-model.component.html',
  styleUrls: ['./bookmark-model.component.scss'],
})
export class BookmarkModelComponent implements OnInit {

  @Input() name: any;
  @Input() value: any;
  @Input() button_name: any;
  addBookmarkGroup: FormGroup;
  updateValues: any = {
    action: '',
    preValue: '',
    currentValue: ''
  };
  formErrors: any = {
    bookmark: '',
  };
  validationMessages = {
    bookmark: {
    'required': 'Required field',
    'minlength': 'Bookmark must be at least 1 characters',
    'maxlength': 'Bookmark must be below 16 characters',
    'pattern': 'Special Characters are not allowed'
  }
};
  constructor( private modalController: ModalController,
               private formBuilder: FormBuilder ) {
      this.addBookmarkGroup = this.formBuilder.group({
            bookmark: ['', [Validators.required, Validators.pattern('([a-z0-9_\-])*'), Validators.minLength(1), Validators.maxLength(15)]]
        });
        this.addBookmarkGroup.valueChanges.subscribe(( value ) => {
          this.onValueChanged();
        });
    }

  ngOnInit() {
    if(this.value){
      this.addBookmarkGroup.patchValue({
        bookmark: this.value.bookmarkName
      });
    }
  }

  closeBookmarkModal(){
    this.modalController.dismiss();
  }

  onValueChanged(data?: any) {
    if (!this.addBookmarkGroup) { return; }
    const form = this.addBookmarkGroup;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        const control = form.get(field);
        if(data =='checkValidation' && control && !control.valid){
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
        else {
          if (control && control.dirty && !control.valid) {
            const messages = this.validationMessages[field];
            for (const key in control.errors) {
              if (control.errors.hasOwnProperty(key)) {
                this.formErrors[field] += messages[key] + ' ';
              }
            }
          }
        }
      }
    }
  }
  addBookmark(){
    if(this.addBookmarkGroup.valid){
      this.updateValues = { action: this.button_name, preValue: '', currentValue: '' };
      let bookmarkValue = this.addBookmarkGroup.get('bookmark').value;
        this.updateValues.preValue = this.value.bookmarkName;
        this.updateValues.currentValue = bookmarkValue;
      this.modalController.dismiss(this.updateValues);
    }
    else {
      this.onValueChanged('checkValidation')
    }
  }


}
