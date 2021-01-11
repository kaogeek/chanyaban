/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

import { Component, OnInit } from '@angular/core'; 

const PAGE_NAME: string = '';

export interface Routes {  
  title: string;
  path: string;
  subRoutes: RouteInfo[];
}
export interface RouteInfo {
  path: string;
  title: string;
}

@Component({
  selector: 'admin-main-page',
  templateUrl: './AdminMainPage.component.html',
})
export class AdminMainPage implements OnInit {

  public static readonly PAGE_NAME: string = PAGE_NAME;  

  public menuItems: Routes[] = [ 
    {      
      title: "ข่าว",
      subRoutes: [],
      path: "/news"
    },
    {      
      title: "สื่อ", 
      subRoutes: [],
      path: "/newsagency"
    },
    // {      
    //   title: "นักข่าว", 
    //   subRoutes: [],
    //   path: "/journalist"
    // },
    {      
      title: "แหล่งที่มา", 
      subRoutes: [],
      path: "/source"
    },
    {      
      title: "หมวดหมู่ข่าว", 
      subRoutes: [],
      path: "/newscategory"
    },
    {      
      title: "คีย์เวิร์ด",
      subRoutes: [
        { path: '/keyword', title: 'คีย์เวิร์ดทั้งหมด' },
        { path: '/entity', title: 'กลุ่มคีย์เวิร์ด' },
        { path: '/entitytype', title: 'ประเภทกลุ่มคีย์เวิร์ด' },
        { path: '/keywordmanagement', title: 'จัดระเบียบ' }
      ],
      path: ""
    },
    {      
      title: "ค่าระบบ",
      subRoutes: [],
      path: "/config"
    },
  ]

  constructor() {  
    if (window.location.href.includes("http://") && !window.location.href.includes("localhost")){
      window.location.replace(window.location.href.replace("http","https"));
    }
  } 


  ngOnInit() {
  } 

} 