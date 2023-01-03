import { Component, OnInit, Input } from '@angular/core';
import { ApiUrls } from '../../../constants/api-urls';
import { widgetKeys } from '../../object-keys-constants'
import { FormsService } from '../../../forms/forms.service';

@Component({
  selector: 'app-form-dropdown-history',
  templateUrl: './form-dropdown-history.component.html',
  styleUrls: ['./form-dropdown-history.component.scss'],
})
export class FormDropdownHistoryComponent implements OnInit {
  widgetKey: any;
  @Input()
  selectedValues: any;
  @Input()
  config: any;
  isDynamicDropDownCallFail = true;
  selectedOptions:any;
  constructor(private formsService: FormsService) {
    this.widgetKey = widgetKeys.keys;
   }

  ngOnInit() {
   this.dynamicDropDownOptionSetter();
  }

  dynamicDropDownOptionSetter() {
      const checkUrl =  ApiUrls.dynamicDropDwon + '/'
                       + this.config[this.widgetKey.dynamicDropdownTable] + '/' +
                       this.config[this.widgetKey.columnName];
      this.formsService.getDropDwonvalues(checkUrl)
        .subscribe(res => {
          this.isDynamicDropDownCallFail = false;
          if(res['data']) {
            const obj = res['data'].map ((item) => {
              const emptyObj = {};
              emptyObj['displayValue'] = item ;
              emptyObj['value'] = item ;
              return emptyObj;
            });
            this.config[this.widgetKey.options] = obj;
          }
          const index = this.config.options.findIndex(record => record.value === this.selectedValues.trim());
          this.selectedOptions = this.config.options[index].displayValue;
        }, error => {
          this.isDynamicDropDownCallFail = true;
        });
  }

}
