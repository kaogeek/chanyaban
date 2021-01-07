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
  protected isLogin: boolean;
  protected observManager: ObservableManager;


  constructor(http: HttpClient, observManager: ObservableManager) {
    this.http = http;
    this.observManager = observManager;
    this.baseURL = environment.apiBaseURL;

    // create obsvr subject
    this.observManager.createSubject(REGISTERED_SUBJECT);
  }

  public login(username: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/admin/login';
      let body: any = {
        "username": username,
        "password": password,
      };

      this.http.post(url, body).toPromise().then((response: any) => {
        this.isLogin = response;
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  } 

  public getDefaultHeader(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return headers;
  }


  public logout(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.isLogin = false;
      resolve(); 
    });
  }

  // return current login
  public isUserLogin(): boolean {
    return this.isLogin
  }
}
