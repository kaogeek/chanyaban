import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import * as moment from 'moment';
import { OPTION_CHART_SOURCE_TYPE } from '../Constants';
import { Router } from '@angular/router';
import { AbstractNewTab } from '../../pages/web/AbstractNewTab';

declare var google: any;
declare var $: any;

@Component({
  selector: 'card-counter-source-type',
  templateUrl: './CardCounterSourceType.component.html'
})
export class CardCounterSourceType extends AbstractNewTab implements OnInit {

  @Input()
  public trendingSourceType: any[];
  @Input()
  public totalNews: number;
  public timeoutSourceType: any;
  private isLoadedChart: boolean = false;

  constructor(router: Router) {
    super(router);
    $(window).resize(() => {
      if (this.isLoadedChart) {
        this.drawSourceTypeChart();
      }
    });
  }

  public ngOnInit() {
  }

  public ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class. 
    this.drawSourceTypeChart();
  }

  public ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    google.charts.load("current", {
      packages: ['corechart']
    });
    google.charts.setOnLoadCallback(() => {
      this.isLoadedChart = true;
    });
  }

  public newTabSourceType(sourceType: string): void {
    const url = this.router.serializeUrl(this.router.createUrlTree(["/channel/"+sourceType]));
    window.open(url, '_blank');
  }

  public drawSourceTypeChart() {
    if (!this.trendingSourceType || this.trendingSourceType.length === 0 || !this.isLoadedChart) {
      this.timeoutSourceType = setTimeout(() => {
        this.drawSourceTypeChart();
      }, 300);
      return;
    }
    clearTimeout(this.timeoutSourceType); 
    var trending: any = [];
    var options = OPTION_CHART_SOURCE_TYPE;
    let index = 0;
    for (const sourceType of this.trendingSourceType) {
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

      var chart = new google.visualization.LineChart(document.getElementById('sourceTypeChart' + (index + 1)));
      chart.draw(data, options);
      index++;
    }
  }
}
