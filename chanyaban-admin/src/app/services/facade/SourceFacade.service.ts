import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { AuthenManager } from '../AuthenManager.service';
import { AbstractFacade } from "./AbstractFacade";

@Injectable()
export class SourceFacade extends AbstractFacade {

  constructor(http: HttpClient, authMgr: AuthenManager) {
    super("source", http, authMgr); 
  }

  public getSource(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/source';
      this.http.get(url, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  } 

  public addSource(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/source';
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

  public updateSource(id: string, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/source/'+id;
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

  public deleteSource(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/source/'+id;
      this.http.delete(url, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public scarpingBot(data: any): Promise<any> {
    if (data === undefined || data === null || data === '') {
      new Error("data is required.");
    }

    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/admin/source';
      let body: any = {
        
      };
      if (data !== null && data !== undefined) {
        body = Object.assign(data)
      } 
      this.http.post(url, body, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public runTest(id: string): Promise<any> {
    if (id === undefined || id === null || id === '') {
      new Error("required is id.");
    }

    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/admin/source/'+id+'/run'; 
      this.http.post(url, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public stopTest(id: string): Promise<any> {
    if (id === undefined || id === null || id === '') {
      new Error("required is id.");
    }

    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/admin/source/'+id+'/stop'; 
      this.http.post(url, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public testSocial(data: any): Promise<any> {
    if (data === undefined || data === null || data === '') {
      new Error("data is required.");
    }

    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/admin/selector/social';
      let body: any = {
        
      };
      if (data !== null && data !== undefined) {
        body = Object.assign(data)
      } 
      this.http.post(url, body, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public testSelectorUpdate(data: any): Promise<any> {
    if (data === undefined || data === null || data === '') {
      new Error("data is required.");
    }

    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/admin/selector/link';
      let body: any = {
        
      };
      if (data !== null && data !== undefined) {
        body = Object.assign(data)
      } 
      this.http.post(url, body, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public testSelectorData(data: any): Promise<any> {
    if (data === undefined || data === null || data === '') {
      new Error("data is required.");
    }

    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/admin/selector/data';
      let body: any = {
        
      };
      if (data !== null && data !== undefined) {
        body = Object.assign(data)
      } 
      this.http.post(url, body, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public findNews(id: any): Promise<any> {
    if (id === undefined || id === null || id === '') {
      new Error("Id is required.");
    }

    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/source/'+id;
      this.http.get(url, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  } 

  public getSourceNews(id: string): Promise<any> {
    if (id === undefined || id === null || id === '') {
      new Error("Id is required.");
    }
    
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/source/'+id+"/news";
      this.http.get(url, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }
}
