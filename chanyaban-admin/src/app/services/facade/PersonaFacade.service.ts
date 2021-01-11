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
export class PersonaFacade extends AbstractFacade {


  constructor(http: HttpClient, authMgr: AuthenManager,
    private observableManager: ObservableManager) {
    super("persona", http, authMgr);
  }

  public getPersona(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/persona';
      this.http.get(url, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public addPersona(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/persona';
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

  public updatePersona(id: string, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/persona/' + id;
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

  public deletePersona(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/persona/' + id;
      this.http.delete(url, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }
}
