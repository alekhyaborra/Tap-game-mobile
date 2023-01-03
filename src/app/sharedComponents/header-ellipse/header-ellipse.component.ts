import { Component, OnInit, Input } from '@angular/core';
import { EllipsePopoverComponent } from '../ellipse-popover/ellipse-popover.component';
import { HeaderInputs } from '../header/headerInputs';
import { Constants } from '../../constants/constants';
import { ModalsService } from '../../sharedServices/modals.service';

@Component({
  selector: 'app-header-ellipse',
  templateUrl: './header-ellipse.component.html',
  styleUrls: ['./header-ellipse.component.scss'],
})
export class HeaderEllipseComponent implements OnInit {

  imageIcons = Constants.imageIcons;
  @Input()
  ellipseList : Array<string>;
   
  @Input()
  headerInputs:HeaderInputs;

  constructor(
    private modalService : ModalsService
  ) { }

  ngOnInit() {}

  async openPopover(ev: any){
    const componentProps={
      popoverList : this.ellipseList,
      headerInputs: this.headerInputs
    }
    this.modalService.openPopover(EllipsePopoverComponent,'custom-ellipse-popover',componentProps,ev,function(data){

    })
  }

}
