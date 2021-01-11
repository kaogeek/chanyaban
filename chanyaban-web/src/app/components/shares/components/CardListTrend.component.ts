/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

import { Component, OnInit, Input, EventEmitter, SimpleChanges, Output } from '@angular/core';
import * as moment from 'moment';
import { OPTION_CHART_SOURCE_TYPE } from '../Constants';
import { Router } from '@angular/router';
import { AbstractNewTab } from '../../pages/web/AbstractNewTab';

declare var google: any;
declare var $: any;

@Component({
  selector: 'card-list-trend',
  templateUrl: './CardListTrend.component.html'
})
export class CardListTrend extends AbstractNewTab implements OnInit {

  @Input()
  public listTrending: any[];
  @Input()
  public keywordTop: any[];
  @Input()
  public newsAgencys: any[];
  @Input()
  public listEntityRelate: any[];
  @Input()
  public countPreLoad: any[] = [1, 1, 1, 1];
  @Input()
  public selectedDate: any = {
    startDate: moment().subtract(6, 'days').set({ hour: 0, minute: 0, second: 0, millisecond: 0 }),
    endDate: moment()
  };
  @Input()
  public isLoadTrend: boolean = false;
  @Input()
  public isLoadMoreTrend: boolean = false;
  @Input()
  public showLoadMoreTrend: boolean = false;
  @Input()
  public isLoadKeywordTop: boolean = false;
  @Input()
  public isLoadNewsAgency: boolean = false;
  @Output()
  public clickLoadMoreTrend: EventEmitter<any> = new EventEmitter();
  @Output()
  public clickTrendDetail: EventEmitter<any> = new EventEmitter();

  private timeoutSourceTypeTrend: any;
  private isLoadedChart: boolean = false;

  constructor(router: Router) {
    super(router);
    $(window).resize(() => {
      if (this.isLoadedChart) {
        this.drawSourceTypeTrendChart();
        if (this.newsAgencys && this.newsAgencys.length > 0) {
          this.drawNewsAgencyChart();
        }
      }
    });
  }

  public ngOnInit() {
  }

  public ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (this.isLoadedChart) {
      if (this.newsAgencys && this.newsAgencys.length > 0) {
        setTimeout(() => {
          this.drawNewsAgencyChart();
        }, 30);
      }
    }
  }

  public ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.isLoadedChart = false;
  }

  public ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    google.charts.load("current", {
      packages: ['corechart']
    });
    google.charts.setOnLoadCallback(() => {
      this.isLoadedChart = true;
      this.drawSourceTypeTrendChart();
    });
  }

  private queryParamsDate(): any {
    return {
      queryParams: {
        start: moment(this.selectedDate.startDate).format(this.FORMAT_DATE),
        end: moment(this.selectedDate.endDate).format(this.FORMAT_DATE),
      }
    }
  }

  public newTab(param: string): void {
    event.stopPropagation();
    const url = this.router.serializeUrl(this.router.createUrlTree(["/keyword/" + this.encodeURL(param)], this.queryParamsDate()));
    window.open(url, '_blank');
  }

  public newTabWithEntity(trend: string, entityRelate: string): void {
    const url = this.router.serializeUrl(this.router.createUrlTree(["/keyword/" + this.encodeURL(trend + "&&:" + entityRelate)], this.queryParamsDate()));
    window.open(url, '_blank');
  }

  public newTabWithKeyword(trend: string, keyword: string): void {
    const url = this.router.serializeUrl(this.router.createUrlTree(["/keyword/" + this.encodeURL(trend + "&&" + keyword)], this.queryParamsDate()));
    window.open(url, '_blank');
  }

  public newTabNewsAgencyWithTrend(trend: any, newsAgencyName: string): void {
    let isEntity = trend.keywords ? "/:" : "/";
    const url = this.router.serializeUrl(this.router.createUrlTree(["/agency/" + this.encodeURL(newsAgencyName) + isEntity + this.encodeURL(trend)], this.queryParamsDate()));
    window.open(url, '_blank');
  }

  public newTabSourceTypeWithTrend(trend: any, sourceType: string): void {
    event.stopPropagation();
    let isEntity = trend.keywords ? "/:" : "/";
    const url = this.router.serializeUrl(this.router.createUrlTree(["/channel/" + this.encodeURL(sourceType) + isEntity + this.encodeURL(trend)], this.queryParamsDate()));
    window.open(url, '_blank');
  }

  public selectTrend(dataTrend: any): void {
    let index = 0;
    for (const entity of this.listTrending) {
      if (dataTrend._id === entity._id) {
        this.listTrending[index].isSelected = !this.listTrending[index].isSelected;
        if (this.listTrending[index].isSelected) {
          this.clickTrendDetail.emit(this.listTrending[index]);
        }
      } else {
        this.listTrending[index].isSelected = false;
      }
      index++;
    }
  }

  public drawSourceTypeTrendChart() {
    if (!this.listTrending || this.listTrending.length === 0 || !this.listTrending[0].sourceType || !this.isLoadedChart) {
      this.timeoutSourceTypeTrend = setTimeout(() => {
        this.drawSourceTypeTrendChart();
      }, 300);
      return;
    }
    clearTimeout(this.timeoutSourceTypeTrend);
    var trending: any = [];
    var options = OPTION_CHART_SOURCE_TYPE;
    let index = 0;
    for (const sourceType of this.listTrending[0].sourceType) {
      if (sourceType._id === "web") {
        options.colors = ["#d4d4d4"];
      } else if (sourceType._id === "facebook") {
        options.colors = ["#45619d"];
      } else if (sourceType._id === "twitter") {
        options.colors = ["#51a5e3"];
      }
      for (const trend of sourceType.date) {
        if (!trending[index]) {
          trending.push([['', 'กล่าวถึง']])
        }
        if (trend.count > options.vAxis.maxValue) {
          options.vAxis.maxValue = trend.count;
        }
        trending[index].push([moment(trend._id.date).format(this.FORMAT_DATE), trend.count])
      }
      var data = google.visualization.arrayToDataTable(trending[index]);

      var chart = new google.visualization.LineChart(document.getElementById('sourceTypeTrendChart' + (index + 1)));
      chart.draw(data, options);
      index++;
    }
  }

  public drawNewsAgencyChart() {
    var trending: any = [];
    var options = {
      top: 0,
      left: 0,
      backgroundColor: "transparent",
      width: "100%",
      height: "100%",
      animation: {
        duration: 2000,
        easing: 'out',
        startup: true
      },
      colors: ["#d4692c"],
      colorAxis: {
        minValue: 0, colors: ['#ce9e83', '#d4692d']
      },
      chartArea: { width: '80%', height: '90%' },
      legend: { position: 'none' },
      vAxis: {
        format: '0',
        maxValue: 10,
        minValue: 0,
        textStyle: {
          fontName: "prompt200",
          color: "#d4692c"
        },
        gridlines: {
          color: "#464545",
          count: -1
        }
      },
      tooltip: {
        textStyle: {
          fontName: "prompt200",
          color: '#d4692c',
          fontSize: 12
        }
      }
    };
    let index = 0;
    for (const newsAgency of this.newsAgencys) {
      for (const trend of newsAgency.date) {
        if (!trending[index]) {
          trending.push([['', 'กล่าวถึง']])
        }
        trending[index].push([moment(trend._id.date).format(this.FORMAT_DATE), trend.count])
        if (options.vAxis.maxValue < trend.count) {
          options.vAxis.maxValue = trend.count;
        }
      }
      var data = google.visualization.arrayToDataTable(trending[index]);

      var chart = new google.visualization.LineChart(document.getElementById('newsagency_chart' + (index + 1)));
      chart.draw(data, options);
      index++;
    }
  }
}
