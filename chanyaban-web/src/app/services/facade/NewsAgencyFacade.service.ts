import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { AuthenManager } from '../AuthenManager.service';
import { AbstractFacade } from "./AbstractFacade"; 
import { ObservableManager } from '../ObservableManager.service';

@Injectable()
export class NewsAgencyFacade extends AbstractFacade { 


  constructor(http: HttpClient, authMgr: AuthenManager,
  private observableManager: ObservableManager) {
    super("newsagency",http, authMgr); 
  } 

  public findNewsAgencys(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/newsagency/find';
      this.http.post(url, body, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }  

  public getInfoCount(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/newsagency/page/count';
      this.http.post(url, body, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public getTrendingNewsAgencyAllChart(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/newsagency/page/trend/all';
      this.http.post(url, body, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  // public getTrendingMapChart(body: any): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     let url: string = this.baseURL + '/newsagency/page/trend/map';
  //     this.http.post(url, body, this.getDefaultOptions()).toPromise().then((response: any) => {
  //       resolve(response);
  //     }).catch((error: any) => {
  //       reject(error);
  //     });
  //   });
  // }

  public getTrendingSourceTypeChart(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/newsagency/page/trend/sourcetype';
      this.http.post(url, body, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  } 

  public getKeywordTop(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/newsagency/page/top';
      this.http.post(url, body, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public getKeywordRelates(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/newsagency/page/relates';
      this.http.post(url, body, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public getEntityTop(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/newsagency/page/entity';
      this.http.post(url, body, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public getNewsRelate(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/newsagency/page/news';
      this.http.post(url, body, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  } 

  public getSourcesRelate(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/newsagency/page/source/news';
      this.http.post(url, body, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  } 
}
