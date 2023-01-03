import { Directive, HostListener, ElementRef, Input } from '@angular/core';
@Directive({
  selector: '[appDecimalRestrict]'
})
export class DecimalRestrictDirective {
  @Input() decimal ? = false;
  private decimalCounter = 0;
  constructor(private _el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event) {
      const initalValue = this._el.nativeElement.value;
      this.decimalCounter = this._el.nativeElement.value.split('.').length - 1;

     if( this.decimal && this.decimalCounter > 1){
          this._el.nativeElement.value = initalValue.substring(0, initalValue.length - 1);
      }else{
          if(this.decimal){
              let replace = initalValue.replace(/(?!^-)[^0-9\.]/g, '');
              this._el.nativeElement.value = (replace.indexOf(".") >= 0) ? (replace.substr(0, replace.indexOf(".")) + replace.substr(replace.indexOf("."), 4)) : replace;
          }else{
              this._el.nativeElement.value = initalValue.replace(/(?!^-)[^0-9]/g, '');
          }
      }
      
      if (initalValue !== this._el.nativeElement.value) {
          event.stopPropagation();
      }
  }
  
  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
      event.preventDefault();
      const pastedInput: string = event.clipboardData
          .getData('text/plain')
          .replace(/\D/g, ''); // get a digit-only string
      document.execCommand('insertText', false, pastedInput);
  }
}
