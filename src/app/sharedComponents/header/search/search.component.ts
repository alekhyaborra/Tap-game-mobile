import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SearchService } from './search.service'
import { LoadingService } from 'src/app/sharedServices/loading.service';
import { Storage } from '@ionic/storage';
import { HeaderInputs } from '../headerInputs';
import { CommonService } from 'src/app/sharedServices/commonServices/common.service';
import { ToastService } from 'src/app/sharedServices/toast.service';
import { Constants } from 'src/app/constants/constants';
import { AlertService } from 'src/app/sharedServices/alert.service';
import { ElementRef, Renderer2 } from '@angular/core';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {

  search: string;
  searchStatus: boolean;
  @Input()
  headerInputs: HeaderInputs;

  @Output() public searchEvent = new EventEmitter;

  nullValue = Constants.nullValue;
  searchedValue:any;
  data: Array<string> = [];
  page: String;
  taskid: string;
  focused:boolean=false;
  constructor(private loader: LoadingService,
    private storage: Storage,
    private commonService: CommonService,
    private searchService: SearchService,
    private toastservice: ToastService,
    private alertService:AlertService,
    private renderer:Renderer2,
    private el: ElementRef
  ) {
  }
  focusedOut(event){
    setTimeout(() => { 
      this.focused=false
      this.search=this.searchedValue
     }, 100);
  }
  focusedIn(event){
    this.focused=true
  }
  pageSearch(event) {
    event.target.blur()
   // this.renderer.invokeElementMethod(event.target, 'blur');

    this.searchedValue=this.search
    this.searchEvent.emit({pattern:this.search,status:true})
  }
  searchEventChange(event) {
    try{
      if (this.search.length && this.search.length - 1 == 0 && event.data == this.nullValue) {
        this.searchStatus = false
        this.searchedValue=this.nullValue
        this.searchEvent.emit({pattern:this.nullValue,status:false})
  
      } else if (event.data != this.nullValue) {
        this.searchStatus = true
      }
    }catch{
    }

  }
  searchEventChangeCross(event) {
    this.searchedValue=this.nullValue
    this.search = this.nullValue;
    this.searchEvent.emit({pattern: this.nullValue,status:false})
  }

  ngOnInit() {

  }

}
