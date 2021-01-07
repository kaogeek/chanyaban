import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { AuthenManager } from '../AuthenManager.service';
import { AbstractFacade } from "./AbstractFacade"; 
import { ObservableManager } from '../ObservableManager.service';

@Injectable()
export class SourceTypeFacade extends AbstractFacade { 


  constructor(http: HttpClient, authMgr: AuthenManager,
  private observableManager: ObservableManager) {
    super("sourcetype", http, authMgr); 
  }

  public getSourceType(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/sourcetype';
      this.http.get(url, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }  
}
