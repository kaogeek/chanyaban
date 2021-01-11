/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

import * as moment from 'moment';
import { Router } from '@angular/router';
import { AbstractPage } from './AbstractPage';

export abstract class AbstractNewsPage extends AbstractPage {

  protected countNews: number = 0;
  protected listEntityKeyword: any[] = [];
  protected notFind: any[] = [];
  protected searchKeywordAll: any[] = [];
  protected timeoutKeywordEntity: any;
  protected isloadNews: boolean = false;

  constructor(PAGE_NAME: string, router: Router) {
    super(PAGE_NAME, router);
  }

  public clearNews(): void {
    this.countNews = 0;
    this.data.news = [];
  }

  public setKeywords(keywords): any {
    let setKeywords = [];
    for (const keyword of keywords) {
      setKeywords.push(keyword._id);
    }
    return setKeywords;
  }

  public setEntitys(entitys): any {
    let setEntitys = [];
    for (const entity of entitys) {
      setEntitys.push(entity._id);
    }
    return setEntitys;
  }

  public setEntityKeywords(entitys): any {
    let setEntityKeywords = [];
    for (const entity of entitys) {
      let entitys = [];
      for (const keyword of entity.keywords) {
        if (!keyword.isBanned) {
          entitys.push(keyword._id);
        }
      }
      setEntityKeywords.push(entitys);
    }
    return setEntityKeywords;
  }

  public setListEntityKeywordsShow(entitys: any): any {
    let keywords = [];
    let index = 0;
    for (const entity of entitys) {
      for (const keyword of entity.keywords) {
        keyword.isActive = true;
        if (keywords[index]) {
          keywords[index].push(keyword);
        } else {
          keywords.push([keyword]);
        }
      }
      index++;
    }
    return keywords;
  }

  public clickSelectEntityKeyword(ekIndex: number, kIndex: number): void {
    clearTimeout(this.timeoutKeywordEntity);
    let index = 0;
    let entityKeywords = [];
    this.listEntityKeyword[ekIndex][kIndex].isActive = !this.listEntityKeyword[ekIndex][kIndex].isActive;
    for (const entityKeyword of this.listEntityKeyword) {
      for (const keyword of entityKeyword) {
        if (keyword.isActive) {
          if (entityKeywords[index]) {
            entityKeywords[index].push(keyword._id);
          } else {
            entityKeywords.push([keyword._id]);
          }
        }
      }
      index++;
    }
    this.find.entityKeywords = entityKeywords;
    this.timeoutKeywordEntity = setTimeout(() => {
      this.loadDataPage();
    }, 800);
  }

  public loadDataPage(): void {
  }

  public clickNewTabTrend(): void {
    const url = this.router.serializeUrl(this.router.createUrlTree(["/trend"]));
    window.open(url, '_blank');
  }

  public mergeNews(listNews: any): any {
    if (!listNews && listNews.length === 0) {
      return;
    }
    var news = {};
    for (const lnews of listNews) {
      lnews.listEntity = this.setGroupEntity(lnews.listEntity);
      if (this.data.news && this.data.news.length && this.data.news[this.data.news.length - 1]._id === this.getDateFromNow(lnews.date)) {
        this.data.news[this.data.news.length - 1].listNews.push(lnews);
        this.data.news[this.data.news.length - 1].count++;
      } else if (!news[this.getDateFromNow(lnews.date)]) {
        news[this.getDateFromNow(lnews.date)] = {
          _id: this.getDateFromNow(lnews.date),
          listNews: [lnews],
          count: 1,
          isLoad: false
        };
      } else {
        news[this.getDateFromNow(lnews.date)].listNews.push(lnews);
        news[this.getDateFromNow(lnews.date)].count++;
      }
    }
    return Object.values(news);
  }

  private setGroupEntity(entitys: any[]): any[] {
    let listEntity = {};
    for (const entity of entitys) {
      if (entity.entityType) {
        if (!listEntity[entity.entityType.name]) {
          listEntity[entity.entityType.name] = [entity];
        } else {
          listEntity[entity.entityType.name].push(entity);
        }
      }
    }
    var listEntityArray: any[] = Object.values(listEntity);
    for (const listEntity of listEntityArray) {
      listEntity.sort(function (a, b) {
        return b.score - a.score;
      });
    }
    listEntityArray.sort(function (a, b) {
      return b[0].score - a[0].score;
    });
    return listEntityArray;
  }

  private getDateFromNow(date: Date): string {
    return moment(date).locale('th').fromNow();
  }
}
