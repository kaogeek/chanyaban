import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';  
import * as moment from 'moment';
import { Router } from '@angular/router';
import { AbstractNewTab } from '../../pages/web/AbstractNewTab';

declare var google: any;
declare var $: any;

@Component({
  selector: 'trend-news-agency-chart-compare',
  templateUrl: './TrendNewsAgencyChartAndCompare.component.html'
})
export class TrendNewsAgencyChartAndCompare extends AbstractNewTab implements OnInit {

  @Input()
  public dataNewsAgencyCompare: any;
  @Input()
  public trendingTopNewsAgency: any[] = [];
  @Input()
  public trendingTopJouranlist: any[] = [];
  @Input()
  public trendingLeastNewsAgency: any[] = [];
  @Input()
  public trendingLeastJouranlist: any[] = [];
  @Input()
  public selectNewsAgencyCompare: any = "เปรียบเทียบกับ";
  @Input()
  public selectNewsAgencyChart: string = "ถูกพูดถึงมากสุดโดย";
  @Input()
  public listNewsAgencyChartType: string[] = [
    "ถูกพูดถึงมากสุดโดย",
    "ถูกพูดถึงน้อยสุดโดย"
  ];
  @Input()
  public isLoadingTopLeast: boolean = false;
  @Input()
  public isLoadingCompare: boolean = false;
  @Output()
  public selectedNewsAgencyCompare: EventEmitter<any> = new EventEmitter(); 

  public listChartAgenJouran: any = {
    newsAgencys: [],
    jouranlist: []
  };

  constructor(router: Router) {
    super(router);
  }

  public ngOnInit() { 
  } 

  public selectedNewsAgencyChart(): void {
    if (this.selectNewsAgencyChart === "ถูกพูดถึงมากสุดโดย") {
      this.listChartAgenJouran = {
        newsAgencys: this.trendingTopNewsAgency,
        jouranlist: this.trendingTopJouranlist
      }
    } else {
      this.listChartAgenJouran = {
        newsAgencys: this.trendingLeastNewsAgency,
        jouranlist: this.trendingLeastJouranlist
      }
    }
    setTimeout(() => {
      this.drawNewsAgencyChart();
    }, 30);
  }

  // public selectedNewsAgencyCompare(): void {
  //   this.keywordFacade.getNewsAgencysCompare(this.selectNewsAgencyCompare, this.find).then((res) => {
  //     this.dataNewsAgencyCompare = res;
  //     setTimeout(() => {
  //       this.drawNewsAgencyCompareChart();
  //     }, 30);
  //   }).catch((err) => {
  //     console.log(err);
  //   });
  // }

  public drawNewsAgencyCompareChart() {
    var trending: any = [['', 'กล่าวถึง']];
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
          color: "#464545"
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
    for (const trend of this.dataNewsAgencyCompare.date) {
      trending.push([moment(trend._id.date).format(this.FORMAT_DATE), trend.count])
      if (options.vAxis.maxValue < trend.count) {
        options.vAxis.maxValue = trend.count;
      }
    }
    var data = google.visualization.arrayToDataTable(trending);

    var chart = new google.visualization.LineChart(document.getElementById('newsagency_chart_compare'));
    chart.draw(data, options);
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
    for (const newsAgency of this.listChartAgenJouran.newsAgencys) {
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
