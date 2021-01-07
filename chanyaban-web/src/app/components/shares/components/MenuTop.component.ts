import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'menu-top',
  templateUrl: './MenuTop.component.html'
})
export class MenuTop implements OnInit {

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
  public isHideDateRange: boolean = false;
  @Input()
  public isBackDorpMobile: boolean = true;
  @Input()
  public keepDate: Date;
  @Input()
  public selectedDate: any; 
  @Output()
  public addSearch: EventEmitter<any> = new EventEmitter;
  @Output()
  public changeSelectdate: EventEmitter<any> = new EventEmitter;
  public rangesDate: any = {
      'วันนี้': [moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }), moment()],
      'เมื่อวาน': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
      '7 วันที่แล้ว': [moment().subtract(6, 'days'), moment()],
      '30 วันที่แล้ว': [moment().subtract(29, 'days'), moment()],
      'เดือนนี้': [moment().startOf('month'), moment().endOf('month')],
      'เดือนที่แล้ว': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  };
  public localeDate: any = {
      applyLabel: 'ตกลง',
      format: 'DD-MM-YY',
      separator: ' ถึง ',
      cancelLabel: 'ยกเลิก'
  };


  constructor() {
  }

  public ngOnInit() {
  }

  public getMinDate(): any {
    return this.keepDate ? moment(this.keepDate) : moment().subtract(1, 'years').add(1, 'days');
  }

  public getMaxDate(): any {
    return moment();
  }

  public onChangeSelectdate(): void {
    this.changeSelectdate.emit(this.selectedDate)
  }
}
