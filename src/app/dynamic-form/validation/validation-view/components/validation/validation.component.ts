import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-validation',
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.scss'],
})
export class ValidationComponent implements OnInit {
  @Input()
  dynamicFormControlRef;
  constructor() { }
  ngOnInit() {
  }
  
}
