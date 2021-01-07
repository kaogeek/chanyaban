import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { AuthenManager } from '../AuthenManager.service';
import { AbstractFacade } from "./AbstractFacade";
import { PersonaType } from '../../models/models';
import { ObservableManager } from '../ObservableManager.service';

@Injectable()
export class PersonaTypeFacade extends AbstractFacade {

  constructor(http: HttpClient, authMgr: AuthenManager, private observableManager: ObservableManager) {
    super("personatype", http, authMgr);
  }

  public getPersonaType(): Promise<PersonaType[]> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/personatype';
      this.http.get(url, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  } 

  public addPersonaType(data: PersonaType): Promise<PersonaType> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/personatype';
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

  public updatePersonaType(id: string, data: PersonaType): Promise<PersonaType> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/personatype/' + id;
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

  public deletePersonaType(id: string): Promise<PersonaType> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/personatype/' + id;
      this.http.delete(url, this.getDefaultOptions()).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

}
