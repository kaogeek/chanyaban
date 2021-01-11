/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'card-keyword-related',
  templateUrl: './CardKeywordRelated.component.html'
})
export class CardKeywordRelated implements OnInit {

  @Input()
  public keywordRelated: any;
  @Output()
  public clickAddKeywordInUrl: EventEmitter<any> = new EventEmitter();
  public isMoreKeyword: boolean = false;

  constructor() {
  }

  public ngOnInit() {
  }

  public clickMoreKeyword(): void {
    this.isMoreKeyword = !this.isMoreKeyword;
  }
}
