import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment'; 
import { ObservableManager } from './ObservableManager.service';

const PAGE_USER: string = 'pageUser';
const TOKEN_KEY: string = 'token';
const TOKEN_MODE_KEY: string = 'mode';
const REGISTERED_SUBJECT: string = 'authen.registered';

// only page user can login
@Injectable()
export class AuthenManager {

  public static readonly TOKEN_KEY: string = TOKEN_KEY;
  public static readonly TOKEN_MODE_KEY: string = TOKEN_MODE_KEY;

  protected baseURL: string;
  protected http: HttpClient;
  protected token: string;
  protected user: any;
  protected facebookMode: boolean;
  protected observManager: ObservableManager;


  constructor(http: HttpClient, observManager: ObservableManager) {
    this.http = http;
    this.observManager = observManager;
    this.baseURL = environment.apiBaseURL;
    this.facebookMode = false;

    // create obsvr subject
    this.observManager.createSubject(REGISTERED_SUBJECT);
  }

  public login(username: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/pageuser/login';
      let body: any = {
        "emailId": username,
        "password": password,
      };

      this.http.post(url, body).toPromise().then((response: any) => {

        let result: any = {
          token: response.data.token,
          user: response.data.user
        };

        this.token = result.token;
        this.user = result.user;
        this.facebookMode = false;
        localStorage.setItem(TOKEN_KEY, result.token);
        localStorage.removeItem(TOKEN_MODE_KEY);
        sessionStorage.setItem(TOKEN_KEY, result.token);
        sessionStorage.removeItem(TOKEN_MODE_KEY);

        resolve(result);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public loginWithFacebook(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/pageuser/login_fb';
      let body: any = {
        "token": token
      };

      this.http.post(url, body).toPromise().then((response: any) => {

        let result: any = {
          token: response.data.token,
          user: response.data.user
        };

        this.token = result.token;
        this.user = result.user;
        this.facebookMode = true;

        localStorage.setItem(TOKEN_KEY, result.token);
        localStorage.setItem(TOKEN_MODE_KEY, 'FB');
        sessionStorage.setItem(TOKEN_KEY, result.token);
        sessionStorage.setItem(TOKEN_MODE_KEY, 'FB');

        resolve(result);
      }).catch((error: any) => {
        reject(error);
      });
    });
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
      'Authorization': "Bearer " + this.getUserToken()
    });

    if (this.isFacebookMode()) {
      headers = headers.set('mode', 'FB');
    }
    return headers;
  }


  public logout(): Promise<any> {
    return new Promise((resolve, reject) => {

      let url: string = this.baseURL + "/pageuser/logout";
      // !implement logout from API
      let options = this.getDefaultOptions();

      this.http.post(url, {}, options).toPromise().then((response: any) => {
        resolve(response.data);
        // reset token
        this.token = undefined;
        this.user = undefined;
        this.facebookMode = false;
        this.clearStorage();

      }).catch((error: any) => {
        reject(error);
      });
      resolve();
    });
  }

  public clearStorage(): void {
    this.token = undefined;
    this.user = undefined;
    localStorage.removeItem(PAGE_USER);
    sessionStorage.removeItem(PAGE_USER);
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_MODE_KEY);
    sessionStorage.removeItem(TOKEN_MODE_KEY);
  }

  public checkAccountStatus(token: string, mode?: string, options?: any): Promise<any> {
    if (token === undefined || token === null || token === '') {
      throw 'Token is required.';
    }

    return new Promise((resolve, reject) => {
      let isUpdateUser = false;
      if (options !== undefined && options !== null) {
        isUpdateUser = options.updateUser;
      }

      let url: string = this.baseURL + '/pageuser/check_status?token=' + token;
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });
      let fbMode = false;
      if (mode && mode === 'FB') {
        fbMode = true;
        headers = headers.set('mode', mode);
      }

      let httpOptions = {
        headers: headers
      };

      this.http.get(url, httpOptions).toPromise().then((response: any) => {

        let result: any = {
          token: token,
          user: response.data.user
        };

        if (isUpdateUser) {
          this.token = result.token;
          this.user = result.user;
          this.facebookMode = fbMode;
          localStorage.setItem(PAGE_USER, JSON.stringify(result.user));
          sessionStorage.setItem(PAGE_USER, JSON.stringify(result.user));
          localStorage.setItem(TOKEN_KEY, result.token);
          sessionStorage.setItem(TOKEN_KEY, result.token);
          if (fbMode) {
            localStorage.setItem(TOKEN_MODE_KEY, 'FB');
            sessionStorage.setItem(TOKEN_MODE_KEY, 'FB');
          } else {
            localStorage.removeItem(TOKEN_MODE_KEY);
            sessionStorage.removeItem(TOKEN_MODE_KEY);
          }
        }
        resolve(result);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  // return current login
  public getCurrentUser(): any {
    let user;
    if (this.user) {
      user = this.user;
    } else {
      user = JSON.parse(sessionStorage.getItem(PAGE_USER));
      if (!user) {
        user = JSON.parse(localStorage.getItem(PAGE_USER));
      }
    }
    return user;
  }

  // return current login user admin status
  public isAdminUser(): boolean {
    return false;
  }

  public getUserToken(): string {
    return this.token;
  }

  public isFacebookMode(): boolean {
    return this.facebookMode;
  }
}
