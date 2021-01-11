/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { fromEvent } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { DialogWarningComponent } from '../dialog/DialogWarningComponent.component';
import { KeywordFacade } from '../../../services/facade/KeywordFacade.service';
import { Router } from '@angular/router';
import { MatAutocomplete } from '@angular/material';
import * as moment from 'moment';
import { ObservableManager } from '../../../services/services';

declare var $: any;

@Component({
  selector: 'autocomp-search',
  templateUrl: './AutoCompSearch.component.html'
})
export class AutoCompSearch implements OnInit {

  private dialog: MatDialog;
  private setTimeout: any;

  @Input()
  public searchKeywordAll: any[] = [];
  @Input()
  public firstDay: Date;
  @Input()
  public lastDay: Date;
  @Input()
  public keywords: any[] = [];
  @Input()
  public entitys: any[] = [];
  @Input()
  public entityKeywords: any[] = [];
  @Input()
  public isAddSearch: boolean = true;
  @Input()
  public isBackDorpMobile: boolean = true;
  @Output()
  public addSearch: EventEmitter<any> = new EventEmitter;
  @ViewChild("inPut", { static: false })
  public inPut: ElementRef;
  @ViewChild("auto", { static: false })
  public auto: MatAutocomplete;
  public autoCompControl = new FormControl();
  public options: any[];
  public trending: any[];
  public isLoading: boolean;
  public isMobile: boolean = false;
  public isFocus: boolean = false;

  constructor(dialog: MatDialog, private keywordFacade: KeywordFacade,
    private router: Router, private observManager: ObservableManager) {
    this.dialog = dialog;
    this.options = [];
    this.isLoading = false;

    this.observManager.subscribe("refresh_search_all", (() => {
      this.searchAll();
    }));

    this.checkScreen();
    $(window).resize(() => {
      this.checkScreen();
    });
  }

  public ngOnInit() {
  }

  public ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class. 
    this.searchAll();
  }

  public ngOnDestroy(): void {
    clearTimeout(this.setTimeout);
  }

  public ngAfterViewInit(): void {
    fromEvent(this.inPut.nativeElement, 'keyup').pipe(
      // get value
      map((event: any) => {
        return event.target.value;
      })
      // if character length greater then 2
      // , filter(res => res.length > 2)
      // Time in milliseconds between key events
      , debounceTime(500)
      // If previous query is diffent from current   
      , distinctUntilChanged()
      // subscription for response
    ).subscribe((text: string) => {
      if (!text.trim()) {
        return;
      }
      this.isLoading = true;
      this.searchAllByValue().then((res) => {
        setTimeout(() => {
          this.isLoading = false;
          this.options = res;
          this.setLastDate(this.options);
        }, 500);
      }).catch((err) => {
      });
    });
  }

  private checkScreen(): void {
    if (window.innerWidth < 768) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }

  private dialogWarning(message: string): void {
    this.dialog.open(DialogWarningComponent, {
      data: {
        title: message,
        error: true
      }
    });
  }

  public setLastDate(data: any): void {
    for (const d of data) {
      if (moment(d.lastDate).isValid()) {
        d.lastDate = moment(d.lastDate).locale("th").fromNow();
      } else {
        d.lastDate = moment(new Date()).locale("th").fromNow();
      }
    }
  }

  public getSearchAllString(): string {
    var search = "";
    for (const keyword of this.searchKeywordAll) {
      if (search) {
        search += " / " + keyword.name;
      } else {
        search += keyword.name;
      }
    }
    return search;
  }

  public clearText(): void {
    this.autoCompControl.setValue("");
    this.inPut.nativeElement.value = "";
  }

  public opened(): void {
    this.isFocus = true;
  }

  public closed(): void {
    this.isFocus = false;
  }

  public isHas(data: any): boolean {
    for (const eK of this.searchKeywordAll) {
      if (eK._id === data._id) {
        return false;
      }
    }
    return true;
  }

  public clickFindPage(): void {
    if (this.searchKeywordAll.length > 0) {
      let params = "";
      for (const search of this.searchKeywordAll) {
        if (!search.personaType) {
          params += params !== "" ? "&&" + search.name : "" + search.name;
        } else {
          params += params !== "" ? "&&:" + search.name : ":" + search.name;
        }
      }
      this.router.navigateByUrl("/keyword/" + params);
    }
  }

  public selectItemSearch(): void {
    let param = "";
    let value = this.autoCompControl.value.trim();
    let options = this.options.concat(this.trending);
    for (const option of options) {
      if (value === option.data.name) {
        if (!option.data.personaType) {
          param = option.data.name;
        } else {
          param = ":" + option.data.name;
        }
        break;
      }
    }
    if (!param) {
      return;
    }
    this.isFocus = false;
    this.autoCompControl.setValue("");
    this.options = [];
    this.inPut.nativeElement.blur();
    this.router.navigateByUrl("/keyword/" + param);
  }

  public newTab(param: string): void {
    const url = this.router.serializeUrl(this.router.createUrlTree(["/keyword/" + param]));
    window.open(url, '_blank');
    event.stopPropagation();
  }

  public clickAddSearch(option): void {
    this.searchKeywordAll.push(option.data);
    this.options = [];
    this.addSearch.emit();
    this.autoCompControl.setValue("");
    setTimeout(() => {
      this.inPut.nativeElement.blur();
      this.isFocus = false;
    }, 1000);
  }

  public searchAllByValue(): Promise<any> {
    return new Promise((resolve, reject) => {
      let data = {
        search: this.autoCompControl.value ? this.autoCompControl.value.trim() : "",
        keywords: this.keywords,
        entitys: this.entitys,
        entityKeywords: this.entityKeywords,
        firstDay: this.firstDay,
        lastDay: this.lastDay
      };
      this.keywordFacade.searchAll(data).then((res) => {
        resolve(res);
      }).catch((err) => {
        this.isLoading = false;
        console.log(err);
        reject(err);
      });
    });
  }

  public searchAll(): void {
    clearTimeout(this.setTimeout);
    let data = {
      search: "",
      keywords: this.keywords,
      entitys: this.entitys,
      entityKeywords: this.entityKeywords,
      firstDay: this.firstDay,
      lastDay: this.lastDay
    };
    this.keywordFacade.searchAll(data).then((res) => {
      this.clearText();
      this.trending = res;
      this.setLastDate(this.trending);
      this.setTimeout = setTimeout(() => {
        this.searchAll();
      }, 300000);
    }).catch((err) => {
      this.isLoading = false;
      console.log(err);
    });
  }
}