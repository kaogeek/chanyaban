import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { AuthenManager } from '../AuthenManager.service';
import { AbstractFacade } from "./AbstractFacade";
import { ObservableManager } from '../ObservableManager.service';

@Injectable()
export class NewsFacade extends AbstractFacade { 

  constructor(http: HttpClient, authMgr: AuthenManager,
  private observableManager: ObservableManager) {
    super("news",http, authMgr); 
  }

  public getNewsCategory(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/news';
      this.http.get(url, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  } 
}
