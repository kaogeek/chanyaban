/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

import { Component } from '@angular/core';

const PAGE_NAME: string = '';

@Component({
  selector: 'web-main-page',
  templateUrl: './WebMainPage.component.html',
})
export class WebMainPage {

  public static readonly PAGE_NAME: string = PAGE_NAME;

  constructor() {
    if (window.location.href.includes("http://") && !window.location.href.includes("localhost")) {
      window.location.replace(window.location.href.replace("http", "https"));
    }
  }
} 