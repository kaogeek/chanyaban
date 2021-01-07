import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TrendFacade } from '../../../services/services';
import * as moment from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { Title, Meta } from '@angular/platform-browser';
import { OPTION_CHART_SOURCE_TYPE } from '../../shares/Constants';
import { AbstractPage } from './AbstractPage';

const PAGE_NAME: string = 'trend';
const LOADLIMIT: number = 10;

declare var google: any;
declare var $: any;

@Component({
  selector: 'app-trend',
  templateUrl: './TrendPage.component.html'
})
export class TrendPage extends AbstractPage implements OnInit {

  public static readonly PAGE_NAME: string = PAGE_NAME;

  private route: ActivatedRoute;

  public listTrending: any[];
  public updateTime: Date;
  public isLoadTrend: boolean = false;
  public isLoadMoreTrend: boolean = false;
  public showLoadMoreTrend: boolean = false;
  public isLoadKeywordTop: boolean = false;
  public isLoadNewsAgency: boolean = false;

  public paramsDateStr: string = "";
  public isInitial: boolean;
  public isLoadedChart: boolean;
  public position: number;

  public config: SwiperConfigInterface;

  constructor(route: ActivatedRoute, router: Router,
    private trendFacade: TrendFacade, private _snackBar: MatSnackBar,
    private titleService: Title, private meta: Meta) {
    super(PAGE_NAME, router);
    this.route = route;
    this.setTitleService();

    $(window).resize(() => {
      if (this.isLoadedChart) {
        this.drawSourceTypeTrendChart();
        if (this.data.trendingSourceType && this.data.trendingSourceType.length > 0) {
          this.drawSourceTypeChart();
        }
        if (this.data.newsAgencys && this.data.newsAgencys.length > 0) {
          this.drawNewsAgencyChart();
        }
      }
    });

    var webMain = $("#webMain");
    webMain.scrollTop(0);
    this.position = webMain.scrollTop();
    webMain.scroll(() => {
      var scroll = webMain.scrollTop();
      var width = webMain.width();
      var navbar = document.getElementById("navbar");
      if (navbar) {
        if (width < 768) {
          if (scroll > this.position) {
            navbar.style.top = "-120pt";
            $(".wrapper-header-trend").each(function () {
              $(this).removeClass("mobile");
            });
          } else {
            navbar.style.top = "0";
            $(".wrapper-header-trend").each(function () {
              $(this).addClass("mobile");
            });
          }
        } else {
          navbar.style.top = "0";
          $(".wrapper-header-trend").each(function () {
            $(this).removeClass("mobile");
          });
        }
      }
      this.position = scroll;
    });

    //   this.route.params.subscribe(async (params) => { 
    //     this.setRangeDate(); 
    //     this.trendFacade.searchAll({ entityTypeName: this.entityTypeName }).then((res) => {
    //       this.isInitial = true;
    //       this.entityType = res;
    //       this.setTitleService(); 
    //     });
    //   });

    //   this.route.queryParams.subscribe((params) => {
    //     if (this.isInitial) {
    //       this.setRangeDate(params);
    //       this.find.firstDay = this.selectedDate.startDate.toDate();
    //       this.find.lastDay = this.selectedDate.endDate.toDate();
    //       // this.loadDataPage();
    //     }
    //   });
  }

  public ngOnInit(): void {
    this.clearData(); 
    this.trendFacade.Trend(0).then((res) => {
      setTimeout(() => {
        this.isInitial = true;
        this.isLoadTrend = false;
        this.listTrending = res.listTrending ? res.listTrending : res;
        this.updateTime = res.updateTime;
        if (this.listTrending && this.listTrending.length < LOADLIMIT) {
          this.showLoadMoreTrend = false;
        } else {
          this.showLoadMoreTrend = true;
        }
        setTimeout(() => {
          this.drawSourceTypeTrendChart();
        }, 100);
      }, 500);
    }).catch((err) => {
      this.isInitial = true;
      this.isLoadMoreTrend = false;
      console.log(err);
    });
  }

  public ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class. 
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

  private setTitleService(): void {
    let urlTitle = "จรรยาบรรณ - ที่อยู่ในกระแส";
    this.titleService.setTitle(urlTitle);
  }

  private clearData(): void {
    this.data = {
      trendingEntityType: [],
      entitys: [],
      trendingSourceType: undefined
    }
    this.data.totalNews = undefined;
    this.isLoadTrend = true;
    this.isLoadMoreTrend = false;
    this.showLoadMoreTrend = false;
  }

  public clickLoadMore(): void {
    if (!this.showLoadMoreTrend) {
      return;
    }
    this.isLoadMoreTrend = true;
    this.trendFacade.Trend(this.listTrending.length).then((res) => {
      this.isLoadMoreTrend = false;
      this.listTrending = this.listTrending.concat(res.listTrending);
      this.updateTime = res.updateTime;
      if (res < LOADLIMIT) {
        this.showLoadMoreTrend = false;
      }
      setTimeout(() => {
        this.drawSourceTypeTrendChart();
      }, 100);
    }).catch((err) => {
      this.isInitial = true;
      this.isLoadMoreTrend = false;
      console.log(err);
    });
  }

  openSnackBar(name: string) {
    this._snackBar.open("มีการค้นหา " + name + " แล้ว", "ปิด", {
      duration: 2000,
    });
  }

  public changeSelectdate(): void {
    // if (!this.isInitial && this.find !== {}) { 
    //   return;
    // }
    // this.router.navigateByUrl("/type/" + this.addParamsDate(this.encodeURL(this.entityType.name)));
  }

  public newTab(param: string): void {
    event.stopPropagation();
    const url = this.router.serializeUrl(this.router.createUrlTree(["/keyword/" + this.encodeURL(param)], this.queryParamsDate()));
    window.open(url, '_blank');
  }

  public newTabWithEntity(entity: string, entityRelate: string): void {
    const url = this.router.serializeUrl(this.router.createUrlTree(["/keyword/" + this.encodeURL(entity + "&&:" + entityRelate)], this.queryParamsDate()));
    window.open(url, '_blank');
  }

  public newTabWithKeyword(entity: string, keyword: string): void {
    const url = this.router.serializeUrl(this.router.createUrlTree(["/keyword/" + this.encodeURL(entity + "&&" + keyword)], this.queryParamsDate()));
    window.open(url, '_blank');
  }

  public selectTrend(dataTrend: any): void {
    let index = 0;
    for (const entity of this.listTrending) {
      if (dataTrend._id === entity._id) {
        this.listTrending[index].isSelected = !this.listTrending[index].isSelected;
        if (this.listTrending[index].isSelected) {
          this.loadDataPageKeywordTop(this.listTrending[index]._id, this.listTrending[index].keywords);
          this.loadDataPageNewsAgency(this.listTrending[index]._id, this.listTrending[index].keywords);
        }
      } else {
        this.listTrending[index].isSelected = false;
      }
      index++;
    }
  }

  public clickTrendDetail(dataTrend: any): void {
    this.loadDataPageKeywordTop(dataTrend._id, dataTrend.keywords);
    this.loadDataPageNewsAgency(dataTrend._id, dataTrend.keywords);
  }

  private loadDataPageKeywordTop(keyword: string, entityKeywords: any): void {
    let find = {
      keyword: entityKeywords ? undefined : keyword,
      entityKeywords: entityKeywords
    };
    this.isLoadKeywordTop = true;
    this.data.keywordTop = undefined;
    this.trendFacade.getKeywordTop(find).then((res) => {
      this.isLoadKeywordTop = false;
      this.data.keywordTop = res
    }).catch((err) => {
      this.isLoadKeywordTop = false;
      console.log(err);
    });
  }

  private loadDataPageNewsAgency(id: string, entityKeywords: any): void {
    let find = {
      entityId: entityKeywords ? id : undefined,
      keyword: entityKeywords ? undefined : id,
      entityKeywords: entityKeywords,
    };
    this.isLoadNewsAgency = true;
    this.data.newsAgencys = undefined;
    this.data.listEntityRelate = undefined;
    this.trendFacade.getNewsAgency(find).then((res) => {
      this.isLoadNewsAgency = false;
      this.data.newsAgencys = res.newsAgency;
      this.data.listEntityRelate = res.entityTop;
      setTimeout(() => {
        this.drawNewsAgencyChart();
      }, 100);
    }).catch((err) => {
      this.isLoadNewsAgency = false;
      console.log(err);
    });
  }

  public drawSourceTypeChart() {
    var trending: any = [];
    var options = OPTION_CHART_SOURCE_TYPE;
    let index = 0;
    for (const sourceType of this.data.trendingSourceType) {
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

  public drawSourceTypeTrendChart() {
    if (!this.listTrending || this.listTrending.length === 0 || !this.listTrending[0].sourceType) {
      return;
    }
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
    for (const newsAgency of this.data.newsAgencys) {
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