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
export class KeywordFacade extends AbstractFacade {

  constructor(http: HttpClient, authMgr: AuthenManager,
    private observableManager: ObservableManager) {
    super("keyword", http, authMgr);
  }

  public getKeyword(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/keyword';
      this.http.get(url, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public addKeyword(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/keyword';
      if (!data) {
        reject("require is data.");
      }
      this.http.post(url, data, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public updateKeyword(id: string, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/keyword/' + id;
      if (!data) {
        reject("require is data.");
      }
      this.http.put(url, data, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public deleteKeyword(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/keyword/' + id;
      this.http.delete(url, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public getKeywordHot(): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/keyword/home';
      this.http.post(url, {}, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public findKeywords(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/keyword/find';
      this.http.post(url, body, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public searchAll(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/keyword/searchall';
      this.http.post(url, data, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public getKeywordPage(keywords: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/keyword/page';
      this.http.post(url, keywords, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public getNewsAgency(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/newsagency';
      this.http.get(url, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public getInfoCount(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/keyword/page/count';
      this.http.post(url, body, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public getTrendingKeywordChart(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/keyword/page/trend/all';
      this.http.post(url, body, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public getTrendingMapChart(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/keyword/page/trend/map';
      this.http.post(url, body, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public getTrendingSourceTypeChart(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/keyword/page/trend/sourcetype';
      this.http.post(url, body, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public getTrendingNewsAgencyChart(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/keyword/page/trend/newsagency';
      this.http.post(url, body, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public getKeywordTop(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/keyword/page/top';
      this.http.post(url, body, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public getKeywordRelates(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/keyword/page/relates';
      this.http.post(url, body, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public getEntityTop(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/keyword/page/entity';
      this.http.post(url, body, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public getNewsRelate(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/keyword/page/news';
      this.http.post(url, body, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public getNewsAgencysRelate(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/keyword/page/newsagency/news';
      this.http.post(url, body, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public getNewsAgencysCompare(id: any, body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/keyword/page/newsagency/compare/' + id;
      this.http.post(url, body, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }
}
