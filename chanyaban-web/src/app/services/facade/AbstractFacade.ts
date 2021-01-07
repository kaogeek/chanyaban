import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthenManager } from '../AuthenManager.service';
import { SearchFilter } from '../../models/models';

export abstract class AbstractFacade {

  protected baseURL: string;
  protected nameFacade: string;
  protected http: HttpClient;
  protected authMgr: AuthenManager;

  constructor(nameFacade: string, http: HttpClient, authMgr: AuthenManager, baseURL?: string) {
    this.http = http;
    this.nameFacade = nameFacade;
    this.baseURL = baseURL;
    this.authMgr = authMgr;

    if (this.baseURL === undefined || this.baseURL === null) {
      this.baseURL = environment.apiBaseURL;
    }
  }

  public getDefaultOptions(): any {
    let header = this.getDefaultHeader();

    let httpOptions = {
      headers: header
    };

    return httpOptions;
  }

  public getDefaultHeader(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + this.authMgr.getUserToken()
    });

    if (this.authMgr.isFacebookMode()) {
      headers = headers.set('mode', 'FB');
    }

    return headers;
  }

  public search(search: SearchFilter): Promise<any[]> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/'+this.nameFacade+"/search";
      this.http.post(url, search, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public findById(id: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/'+this.nameFacade+"/"+id;
      this.http.get(url, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public add(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/'+this.nameFacade;
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

  public update(id: string, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/'+this.nameFacade+'/'+id;
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

  public delete(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/'+this.nameFacade+'/'+id;
      this.http.delete(url, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public getHttp(): HttpClient {
    return this.http;
  }

  public getBaseURL(): string {
    return this.baseURL;
  }

  public getUserToken(): string {
    return this.authMgr.getUserToken();
  }
}
