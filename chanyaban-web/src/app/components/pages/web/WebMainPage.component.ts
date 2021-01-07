import { Component } from '@angular/core'; 

const PAGE_NAME: string = ''; 

@Component({
  selector: 'web-main-page',
  templateUrl: './WebMainPage.component.html',
})
export class WebMainPage {

  public static readonly PAGE_NAME: string = PAGE_NAME;

  constructor() { 
    if (window.location.href.includes("http://") && !window.location.href.includes("localhost")){
      window.location.replace(window.location.href.replace("http","https"));
    }
  }   
} 