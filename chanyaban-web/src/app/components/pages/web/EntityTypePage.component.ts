import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EntityTypeFacade } from '../../../services/services';
import * as moment from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { Title, Meta } from '@angular/platform-browser'; 
import { AbstractPage } from './AbstractPage';

const PAGE_NAME: string = 'type'; 

declare var google: any;
declare var $: any;

@Component({
  selector: 'app-entity-type',
  templateUrl: './EntityTypePage.component.html'
})
export class EntityTypePage extends AbstractPage implements OnInit {

  public static readonly PAGE_NAME: string = PAGE_NAME;

  private route: ActivatedRoute;

  public listSelectSourceType: any[] = [];
  public listEntityId: string[] = [];

  public entityType: any;
  public entityTypeName: string;
 
  public isMoreEntityType: boolean = false;
  public isLoadEntitys: boolean = false;
  public showLoadMoreEntitys: boolean = false;
  public isLoadMoreEntitys: boolean = false;
  public isLoadKeywordTop: boolean = false;
  public isLoadNewsAgency: boolean = false;

  public paramsDateStr: string = "";
  public isInitial: boolean;
  public isLoadedChart: boolean;
  public position: number;

  public config: SwiperConfigInterface;

  constructor(route: ActivatedRoute, router: Router,
    private entityTypeFacade: EntityTypeFacade, private _snackBar: MatSnackBar,
    private titleService: Title, private meta: Meta) {
    super(PAGE_NAME, router);
    this.route = route;

    // $(window).resize(() => {
      // if (this.isLoadedChart) {
      //   this.drawSourceTypeEntityChart(); 
      //   if (this.data.newsAgencys && this.data.newsAgencys.length > 0) {
      //     this.drawNewsAgencyChart();
      //   }
      // }
    // });

    this.route.params.subscribe(async (params) => {
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
              $(".wrapper-header-entity").each(function () {
                $(this).removeClass("mobile");
              });
            } else {
              navbar.style.top = "0";
              $(".wrapper-header-entity").each(function () {
                $(this).addClass("mobile");
              });
            }
          } else {
            navbar.style.top = "0";
            $(".wrapper-header-entity").each(function () {
              $(this).removeClass("mobile");
            });
          }
        }
        this.position = scroll;
      });
      this.setRangeDate();
      this.entityType = undefined;
      this.entityTypeName = params.type ? decodeURIComponent(params.type) : "";
      this.entityTypeFacade.findEntityType({ entityTypeName: this.entityTypeName }).then((res) => {
        this.isInitial = true;
        this.entityType = res;
        this.setTitleService();
        if (!this.entityType) {
          return;
        }
        this.find = {
          entityTypeId: res._id,
          firstDay: this.selectedDate.startDate.toDate(),
          lastDay: this.selectedDate.endDate.toDate()
        };
        this.loadDataPage();
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
    });
  }

  private setTitleService(): void {
    if (this.entityType) {
      let urlTitle = "จรรยาบรรณ - ประเภท: " + this.entityType.name;
      this.titleService.setTitle(urlTitle);
      this.meta.updateTag(
        {
          property: 'title',
          content: urlTitle
        },
      );
      let rangesDate = this.selectedDate.startDate.locale('th').format('DD MMM YYYY') + " - " + this.selectedDate.endDate.locale('th').format('DD MMM YYYY');
      this.meta.updateTag(
        {
          property: 'description',
          content: 'การกล่าวถึงทั้งหมดของ "' + this.entityType.name + '" ในช่วง ' + rangesDate
        },
      );
      // console.log(this.meta.getTag('property=title'));
    }
  }

  private clearData(): void {
    this.listEntityId = [];
    this.data = {
      trendingEntityType: [],
      entitys: [],
      trendingSourceType: undefined
    }
    this.data.totalNews = undefined;
    this.isLoadEntitys = true;
    this.showLoadMoreEntitys = false;
  }

  public clickMoreEntityType(): void {
    this.isMoreEntityType = !this.isMoreEntityType;
  }

  private loadDataPageCount(): void {
    this.entityTypeFacade.getInfoCount(this.find).then((res) => {
      this.data.keepDate = res.keepDate;
      this.data.lastDate = moment(res.lastDate).isValid() ? moment(res.lastDate).locale('th').fromNow() : undefined;
      this.data.totalNews = res.totalNews;
      this.data.countFromSource = res.countFromSource;
      this.loadDataPageTrendingEntityTypeChart();
    }).catch((err) => {
      console.log(err);
    });
  }

  private loadDataPageTrendingEntityTypeChart(): void {
    this.entityTypeFacade.getTrendingEntityTypeChart(this.find).then((res) => {
      this.data.trendingEntityType = res;
    }).catch((err) => {
      console.log(err);
    });
  }

  private loadDataPageTrendingSourceTypeChart(): void {
    this.entityTypeFacade.getTrendingSourceTypeChart(this.find).then((res) => {
      this.data.trendingSourceType = res;
      for (const sourceType of this.data.trendingSourceType) {
        if (sourceType.isActive) {
          this.listSelectSourceType.push(sourceType._id);
        }
      } 
    }).catch((err) => {
      console.log(err);
    });
  }

  private loadDataPageEntitys(): void {
    let find = {
      entityTypeId: this.find.entityTypeId,
      firstDay: this.find.firstDay,
      lastDay: this.find.lastDay,
      listEntityId: this.listEntityId
    }
    if (this.listEntityId.length > 0) {
      this.isLoadMoreEntitys = true;
    }
    this.entityTypeFacade.getEntitys(find).then((entitys) => {
      this.showLoadMoreEntitys = true;
      this.data.entitys = this.data.entitys.concat(entitys);
      for (const entity of entitys) {
        this.listEntityId.push(entity._id);
      } if (entitys.length < 30) {
        this.showLoadMoreEntitys = false;
      }
      this.isLoadEntitys = false;
      this.isLoadMoreEntitys = false;
      // setTimeout(() => {
      //   this.drawSourceTypeEntityChart();
      // }, 100);
    }).catch((err) => {
      this.isLoadEntitys = false;
      this.isLoadMoreEntitys = false;
      console.log(err);
    });
  }

  private loadDataPageKeywordTopByEntityKeywords(keywords): void {
    let find = {
      entityKeywords: keywords,
      firstDay: this.find.firstDay,
      lastDay: this.find.lastDay
    };
    this.isLoadKeywordTop = true;
    this.data.keywordTop = undefined;
    this.entityTypeFacade.getKeywordTopByEntityKetwords(find).then((res) => {
      this.isLoadKeywordTop = false;
      this.data.keywordTop = res
    }).catch((err) => {
      this.isLoadKeywordTop = false;
      console.log(err);

    });
  }

  private loadDataPageNewsAgencyByEntityKeywords(entityId: string, entityKeywords: any): void {
    let find = {
      entityId: entityId,
      entityKeywords: entityKeywords,
      firstDay: this.find.firstDay,
      lastDay: this.find.lastDay
    };
    this.isLoadNewsAgency = true;
    this.data.newsAgencys = undefined;
    this.data.listEntityRelate = undefined;
    this.entityTypeFacade.getNewsAgencyByEntityKetwords(find).then((res) => {
      this.isLoadNewsAgency = false;
      this.data.newsAgencys = res.newsAgency;
      this.data.listEntityRelate = res.entityTop;
      // setTimeout(() => {
      //   this.drawNewsAgencyChart();
      // }, 100);
    }).catch((err) => {
      this.isLoadNewsAgency = false;
      console.log(err);

    });
  }

  private loadDataPage(): void {
    if (this.isLoadEntitys) {
      return;
    }
    this.clearData();
    this.find.lastDay.setHours(23);
    this.find.lastDay.setMinutes(59);
    this.find.lastDay.setSeconds(59);
    this.loadDataPageCount();
    this.loadDataPageTrendingSourceTypeChart();
    this.loadDataPageEntitys();
  }

  openSnackBar(name: string) {
    this._snackBar.open("มีการค้นหา " + name + " แล้ว", "ปิด", {
      duration: 2000,
    });
  }

  public changeSelectdate(selectedDate: any): void {
    if (!this.isInitial && this.find !== {}) { 
      return;
    }
    this.selectedDate = selectedDate;
    this.router.navigateByUrl("/type/" + this.addParamsDate(this.encodeURL(this.entityType.name)));
  } 

  public clickTrendDetail(dataTrend: any): void {
    this.loadDataPageKeywordTopByEntityKeywords(dataTrend.keywords);
    this.loadDataPageNewsAgencyByEntityKeywords(dataTrend._id, dataTrend.keywords);
  } 
}