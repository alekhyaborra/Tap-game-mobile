import { Directive, ElementRef, Input, HostListener } from '@angular/core';

@Directive({
  selector: '[appRestrict]'
})
export class RestrictDirective {
  private regex: RegExp = new RegExp(/^[0-9]*$/g);
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', '-'];
  constructor(private el: ElementRef) {
  }
  @HostListener('keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    if(event.key == "Unidentified"){
      this.el.nativeElement.value=this.el.nativeElement.value+" ";
      return;
    }
  }

}
