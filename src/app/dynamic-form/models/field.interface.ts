import { FormGroup } from '@angular/forms';
import { FieldConfig } from './field-config.interface';

export interface Field {
  config: FieldConfig,
  group: FormGroup,
  data? :any,
  historyView?:boolean,
  derivedFields:any
  derivedFieldsCopy:any
  isTable?:boolean
  tableWidgetId? :any;
  tableWidgetIndex? :any;
  Fieldsearch? :any;
  formFields? :any;
  index? : any;
  dependencyCondition? : any;
}
