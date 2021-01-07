import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'card-news-related',
  templateUrl: './CardNewsRelated.component.html'
})
export class CardNewsRelated implements OnInit {

  @Input()
  public newsRelated: any[];
  @Input()
  public isloadNews: boolean = false;
  @Output()
  public searchRelateNews: EventEmitter<any> = new EventEmitter();  
  public countNews: number = 0;
  public totalNews: number = 0;

  constructor() {
  }

  public ngOnInit() {
  }  
}
