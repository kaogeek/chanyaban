import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import * as moment from 'moment';
import { OPTION_CHART_BAR, FORMAT_DATE } from '../Constants'; 

declare var google: any;
declare var $: any;

@Component({
  selector: 'trend-chart-all',
  templateUrl: './TrendChartAll.component.html'
})
export class TrendChartAll implements OnInit {

  @Input()
  public trendingKeyword: any = [];
  @Input()
  public title: string = "จำนวนครั้งที่ถูกกล่าวถึง";

  private timeoutPreload: any;
  private chart: any;
  private isGenChart: boolean = false;
  private options = OPTION_CHART_BAR;

  constructor() {
    $(window).resize(() => {
      if (this.isGenChart) {
        this.drawBarChart(false);
      }
    });
  }

  public ngOnInit() {
  }

  public ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (this.isGenChart) {
      this.startPreload();
    }
  }

  public ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    google.charts.load("current", {
      packages: ['corechart']
    });
    google.charts.setOnLoadCallback(() => {
      this.chart = new google.visualization.ColumnChart(
        document.getElementById('chart_div'));
      this.startPreload();
    });
  }

  private startPreload(): void {
    this.drawBarChart(true);
    if (this.trendingKeyword && this.trendingKeyword.length > 0) {
      return this.stopPreload();
    }
    this.timeoutPreload = setTimeout(() => {
      this.startPreload();
    }, 500);
  }

  private stopPreload(): void {
    clearTimeout(this.timeoutPreload);
    this.isGenChart = true;
    setTimeout(() => {
      this.drawBarChart(false);
    }, 500);
  }

  private getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  private drawBarChart(isPreload: boolean) {
    var trending: any = [
      ['', 'กล่าวถึง', { role: 'style' }]
    ];
    if (!isPreload) {
      for (const trend of this.trendingKeyword) {
        trending.push([moment(trend._id).format(FORMAT_DATE), trend.count, 'color: #d4692c;'])
      }
    } else {
      for (let index = 29; index > -1; index--) {
        trending.push([moment().subtract(index, 'days').format(FORMAT_DATE), this.getRndInteger(0, 75), 'color: #94969a;'])
      }
    }

    var data = google.visualization.arrayToDataTable(trending);

    var view = new google.visualization.DataView(data);
    view.setColumns([0, 1,
      {
        calc: "stringify",
        sourceColumn: 1,
        type: "string",
        role: "annotation"
      },
      2]);

    this.options = OPTION_CHART_BAR;
    this.options.animation.duration = isPreload ? 250 : 1000;
    this.options.vAxis.textStyle.color = isPreload ? "#94969a" : "#d4692c";
    this.options.tooltip.textStyle.color = isPreload ? "#94969a" : "#d4692c";

    // Instantiate and draw our chart, passing in some options.
    this.chart.draw(view, this.options);
  }
}
