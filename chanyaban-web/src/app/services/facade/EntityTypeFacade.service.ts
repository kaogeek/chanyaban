import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { AuthenManager } from '../AuthenManager.service';
import { AbstractFacade } from "./AbstractFacade"; 
import { ObservableManager } from '../ObservableManager.service';

@Injectable()
export class EntityTypeFacade extends AbstractFacade { 


  constructor(http: HttpClient, authMgr: AuthenManager,
  private observableManager: ObservableManager) {
    super("entitytype",http, authMgr); 
  }

  public getEntityType(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/entitytype';
      this.http.get(url, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  } 

  public addEntityType(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/entitytype';
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

  public updateEntityType(id: string, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/entitytype/'+id;
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

  public deleteEntityType(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/entitytype/'+id;
      this.http.delete(url, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public getEntityTypeHot(): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/entitytype/home';
      this.http.post(url, {}, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  } 

  public findEntityType(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/entitytype/find';
      this.http.post(url, body, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  } 

  public getEntityTypePage(entitytypes: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/entitytype/page';
      this.http.post(url,entitytypes,  this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public getNewsAgency(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/newsagency';
      this.http.get(url, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  } 

  public getInfoCount(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/entitytype/page/count';
      this.http.post(url, body, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public getTrendingEntityTypeChart(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/entitytype/page/trend/all';
      this.http.post(url, body, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public getTrendingMapChart(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/entitytype/page/trend/map';
      this.http.post(url, body, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public getTrendingSourceTypeChart(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/entitytype/page/trend/sourcetype';
      this.http.post(url, body, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public getTrendingNewsAgencyChart(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/entitytype/page/trend/newsagency';
      this.http.post(url, body, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  } 

  public getEntitys(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/entitytype/page/entity';
      this.http.post(url, body, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public getKeywordTopByEntityKetwords(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/entitytype/page/keywordtop';
      this.http.post(url, body, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }  

  public getNewsAgencyByEntityKetwords(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/entitytype/page/newsagency';
      this.http.post(url, body, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }  
}
