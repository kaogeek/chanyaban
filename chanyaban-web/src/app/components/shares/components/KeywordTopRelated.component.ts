import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'; 

@Component({
  selector: 'keyword-top-related',
  templateUrl: './KeywordTopRelated.component.html'
})
export class KeywordTopRelated implements OnInit {

  @Input()
  public keywordTopRelated: any[];
  @Input()
  public allRelated: any[];
  @Input()
  public isLoadingKeywordTop: boolean = false;
  @Output()
  public clickAddKeywordInUrl: EventEmitter<any> = new EventEmitter(); 

  constructor() {
  }

  public ngOnInit() { 
  }
}
