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
export class KeywordManagementFacade extends AbstractFacade {


  constructor(http: HttpClient, authMgr: AuthenManager,
    private observableManager: ObservableManager) {
    super("", http, authMgr);
  }

  public countKeywordManagement(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/admin/keywordmanagement/unclassified/count';
      this.http.get(url, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public searchKeywordManagement(data: any): Promise<any[]> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/admin/keywordmanagement/search';
      this.http.post(url, data, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public loadMoreKeywordManagement(status: string, data: any): Promise<any[]> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/admin/keywordmanagement/more/' + status;
      this.http.post(url, data, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public updateKeyword(id: string, status: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/admin/keywordmanagement/' + id + "/" + status;
      this.http.put(url, {}, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public updateKeywordEntity(id: string, status: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/admin/keywordmanagement/entity/' + id + "/" + status;
      this.http.put(url, {}, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public moveUnclassifiedToTrend(): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/admin/keywordmanagement/move/unclassified/trend';
      this.http.put(url, {}, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }
}
