/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';
import { OPTION_CHART_SOURCE_TYPE, FORMAT_DATE } from '../Constants';

declare var google: any;
declare var $: any;

@Component({
  selector: 'trend-item-chart-all',
  templateUrl: './TrendItemChartAll.component.html'
})
export class TrendItemChartAll implements OnInit {

  @Input()
  public trends: any;
  @Input()
  public chartId: string = "";

  private isLoadedChart: boolean = false;

  public view: any;
  public chart: any;
  public options: any = OPTION_CHART_SOURCE_TYPE;

  constructor() {
    $(window).resize(() => {
      if (this.isLoadedChart) {
        this.drawChart();
      }
    });
  }

  public ngOnInit() {
  }

  public ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    google.charts.load("current", {
      packages: ['corechart', 'geochart'],
      'mapsApiKey': 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY'
    });
    google.charts.setOnLoadCallback(() => {
      this.chart = new google.visualization.LineChart(
        document.getElementById(this.chartId));
      this.isLoadedChart = true;
      this.setView();
    });
  }

  private setView(): void {
    if (!this.trends || this.trends.length === 0) {
      return;
    }
    var trending: any = [
      ['day', 'count']
    ];

    for (const trend of this.trends) {
      trending.push([moment(trend._id).format(FORMAT_DATE), trend.count])
    }

    this.view = google.visualization.arrayToDataTable(trending);

    setTimeout(() => {
      this.drawChart();
    }, 100);
  }

  public drawChart() {
    this.options.colors = ["#ffffff"];
    this.chart.draw(this.view, this.options);
  }
}
