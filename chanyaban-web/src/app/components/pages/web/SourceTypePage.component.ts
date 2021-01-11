/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SourceTypeFacade, KeywordFacade } from '../../../services/services';
import * as moment from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title, Meta } from '@angular/platform-browser';
import { AbstractNewsPage } from './AbstractNewsPage';

const PAGE_NAME: string = 'channel';

declare var google: any;
declare var $: any;

@Component({
  selector: 'app-source-type',
  templateUrl: './SourceTypePage.component.html'
})
export class SourceTypePage extends AbstractNewsPage implements OnInit {

  public static readonly PAGE_NAME: string = PAGE_NAME;

  private route: ActivatedRoute;

  public timeoutNewsAgency: any;
  public listSelectNewsAgency: any[] = [];
  public search: string;
  public sourceType: any;
  public sourceTypeName: string;
  public keywordRelates: string[] = [];
  public searchKeywordAllWithSourceType: any[] = [];

  private trendChartMap: any;

  public selectNewsAgencyCompare: any = "เปรียบเทียบกับ";
  public dataNewsAgencyCompare: any;
  public selectNewsAgencyChart: string = "ถูกพูดถึงมากสุดโดย";
  public listNewsAgencyChartType: string[] = [
    "ถูกพูดถึงมากสุดโดย",
    "ถูกพูดถึงน้อยสุดโดย"
  ];
  public listChartAgenJouran: any = {
    newsAgencys: [],
    jouranlist: []
  };

  public paramsDateStr: string = "";
  public isInitial: boolean;
  public position: number;
  public isLoadingEntity: boolean = false;
  public isLoadingKeywordTop: boolean = false;

  constructor(route: ActivatedRoute, router: Router,
    private sourceTypeFacade: SourceTypeFacade, private _snackBar: MatSnackBar,
    private titleService: Title, private meta: Meta, private keywordFacade: KeywordFacade) {
    super(PAGE_NAME, router);
    this.route = route;

    $(window).resize(() => {
      if (this.listChartAgenJouran.newsAgencys && this.listChartAgenJouran.newsAgencys.length > 0) {
        this.drawNewsAgencyChart();
        this.drawMapChart();
      }
    });

    this.route.params.subscribe(async (params) => {
      var webMain = $("#webMain");
      webMain.scrollTop(0);
      this.position = webMain.scrollTop();
      webMain.scroll(() => {
        var scroll = webMain.scrollTop();
        var width = webMain.width();
        var navbar = document.getElementById("navbar");
        var pathNewsAgencyTop = document.getElementById("pathNewsAgencyTop");
        if (navbar && pathNewsAgencyTop) {
          if (scroll > 150) {
            pathNewsAgencyTop.classList.add("show-wrapper-path");
          } else {
            pathNewsAgencyTop.classList.remove("show-wrapper-path");
          }
          if (width < 768) {
            if (scroll > this.position) {
              pathNewsAgencyTop.style.top = "0";
              navbar.style.top = "-120pt";
              $(".date-time").each(function () {
                $(this).removeClass("mobile");
              });
            } else {
              pathNewsAgencyTop.style.top = "45pt";
              navbar.style.top = "0";
              $(".date-time").each(function () {
                $(this).addClass("mobile");
              });
            }
          } else {
            pathNewsAgencyTop.style.top = "50pt";
            navbar.style.top = "0";
            $(".date-time").each(function () {
              $(this).removeClass("mobile");
            });
          }
        }
        this.position = scroll;
      });
      this.setRangeDate();
      this.isInitial = false;
      this.sourceType = undefined;
      this.searchKeywordAll = [];
      this.searchKeywordAllWithSourceType = [];
      this.sourceTypeName = params.sourceType ? decodeURIComponent(params.sourceType) : "";
      this.sourceTypeFacade.findNewsAgencys({ sourceTypeName: this.sourceTypeName }).then((res) => {
        this.sourceType = res;
        this.searchKeywordAllWithSourceType = [this.sourceType];
        if (!this.sourceType) {
          this.isInitial = true;
          return;
        }
        if (params.keyword) {
          let keyEntitys = this.setFindKeywordEntity(params.keyword ? decodeURIComponent(params.keyword) : "");
          this.keywordFacade.findKeywords({ keyEntitys: keyEntitys }).then((res) => {
            this.isInitial = true;
            this.searchKeywordAll = res.searchKeywordAll;
            this.searchKeywordAllWithSourceType = this.searchKeywordAllWithSourceType.concat(this.searchKeywordAll);
            this.setTitleService();
            this.notFind = res.notFind;
            this.listEntityKeyword = this.setListEntityKeywordsShow(res.entitys);
            this.find = {
              sourceTypeId: this.sourceType._id,
              keywords: this.setKeywords(res.keywords),
              entityKeywords: this.setEntityKeywords(res.entitys),
              entitys: this.setEntitys(res.entitys),
              firstDay: this.selectedDate.startDate.toDate(),
              lastDay: this.selectedDate.endDate.toDate()
            };
            if (this.notFind.length > 0) {
              return;
            }
            this.loadDataPage();
          });
        } else {
          this.isInitial = true;
          this.setTitleService();
          this.find = {
            sourceTypeId: this.sourceType._id,
            keywords: [],
            entityKeywords: [],
            entitys: [],
            firstDay: this.selectedDate.startDate.toDate(),
            lastDay: this.selectedDate.endDate.toDate()
          };
          this.loadDataPage();
        }
      });
    });

    this.route.queryParams.subscribe((params) => {
      if (this.isInitial) {
        this.setRangeDate(params);
        this.find.firstDay = this.selectedDate.startDate.toDate();
        this.find.lastDay = this.selectedDate.endDate.toDate();
        this.loadDataPage();
      }
    });
  }

  public ngOnInit(): void {
  }

  public ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class. 
  }


  public ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    google.charts.load("current", {
      packages: ['corechart', 'geochart'],
      'mapsApiKey': 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY'
    });
    google.charts.setOnLoadCallback(() => {
      this.trendChartMap = new google.visualization.GeoChart(
        document.getElementById('regions_div'));
      this.drawMapChart();
    });
  }

  private setTitleService(): void {
    if (this.sourceTypeName) {
      let urlTitle = "จรรยาบรรณ - ";
      if (this.sourceTypeName === "web") {
        urlTitle += "ช่องทางเว็บไซต์ (website)";
      } else if (this.sourceTypeName === "facebook") {
        urlTitle += "ช่องทางเว็บไซต์ (facebook)";
      } else if (this.sourceTypeName === "twitter") {
        urlTitle += "ช่องทางเว็บไซต์ (twitter)";
      }
      if (this.searchKeywordAll && this.searchKeywordAll.length > 0) {
        let lastKeyword = this.searchKeywordAll[this.searchKeywordAll.length - 1];
        urlTitle += lastKeyword.isTag ? " - #" + lastKeyword.name : " - " + lastKeyword.name;
      }
      this.titleService.setTitle(urlTitle);
    }
  }

  private setFindKeywordEntity(params: string): any[] {
    let keyEntitys = {};
    let splits = params.split("&&");
    for (const split of splits) {
      if (split.includes(":")) {
        let splitEntity = split.split(":");
        if (splitEntity.length > 0) {
          keyEntitys[splitEntity[1]] = {
            isKeyword: false,
            name: splitEntity[1]
          };
        }
      } else {
        keyEntitys[split] = {
          isKeyword: true,
          name: split
        };
      }
    }
    return Object.values(keyEntitys);
  }

  private clearData(): void {
    this.clearNews();
    this.data = {
      keywordRelates: [],
      news: [],
      trendingSourceTypeAll: [],
      keywordsTop: []
    }
    this.data.totalNews = undefined;
    this.dataNewsAgencyCompare = undefined;
    this.selectNewsAgencyCompare = "เปรียบเทียบกับ";
  }

  private loadDataPageCount(): void {
    this.sourceTypeFacade.getInfoCount(this.find).then((res) => {
      this.data.keepDate = res.keepDate;
      this.data.lastDate = moment(res.lastDate).isValid() ? moment(res.lastDate).locale('th').fromNow() : undefined;
      this.data.totalNews = res.totalNews;
      this.data.countFromSource = res.countFromSource;
      this.loadDataPageTrendinSourceTypeAllChart();
    }).catch((err) => {
      console.log(err);
    });
  }

  private loadDataPageTrendinSourceTypeAllChart(): void {
    this.sourceTypeFacade.getTrendinSourceTypeAllChart(this.find).then((res) => {
      this.data.trendingSourceTypeAll = res;
    }).catch((err) => {
      console.log(err);
    });
  }

  private loadDataPageTrendingMapChart(): void {
    this.sourceTypeFacade.getTrendingMapChart(this.find).then((res) => {
      this.data.trendingMap = res;
      setTimeout(() => {
        this.drawMapChart();
      }, 100);
    }).catch((err) => {
      console.log(err);
    });
  }

  private loadDataPageTrendingNewsAgencyChart(): void {
    this.sourceTypeFacade.getTrendingNewsAgencyChart(this.find).then((res) => {
      this.data.trendingTopNewsAgency = res.trendingTopNewsAgency;
      this.data.trendingLeastNewsAgency = res.trendingLeastNewsAgency;
      this.listChartAgenJouran = {
        newsAgencys: this.data.trendingTopNewsAgency,
        jouranlist: this.data.trendingTopJouranlist
      }
      setTimeout(() => {
        this.drawNewsAgencyChart();
      }, 100);
    }).catch((err) => {
      console.log(err);
    });
  }

  private loadDataPageKeywordTop(): void {
    this.isLoadingKeywordTop = true;
    this.sourceTypeFacade.getKeywordTop(this.find).then((res) => {
      this.isLoadingKeywordTop = false;
      this.data.keywordTop = res;
      this.find.keywordTop = res;
      this.loadDataPageKeywordRelates();
    }).catch((err) => {
      this.isLoadingKeywordTop = false;
      console.log(err);
    });
  }

  private loadDataPageKeywordRelates(): void {
    this.sourceTypeFacade.getKeywordRelates(this.find).then((res) => {
      this.data.keywordRelates = res;
    }).catch((err) => {
      console.log(err);
    });
  }

  private loadDataPageNewsAgencyCompare(): void {
    this.keywordFacade.getNewsAgency().then((res) => {
      this.data.listNewsAgency = res;
    }).catch((err) => {
      console.log(err);
    });
  }

  private loadDataPageNewsAgencys(): void {
    this.sourceTypeFacade.getNewsAgencyRelate(this.find).then((newsAgecnys: any) => {
      this.listSelectNewsAgency = [];
      this.data.listNewsAgencysWithNews = newsAgecnys;
      for (const newsAgency of newsAgecnys) {
        if (newsAgency.isActive) {
          this.listSelectNewsAgency.push(newsAgency._id);
        }
      }
      this.clearNews();
      this.searchRelateNews();
    }).catch((err) => {
      console.log(err);
    });
  }

  private loadDataPageEntityTop(): void {
    this.isLoadingEntity = true;
    this.sourceTypeFacade.getEntityTop(this.find).then((res) => {
      this.isLoadingEntity = false;
      this.data.entityTopRelated = res;
    }).catch((err) => {
      this.isLoadingEntity = false;
      console.log(err);
    });
  }

  public loadDataPage(): void {
    this.clearData();
    this.find.lastDay.setHours(23);
    this.find.lastDay.setMinutes(59);
    this.find.lastDay.setSeconds(59);
    this.isloadNews = true;
    this.loadDataPageCount();
    this.loadDataPageNewsAgencys();
    this.loadDataPageNewsAgencyCompare();
    this.loadDataPageKeywordTop();
    this.loadDataPageEntityTop();
    this.loadDataPageTrendingMapChart();
    this.loadDataPageTrendingNewsAgencyChart();
  }

  public clickSearchAll(i: number): void {
    let params = "";
    let index = 0;
    for (const search of this.searchKeywordAll) {
      if (index <= i) {
        if (search.personaType) {
          params += params !== "" ? "&&:" + search.name : ":" + search.name;
        } else {
          params += params !== "" ? "&&" + search.name : search.name;
        }
      }
      index++;
    }
    params = this.addParamsDate(params);
    this.router.navigateByUrl("/channel/" + this.encodeURL(this.sourceTypeName) + "/" + this.encodeURL(params));
  }

  public clickToSourceType(): void {
    this.router.navigateByUrl("/channel/" + this.encodeURL(this.sourceTypeName) + this.addParamsDate(""));
  }

  public clickAddSearch(): void {
    let params = "";
    for (const search of this.searchKeywordAll) {
      if (search.personaType) {
        params += params !== "" ? "&&:" + search.name : ":" + search.name;
      } else {
        params += params !== "" ? "&&" + search.name : search.name;
      }
    }
    params = this.addParamsDate(params);
    this.router.navigateByUrl("/channel/" + this.encodeURL(this.sourceTypeName) + "/" + this.encodeURL(params));
  }

  public clickEntityType(param: string): void {
    if (!param && param.trim() === "") {
      return;
    }
    if (param.includes("/")) {
      param = param.replace("/", "%(|)");
    }
    const url = this.router.serializeUrl(this.router.createUrlTree(["/type/" + this.encodeURL(param)]));
    window.open(url, '_blank');
  }

  public newTab(param: string): void {
    const url = this.router.serializeUrl(this.router.createUrlTree(["/channel/" + this.encodeURL(this.sourceTypeName) + "/" + this.encodeURL(param)]));
    window.open(url, '_blank');
  }

  openSnackBar(name: string) {
    this._snackBar.open("มีการค้นหา " + name + " แล้ว", "ปิด", {
      duration: 2000,
    });
  }

  public addEntityInUrl(name: any): void {
    name = this.addParamsDate(name);
    let url: string[] = this.router.url.split("?");
    if (this.searchKeywordAll && this.searchKeywordAll.length > 0) {
      for (const search of this.searchKeywordAll) {
        if (search.keywords && search.name === name) {
          return this.openSnackBar(name);
        }
      }
      this.router.navigateByUrl(url[0] + "&&:" + this.encodeURL(name));
    } else {
      this.router.navigateByUrl(url[0] + "/:" + this.encodeURL(name));
    }
  }

  public addKeywordInUrl(name: any): void {
    name = this.addParamsDate(name);
    let url: string[] = this.router.url.split("?");
    if (this.searchKeywordAll && this.searchKeywordAll.length > 0) {
      for (const search of this.searchKeywordAll) {
        if (search.status && search.name === name) {
          return this.openSnackBar(name);
        }
      }
      this.router.navigateByUrl(url[0] + "&&" + this.encodeURL(name));
    } else {
      this.router.navigateByUrl(url[0] + "/" + this.encodeURL(name));
    }
  }

  public selectedNewsAgencyChart(): void {
    if (this.selectNewsAgencyChart === "ถูกพูดถึงมากสุดโดย") {
      this.listChartAgenJouran = {
        newsAgencys: this.data.trendingTopNewsAgency,
        jouranlist: this.data.trendingTopJouranlist
      }
    } else {
      this.listChartAgenJouran = {
        newsAgencys: this.data.trendingLeastNewsAgency,
        jouranlist: this.data.trendingLeastJouranlist
      }
    }
    setTimeout(() => {
      this.drawNewsAgencyChart();
    }, 30);
  }

  public selectedNewsAgencyCompare(): void {
    this.sourceTypeFacade.getNewsAgencysCompare(this.selectNewsAgencyCompare, this.find).then((res) => {
      this.dataNewsAgencyCompare = res;
      setTimeout(() => {
        this.drawNewsAgencyCompareChart();
      }, 30);
    }).catch((err) => {
      console.log(err);
    });
  }

  public selectNewsAgency(index: number): void {
    if (this.data.listNewsAgencysWithNews.length === 1) {
      return;
    }
    clearTimeout(this.timeoutNewsAgency);
    this.listSelectNewsAgency = [];
    this.data.listNewsAgencysWithNews[index].isActive = !this.data.listNewsAgencysWithNews[index].isActive;
    for (const source of this.data.listNewsAgencysWithNews) {
      if (source.isActive) {
        this.listSelectNewsAgency.push(source._id);
      }
    }
    if (this.listSelectNewsAgency.length === 0) {
      this.data.listNewsAgencysWithNews[index].isActive = !this.data.listNewsAgencysWithNews[index].isActive;
      return;
    }
    this.timeoutNewsAgency = setTimeout(() => {
      this.clearNews();
      this.searchRelateNews();
    }, 800);
  }

  public changeSelectdate(selectedDate: any): void {
    if (!this.isInitial && this.find !== {}) {
      return;
    }
    this.selectedDate = selectedDate;
    let params = "";
    for (const search of this.searchKeywordAll) {
      if (search.personaType) {
        params += params !== "" ? "&&:" + search.name : ":" + search.name;
      } else {
        params += params !== "" ? "&&" + search.name : search.name;
      }
    }
    params = this.addParamsDate(params);
    this.router.navigateByUrl("/channel/" + this.encodeURL(this.sourceTypeName) + "/" + this.encodeURL(params));
  }

  public searchRelateNews(): void {
    if (this.data.totalNews <= this.countNews) {
      return;
    }
    var find = {
      sourceTypeId: this.find.sourceTypeId,
      firstDay: this.find.firstDay,
      lastDay: this.find.lastDay,
      keywords: this.find.keywords,
      entityKeywords: this.find.entityKeywords,
      newsAgencys: this.listSelectNewsAgency,
      start: this.countNews,
      amount: 36
    };
    this.isloadNews = true;
    this.sourceTypeFacade.getNewsRelate(find).then((res) => {
      this.countNews += res.length;
      this.data.news = this.data.news.concat(this.mergeNews(res));
      this.isloadNews = false;
    }).catch((err) => {
      console.log(err);
    });
  }

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
      // for (const newsAgency of this.data.trendingTopNewsAgency) {
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

  public drawMapChart() {
    if (!this.trendChartMap) {
      return;
    }
    let dataMap = [['Country', 'กล่าวถึง']];
    if (this.data.trendingMap && this.data.trendingMap.length > 0) {
      for (const trendingMap of this.data.trendingMap) {
        dataMap.push([trendingMap._id, trendingMap.count]);
      }
    } else {
      dataMap.push(["", "0"]);
    }
    var data = google.visualization.arrayToDataTable(dataMap);

    var options = {
      top: 0,
      left: 0,
      backgroundColor: "transparent",
      width: "100%",
      height: "100%",
      animation: {
        duration: 250,
        easing: 'out',
        startup: true
      },
      colorAxis: {
        minValue: 0, colors: ['#ce9e83', '#d4692d']
      },
      chartArea: { width: '90%', height: '90%' },
      legend: { position: 'none' },
      vAxis: {
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

    this.trendChartMap.draw(data, options);
  }
}