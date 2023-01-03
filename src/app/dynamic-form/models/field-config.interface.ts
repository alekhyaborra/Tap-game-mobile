import { ValidatorFn } from '@angular/forms';

export interface FieldConfig {
  label?: string,
  options?: object[],
  placeholder?: string,
  type: string,
  value?: any,
  defaultValue?:any,
  dataType?:string,
  minLength?:number,
  maxLength?:number,
  _id:string,
  isRequired?:boolean,
  isUnderHeading?:string,
  breakOf?:string,
  isAllowMultiselection?:boolean
}
