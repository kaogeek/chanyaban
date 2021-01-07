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

  public getNewsCategory(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/newscategory';
      this.http.get(url, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  } 

  public addNewsCategory(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/newscategory';
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

  public updateNewsCategory(id: string, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/newscategory/'+id;
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

  public deleteNewsCategory(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/newscategory/'+id;
      this.http.delete(url, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }
}
