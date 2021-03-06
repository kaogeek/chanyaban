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
import { Journalist } from '../../models/models';
import { ObservableManager } from '../ObservableManager.service';

@Injectable()
export class JournalistFacade extends AbstractFacade {

  constructor(http: HttpClient, authMgr: AuthenManager, private observableManager: ObservableManager) {
    super("journalist", http, authMgr);
  }

  public getJournalist(): Promise<Journalist[]> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/journalist';
      this.http.get(url, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

}
