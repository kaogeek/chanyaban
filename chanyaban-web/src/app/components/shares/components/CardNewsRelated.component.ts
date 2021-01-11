/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

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
