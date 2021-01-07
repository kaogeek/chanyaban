import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { KeywordFacade, ObservableManager } from '../../../services/services';
import { Title, Meta } from '@angular/platform-browser';
import * as moment from 'moment';
import { AbstractPage } from './AbstractPage';

declare var $: any;
const PAGE_NAME: string = 'home';

@Component({
  selector: 'app-home',
  templateUrl: './HomePage.component.html'
})
export class HomePage extends AbstractPage implements OnInit, OnDestroy {
  
  public static readonly PAGE_NAME: string = PAGE_NAME;

  public loadTrendingTimeout: any;
  public isMobile: boolean = false;
  public isRefresh: boolean = false;
  public res: any = { test: "" };
  public trendDate: any;
  public keywords: any[] = [];
  public trendings: any[] = [];
  public trendingSize: number = 5;
  public countTrending: number = 1;

  constructor(private keywordFacade: KeywordFacade, router: Router,
    private titleService: Title, private meta: Meta, private observManager: ObservableManager) {
      super(PAGE_NAME, router);
    this.titleService.setTitle("จรรยาบรรณ"); 
    this.meta.updateTag(
      {
        property: 'title',
        content: "จรรยาบรรณ"
      },
    );
    this.meta.updateTag(
      {
        property: 'description',
        content: "Chanyaban.com เฝ้ามอง สอดส่อง เพื่อจรรยาบรรณสื่อสารมวลชน"
      },
    );
    // console.log(this.meta.getTag('property=title'));
    this.setIsMobile();
    $(window).resize(() => {
      this.setIsMobile();
    });
  }

  public ngOnInit(): void {
    this.loadTrending().then((res) => {
      if (res && res.trending.length > 0) {
        this.makeDiv();
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  public ngOnDestroy(): void {
    clearTimeout(this.loadTrendingTimeout);
  }

  private stopRefresh(): void {
    setTimeout(() => {
      this.isRefresh = false;
    }, 1000);
  }

  public refreshTrending(): void {
    this.isRefresh = true;
    this.loadTrending().then(() => {
      this.stopRefresh();
    }).catch(() => {
      this.stopRefresh();
    });
    this.observManager.publish("refresh_search_all", true);
  }

  private setIsMobile(): void {
    if (window.innerWidth < 768) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }

  private loadTrending(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.keywordFacade.getKeywordHot().then((res) => {
        clearTimeout(this.loadTrendingTimeout);
        this.keywords = res.trending;
        this.trendDate = res.date ? moment(res.date).locale('th').format('DD MMM YYYY เวลา HH:mm:ss') : moment().locale('th').format('DD MMM YYYY เวลา HH:mm:ss');
        this.loadTrendingTimeout = setTimeout(() => {
          this.loadTrending();
        }, 300000);
        resolve(res);
      }).catch((err) => {
        reject(err);
        console.log(err);
      });
    });
  }

  private async setPosition(divHome: any, divTrending: any[]): Promise<any[]> {
    var divsize = this.isMobile ? 190 : 280;
    for (; ;) {
      let isPass = [];
      var posx = Number((Math.random() * (divHome.width() - divsize)).toFixed());
      var posy = Number((Math.random() * (divHome.height() - 130)).toFixed());
      if (this.isMobile && posy < 70) {
        continue;
      } else {
        var searchKeyword = $('#searchKeyword');
        if (searchKeyword && searchKeyword.length > 0) {
          let xStart = searchKeyword[0].offsetLeft - searchKeyword[0].offsetWidth - 20;
          let xEnd = searchKeyword[0].offsetLeft + searchKeyword[0].offsetWidth;
          let yStart = searchKeyword[0].offsetTop - 120;
          let yEnd = searchKeyword[0].offsetTop + 100;
          if ((posx > xStart && posx < xEnd) && (posy > yStart && posy < yEnd)) {
            continue;
          }
        }
      }
      for (let trending of divTrending) {
        let xStart = trending.offsetLeft - trending.offsetWidth - 20;
        let xEnd = trending.offsetLeft + trending.offsetWidth;
        let yStart = trending.offsetTop - trending.offsetHeight - 20;
        let yEnd = trending.offsetTop + trending.offsetHeight;
        if ((posx < xStart || posx > xEnd) || (posy < yStart || posy > yEnd)) {
          isPass.push(true);
        } else {
          break;
        }
      }
      if (isPass.length === divTrending.length) {
        return [posx, posy];
      }
    }
  }

  private genRandomTrending(): any {
    let indexT = Math.floor(Math.random() * this.keywords.length);
    let index = Math.floor(Math.random() * this.keywords[indexT].trending.length);
    var trending = JSON.parse(JSON.stringify(this.keywords[indexT]));
    var source = JSON.parse(JSON.stringify(this.keywords[indexT].trending[index]));
    let item = {
      _id: trending._id,
      image: source.icon ? source.icon : source.image,
      name: source.name,
      keyword: trending.keyword,
      entity: trending.entity,
      timeout: indexT < 50 ? 10000 : indexT < 100 ? 9500 : indexT < 150 ? 9000 : indexT < 200 ? 8500 : indexT < 250 ? 8000 : 7500
    }

    return item;
  }

  private async makeDiv() {
    var divHome = $('#home');
    var divTrending = $(".trending") ? $(".trending") : [];
    var pos = await this.setPosition(divHome, divTrending);
    var left = pos[0];
    var top = pos[1];
    let flexDirection = (Number(left) > (divHome.width() / 2)) ? "row-reverse" : "row";
    let item = this.genRandomTrending();
    let data = item.entity ? item.entity.name : item.keyword.isTag ? "# " + item.keyword.name : item.keyword.name;
    let imageEntity = item.entity ? item.entity.image : undefined;
    let arrow = (Number(left) < (divHome.width() / 2));
    let param = item.entity ? ":" + item.entity.name : item.keyword.name;
    this.trendings.push({
      _id: item._id,
      genText: 0,
      image: item.image,
      name: item.name,
      data: data,
      avatar: imageEntity,
      param: param,
      arrow: arrow,
      style: {
        flexDirection: flexDirection,
        left: left,
        top: top,
        animation: item.timeout + "ms"
      }
    });
    if (this.countTrending === 1) {
      this.countTrending++;
      this.makeDiv();
    } else if (this.countTrending < this.trendingSize) {
      setTimeout(() => {
        this.countTrending++;
        this.makeDiv();
      }, 800);
    }

    setTimeout(() => {
      this.removeDiv(item._id);
    }, item.timeout);
  }

  private removeDiv(id: string): void {
    let index = 0;
    for (const trending of this.trendings) {
      if (trending._id === id) {
        this.trendings.splice(index, 1);
        break;
      }
      index++;
    }
    this.makeDiv();
  }

  private getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  public genText(trending: any): number {
    if (!trending.genText) {
      trending.genText = 1;
      return 1;
    } else {
      if (trending.data.length <= trending.genText) {
        return trending.data.length;
      } else {
        clearTimeout(trending.setIntervalGenText);
        trending.setIntervalGenText = setTimeout(() => {
          trending.genText++;
          // }, this.getRndInteger(100, 150));
        }, 100);
        return trending.genText;
      }
    }
  }

  public clickNewsAgency(param: string): void {
    const url = this.router.serializeUrl(this.router.createUrlTree(["/agency/" + this.encodeURL(param)]));
    window.open(url, '_blank');
  }

  public clickTrending(param: string): void { 
    const url = this.router.serializeUrl(this.router.createUrlTree(["/keyword/" + this.encodeURL(param)]));
    window.open(url, '_blank');
  }
}