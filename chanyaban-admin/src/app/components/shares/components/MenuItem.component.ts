/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Routes } from '../../pages/admin/AdminMainPage.component';
import { Router } from '@angular/router';
import { ObservableManager, KeywordManagementFacade } from '../../../services/services';

@Component({
  selector: 'admin-menu-item',
  templateUrl: './MenuItem.component.html'
})
export class MenuItem implements OnInit {

  private router: Router;

  public countKeywordManage: Number = 0;

  @Input()
  public menu: Routes;
  @Input()
  public isOpen: boolean;

  constructor(dialog: MatDialog, router: Router, private keywordManaementFacade: KeywordManagementFacade, private observManager: ObservableManager) {
    this.router = router;

    this.observManager.subscribe("count-unclassified", (() => {
      this.countKeywordManagement();
    }));
    this.countKeywordManagement();
  }

  public ngOnInit() {
  }

  private countKeywordManagement(): void {
    this.keywordManaementFacade.countKeywordManagement().then((res) => {
      // console.log(res); 
      this.countKeywordManage = Number(res);
    }).catch((err) => {
      console.log(err);
    });
  }

  public isActive(): boolean {
    if (this.menu.title === "จัดการเว็บไซต์" && (this.router.url === '/main/home_content/pageslide' || this.router.url === '/main/home_content/pagevideo')) {
      return true;
    } else {
      for (let item of this.menu.subRoutes) {
        if (item.path === this.router.url) {
          return true;
        }
      }
      return false;
    }
  }

  public isShowItem(): boolean {
    if (this.isOpen || this.isActive()) {
      return true;
    } else {
      return false;
    }
  }

  public openItems(): void {
    if (!this.isActive()) {
      this.isOpen = !this.isOpen;
    }
  }
}
