import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { AuthenManager } from '../AuthenManager.service';
import { AbstractFacade } from "./AbstractFacade"; 
import { ObservableManager } from '../ObservableManager.service';

@Injectable()
export class CountryFacade extends AbstractFacade { 


  constructor(http: HttpClient, authMgr: AuthenManager,
  private observableManager: ObservableManager) {
    super("country",http, authMgr); 
  }
}
