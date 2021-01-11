/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { AuthenManager } from '../AuthenManager.service';
import { AbstractFacade } from "./AbstractFacade";
import { ObservableManager } from '../ObservableManager.service';

@Injectable()
export class NewsCategoryFacade extends AbstractFacade {

  constructor(http: HttpClient, authMgr: AuthenManager,
    private observableManager: ObservableManager) {
    super("newscategory", http, authMgr);
  }

  public findNewsAgencys(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/newscategory/find';
      this.http.post(url, body, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public getInfoCount(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/newscategory/page/count';
      this.http.post(url, body, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public getTrendinNewsCategoryAllChart(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/newscategory/page/trend/all';
      this.http.post(url, body, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public getTrendingMapChart(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/newscategory/page/trend/map';
      this.http.post(url, body, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public getTrendingSourceTypeChart(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/newscategory/page/trend/sourcetype';
      this.http.post(url, body, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public getTrendingNewsAgencyChart(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/newscategory/page/trend/newsagency';
      this.http.post(url, body, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public getKeywordTop(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/newscategory/page/top';
      this.http.post(url, body, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public getKeywordRelates(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/newscategory/page/relates';
      this.http.post(url, body, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public getEntityTop(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/newscategory/page/entity';
      this.http.post(url, body, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public getNewsRelate(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/newscategory/page/news';
      this.http.post(url, body, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public getNewsAgency(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/newscategory/page/newsagency/news';
      this.http.post(url, body, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public getNewsAgencysCompare(id: any, body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/newscategory/page/newsagency/compare/' + id;
      this.http.post(url, body, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }
}
