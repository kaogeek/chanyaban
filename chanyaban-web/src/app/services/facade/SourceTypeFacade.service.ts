import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { AuthenManager } from '../AuthenManager.service';
import { AbstractFacade } from "./AbstractFacade"; 
import { ObservableManager } from '../ObservableManager.service';

@Injectable()
export class SourceTypeFacade extends AbstractFacade { 


  constructor(http: HttpClient, authMgr: AuthenManager,
  private observableManager: ObservableManager) {
    super("sourcetype",http, authMgr); 
  }   

  public findNewsAgencys(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/sourcetype/find';
      this.http.post(url, body, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }  

  public getInfoCount(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/sourcetype/page/count';
      this.http.post(url, body, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public getTrendinSourceTypeAllChart(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/sourcetype/page/trend/all';
      this.http.post(url, body, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public getTrendingMapChart(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/sourcetype/page/trend/map';
      this.http.post(url, body, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  } 

  public getTrendingNewsAgencyChart(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/sourcetype/page/trend/newsagency';
      this.http.post(url, body, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public getKeywordTop(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/sourcetype/page/top';
      this.http.post(url, body, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public getKeywordRelates(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/sourcetype/page/relates';
      this.http.post(url, body, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public getEntityTop(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/sourcetype/page/entity';
      this.http.post(url, body, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public getNewsRelate(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/sourcetype/page/news';
      this.http.post(url, body, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  } 

  public getNewsAgencyRelate(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/sourcetype/page/newsagency/news';
      this.http.post(url, body, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  } 

  public getNewsAgencysCompare(id: any,body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/sourcetype/page/newsagency/compare/'+id;
      this.http.post(url, body, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }
}
