import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NewsAgencyFacade, KeywordFacade } from '../../../services/services';
import * as moment from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title, Meta } from '@angular/platform-browser'; 
import { AbstractNewsPage } from './AbstractNewsPage';

const PAGE_NAME: string = 'agency'; 
 
declare var $: any;

@Component({
  selector: 'app-news-agency',
  templateUrl: './NewsAgencyPage.component.html'
})
export class NewsAgencyPage extends AbstractNewsPage implements OnInit {

  public static readonly PAGE_NAME: string = PAGE_NAME;

  private route: ActivatedRoute;

  public timeoutSource: any;
  public timeoutSourceType: any;
  public listSelectSource: any[] = [];
  public listSelectSourceType: any[] = [];
  public search: string;
  public newsAgency: any;
  public newsAgencyName: string;
  public keywordRelates: string[] = []; 
  public searchKeywordAllWithNewsAgency: any[] = [];

  public paramsDateStr: string = "";
  public isInitial: boolean;
  public position: number;
  public isLoadingEntity: boolean = false;
  public isLoadingKeywordTop: boolean = false;

  constructor(route: ActivatedRoute, router: Router,
    private newsAgencyFacade: NewsAgencyFacade, private _snackBar: MatSnackBar,
    private titleService: Title, private meta: Meta, private keywordFacade: KeywordFacade) {
    super(PAGE_NAME, router);
    this.route = route; 

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
      this.newsAgency = undefined;
      this.searchKeywordAll = [];
      this.searchKeywordAllWithNewsAgency = [];
      this.newsAgencyName = params.newsAgency ? decodeURIComponent(params.newsAgency) : "";
      this.newsAgencyFacade.findNewsAgencys({ newsAgencyName: this.newsAgencyName }).then((res) => {
        this.newsAgency = res;
        this.searchKeywordAllWithNewsAgency = [this.newsAgency];
        if (!this.newsAgency) {
          this.isInitial = true;
          return;
        }
        if (params.keyword) {
          let keyEntitys = this.setFindKeywordEntity(params.keyword ? decodeURIComponent(params.keyword) : "");
          this.keywordFacade.findKeywords({ keyEntitys: keyEntitys }).then((res) => {
            this.isInitial = true;
            this.searchKeywordAll = res.searchKeywordAll;
            this.searchKeywordAllWithNewsAgency = this.searchKeywordAllWithNewsAgency.concat(this.searchKeywordAll);
            this.setTitleService();
            this.notFind = res.notFind;
            this.listEntityKeyword = this.setListEntityKeywordsShow(res.entitys);
            this.find = {
              newsAgencyId: this.newsAgency._id,
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
            newsAgencyId: this.newsAgency._id,
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
    // this.isLoadedChart = false;
  }

  public ngAfterViewInit(): void {
  }

  private setTitleService(): void {
    if (this.newsAgencyName) {
      let urlTitle = "จรรยาบรรณ - สำนักข่าว: " + this.newsAgencyName;
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
      trendingNewsAgencyAll: [],
      keywordsTop: [],
      trendingSourceType: undefined
    }
    this.data.totalNews = undefined;
  }

  private loadDataPageCount(): void {
    this.newsAgencyFacade.getInfoCount(this.find).then((res) => {
      this.data.keepDate = res.keepDate;
      this.data.lastDate = moment(res.lastDate).isValid() ? moment(res.lastDate).locale('th').fromNow() : undefined;
      this.data.totalNews = res.totalNews;
      this.data.countFromSource = res.countFromSource;
      this.loadDataPageTrendingNewsAgencyAllChart();
    }).catch((err) => {
      console.log(err);
    });
  }

  private loadDataPageTrendingNewsAgencyAllChart(): void {
    this.newsAgencyFacade.getTrendingNewsAgencyAllChart(this.find).then((res) => {
      this.data.trendingNewsAgencyAll = res;
    }).catch((err) => {
      console.log(err);
    });
  }

  private loadDataPageTrendingSourceTypeChart(): void {
    this.newsAgencyFacade.getTrendingSourceTypeChart(this.find).then((res) => {
      this.data.trendingSourceType = res;
      for (const sourceType of this.data.trendingSourceType) {
        if (sourceType.isActive) {
          this.listSelectSourceType.push(sourceType._id);
        }
      }
      this.searchRelateSources(); 
    }).catch((err) => {
      console.log(err);
    });
  }

  private loadDataPageKeywordTop(): void {
    this.isLoadingKeywordTop = true;
    this.newsAgencyFacade.getKeywordTop(this.find).then((res) => {
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
    this.newsAgencyFacade.getKeywordRelates(this.find).then((res) => {
      this.data.keywordRelates = res;
    }).catch((err) => {
      console.log(err);
    });
  }

  private loadDataPageEntityTop(): void {
    this.isLoadingEntity = true;
    this.newsAgencyFacade.getEntityTop(this.find).then((res) => {
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
    this.loadDataPageTrendingSourceTypeChart();
    this.loadDataPageKeywordTop();
    this.loadDataPageEntityTop();
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
    this.router.navigateByUrl("/agency/" + this.encodeURL(this.newsAgencyName) + "/" + this.encodeURL(params));
  }

  public clickToNewsAgency(): void {
    this.router.navigateByUrl("/agency/" + this.encodeURL(this.newsAgencyName) + this.addParamsDate(""));
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
    this.router.navigateByUrl("/agency/" + this.encodeURL(this.newsAgencyName) + "/" + this.encodeURL(params));
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
    const url = this.router.serializeUrl(this.router.createUrlTree(["/agency/" + this.encodeURL(this.newsAgencyName) + "/" + this.encodeURL(param)]));
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

  public selectSourceType(index: number): void {
    if (this.data.trendingSourceType.length === 1) {
      return;
    }
    clearTimeout(this.timeoutSourceType);
    this.listSelectSourceType = [];
    this.data.trendingSourceType[index].isActive = !this.data.trendingSourceType[index].isActive;
    for (const sourceType of this.data.trendingSourceType) {
      if (sourceType.isActive) {
        this.listSelectSourceType.push(sourceType._id);
      }
    }
    if (this.listSelectSourceType.length === 0) {
      this.data.trendingSourceType[index].isActive = !this.data.trendingSourceType[index].isActive;
      return;
    }
    this.timeoutSourceType = setTimeout(() => {
      this.searchRelateSources();
    }, 800);
  }

  public selectSource(index: number): void {
    if (this.data.listSourcesWithNews.length === 1) {
      return;
    }
    clearTimeout(this.timeoutSource);
    this.listSelectSource = [];
    this.data.listSourcesWithNews[index].isActive = !this.data.listSourcesWithNews[index].isActive;
    for (const source of this.data.listSourcesWithNews) {
      if (source.isActive) {
        this.listSelectSource.push(source._id);
      }
    }
    if (this.listSelectSource.length === 0) {
      this.data.listSourcesWithNews[index].isActive = !this.data.listSourcesWithNews[index].isActive;
      return;
    }
    this.timeoutSource = setTimeout(() => {
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
    this.router.navigateByUrl("/agency/" + this.encodeURL(this.newsAgencyName) + "/" + this.encodeURL(params));
  }

  public searchRelateSources(): Promise<any> {
    return new Promise((resolve, reject) => {
      var find = {
        newsAgencyId: this.find.newsAgencyId,
        firstDay: this.find.firstDay,
        lastDay: this.find.lastDay,
        keywords: this.find.keywords, 
        entityKeywords: this.find.entityKeywords, 
        sourceTypes: this.listSelectSourceType
      };
      this.newsAgencyFacade.getSourcesRelate(find).then((sources: any) => {
        this.listSelectSource = [];
        this.data.listSourcesWithNews = sources;
        for (const newsAgency of sources) {
          if (newsAgency.isActive) {
            this.listSelectSource.push(newsAgency._id);
          }
        }
        this.clearNews();
        this.searchRelateNews();
        resolve(sources);
      }).catch((err) => {
        console.log(err);
        reject(err);
      });
    })
  }

  public searchRelateNews(): void {
    if (this.data.totalNews <= this.countNews) {
      return;
    }
    var find = {
      newsAgencyId: this.find.newsAgencyId,
      firstDay: this.find.firstDay,
      lastDay: this.find.lastDay,
      sourceTypes: this.listSelectSourceType,
      keywords: this.find.keywords, 
      entityKeywords: this.find.entityKeywords, 
      sources: this.listSelectSource,
      start: this.countNews,
      amount: 36
    };
    this.isloadNews = true;
    this.newsAgencyFacade.getNewsRelate(find).then((res) => {
      this.countNews += res.length;
      this.data.news = this.data.news.concat(this.mergeNews(res));
      this.isloadNews = false;
    }).catch((err) => {
      console.log(err);
    });
  } 
}