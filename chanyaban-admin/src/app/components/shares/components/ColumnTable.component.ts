/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

import { Component, OnInit, Input } from '@angular/core';
import { FieldTable } from './TableComponent.component';

const DEFAULT_DATE_TIME_FORMAT: string = "dd-MM-yyyy HH:mm:ss";

@Component({
  selector: 'admin-col-table',
  templateUrl: './ColumnTable.component.html'
})
export class ColumnTable implements OnInit {

  @Input()
  public fieldTable: FieldTable;
  @Input()
  public data: any;
  public defaultDateTimeFormat: string = DEFAULT_DATE_TIME_FORMAT;
  public isSeeMore: boolean = false;

  constructor() {
  }

  public ngOnInit() {
  }

  public getData(): any {
    var data = this.data[this.fieldTable.name];
    let formatObject = this.fieldTable.formatObject;
    if (formatObject.length > 0) {
      for (const field of formatObject) {
        if (data) {
          data = data[field];
        }
      }
    }
    return data;
  }

  public getDataArray(): any {
    var data = this.data[this.fieldTable.name];
    let fields: any = !this.fieldTable.formatArrary ? undefined : this.fieldTable.formatArrary.fields;
    if (fields > 0) {
      for (const field of fields) {
        data = data[field];
      }
    }
    return data;
  }

  public getLink(): string {
    let url = "";
    for (const link of this.fieldTable.link) {
      url += link.isField ? this.getFieldLink(link.link) : link.link;
    }
    return url;
  }

  public getLinkArray(link: string): string {
    let url = this.fieldTable.link[0].link + "" + link;
    return url;
  }

  public getFieldLink(fields: string | string[]): string {
    let data;
    if (typeof fields === "string") {
      return this.data[fields];
    } else {
      for (const field of fields) {
        if (!data) {
          data = this.data[field];
        } else {
          data = data[field];
        }
      }
      return data;
    }
  }

  public isWordCountOver(data: string): boolean {
    if (data === undefined || data === null) {
      return false;
    }

    return data.length > 220;
  }

  public clickOpenDropDown(): void {
    this.isSeeMore = !this.isSeeMore;
  }
}
