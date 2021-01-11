/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

import { Component, OnInit } from '@angular/core';
import { Keyword } from '../../../models/models';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractPage } from '../AbstractPage';
import { MatDialog, MatSnackBar } from '@angular/material';
import * as moment from 'moment';
import { KeywordManagementFacade, AuthenManager, ObservableManager } from '../../../services/services';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { SatDatepickerRangeValue } from 'saturn-datepicker';
import { DialogAlert } from '../../shares/shares';

const PAGE_NAME: string = 'keywordmanagement';

@Component({
  selector: 'app-list-keyword-management',
  templateUrl: './ListManageKeyword.component.html'
})
export class ListManageKeyword extends AbstractPage implements OnInit {

  public static readonly PAGE_NAME: string = PAGE_NAME;

  private keywordManaementFacade: KeywordManagementFacade;
  private route: ActivatedRoute;

  public dataForm: Keyword;
  public sources: any[];
  public isLoadMore: any = {
    unclassified: false,
    permanent: false,
    common: false,
    banned: false
  };
  public isLoading: boolean = false;
  public fieldSearch: string[] = ["คีย์เวิร์ด", "กลุ่มคีย์เวิร์ด"];
  public filter: string = "คีย์เวิร์ด";
  public fieldDateSearch: any[] = [
    {
      label: "ไม่กรองวันที่",
      value: "ไม่กรองวันที่"
    },
    {
      label: "วันที่สร้างล่าสุด",
      value: "createdDate"
    },
    {
      label: "วันที่ใช้ล่าสุด",
      value: "useDate"
    },
    {
      label: "วันที่แก้ไขล่าสุด",
      value: "modifiedDate"
    }];
  public filterDate: string = "ไม่กรองวันที่";
  public keywordPermant: any[] = [];
  public keywordTrend: any[] = [];
  public keywordCommon: any[] = [];
  public keywordUnclassified: any[] = [];
  public keywordBanned: any[] = [];
  public search: string = "";
  public selectedDate: SatDatepickerRangeValue<Date>;
  public localeDate = {
    applyLabel: 'ตกลง',
    format: 'DD-MM-YY',
    separator: ' ถึง ',
    cancelLabel: 'ยกเลิก'
  };

  constructor(private observManager: ObservableManager, dialog: MatDialog, keywordManaementFacade: KeywordManagementFacade, authenManager: AuthenManager, router: Router, private _snackBar: MatSnackBar) {
    super(PAGE_NAME, dialog, keywordManaementFacade, authenManager, router)
    this.keywordManaementFacade = keywordManaementFacade;
    this.selectedDate = { begin: moment().subtract(29, 'days').toDate(), end: moment().toDate() };
  }

  public ngOnInit(): void {
    this.searchData();
  }

  private clearData(): void {
    this.keywordPermant = [];
    this.keywordTrend = [];
    this.keywordCommon = [];
    this.keywordUnclassified = [];
    this.keywordBanned = [];
    this.isLoadMore = {
      unclassified: false,
      permanent: false,
      common: false,
      banned: false
    };
  }

  private searchData(): void {
    this.clearData();
    let data = {
      search: this.search,
      filter: this.filter === "คีย์เวิร์ด" ? "keyword" : "entity",
      dateField: this.filterDate === "ไม่กรองวันที่" ? undefined : this.filterDate,
      startDate: this.selectedDate.begin,
      endDate: this.selectedDate.end
    }
    this.isLoading = true;
    this.keywordManaementFacade.searchKeywordManagement(data).then((keywordManagement) => {
      // console.log(keywordManagement);
      for (const keywordManage of keywordManagement) {
        if (keywordManage._id === "unclassified") {
          this.keywordUnclassified = keywordManage.keywords;
          this.isLoadMore.unclassified = this.keywordUnclassified.length > 99;
        } else if (keywordManage._id === "permanent") {
          this.keywordPermant = keywordManage.keywords;
          this.isLoadMore.permanent = this.keywordPermant.length > 99;
        } else if (keywordManage._id === "trend") {
          this.keywordTrend = keywordManage.keywords;
          this.isLoadMore.trend = this.keywordTrend.length > 99;
        } else if (keywordManage._id === "common") {
          this.keywordCommon = keywordManage.keywords;
          this.isLoadMore.common = this.keywordCommon.length > 99;
        } else if (keywordManage._id === "banned") {
          this.keywordBanned = keywordManage.keywords;
          this.isLoadMore.banned = this.keywordBanned.length > 99;
        }
      }
      this.isLoading = false;
      this.observManager.publish("count-unclassified", true); 
    }).catch((err) => {
      this.isLoading = false;
      this.dialogWarning(err.message);
    });
  }

  public loadMore(status: string, start: number) {
    let data = {
      search: this.search,
      filter: this.filter === "คีย์เวิร์ด" ? "keyword" : "entity",
      dateField: this.filterDate === "ไม่กรองวันที่" ? undefined : this.filterDate,
      startDate: this.selectedDate.begin,
      endDate: this.selectedDate.end,
      start: start,
      end: 100
    }
    this.keywordManaementFacade.loadMoreKeywordManagement(status, data).then((keywords) => {
      // console.log(keywords);
      if (keywords && keywords.length > 0) {
        this.isLoadMore[status] = keywords.length === 100;
        if (status === "unclassified") {
          this.keywordUnclassified = this.keywordUnclassified.concat(keywords);
        } else if (status === "permanent") {
          this.keywordPermant = this.keywordPermant.concat(keywords);
        } else if (status === "trend") {
          this.keywordTrend = this.keywordTrend.concat(keywords);
        } else if (status === "common") {
          this.keywordCommon = this.keywordCommon.concat(keywords);
        } else if (status === "banned") {
          this.keywordBanned = this.keywordBanned.concat(keywords);
        }
      }
    }).catch((err) => {
      this.dialogWarning(err.message);
    });
  }

  public changeSelectdate(): void {
    console.log(this.selectedDate);
  }

  public moveUnclassifiedToTrend(): void {
    let dialogRef = this.dialog.open(DialogAlert, {
      data: {
        title: 'คุณต้องการย้ายคีย์เวิร์ดทั้งหมดที่อยู่ใน "ยังไม่ได้จำแนก" ไปอยู่ใน "ตามกระแส" ใช่หรือไม่?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.keywordManaementFacade.moveUnclassifiedToTrend().then((res) => {
          this.searchData();
          this._snackBar.open('ย้ายข้อมูลคีย์เวิร์ดไป "ตามกระแส" เรียบร้อยแล้ว', "ปิด", {
            duration: 2000,
          }); 
        }).catch((err) => {
          this.dialogWarning("เกิดข้อผิดพลาด");
        });
      }
    });
  }

  public dropKeyword(event: CdkDragDrop<{ title: string, poster: string }[]>, status: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      let index = JSON.parse(JSON.stringify(event.previousIndex));
      let data: any = (event.previousContainer.data[index] as any);
      this.keywordManaementFacade.updateKeyword(data._id, status).then((res) => {
        if (data.entity) {
          this.moveAllKeywordEntity(data, status);
        }
        this._snackBar.open("ย้ายข้อมูล " + res.name + " เรียบร้อยแล้ว", "ปิด", {
          duration: 2000,
        });
        transferArrayItem(event.previousContainer.data,
          event.container.data,
          index,
          event.currentIndex);
        this.observManager.publish("count-unclassified", true);
      }).catch((err) => {
        this.dialogWarning("เกิดข้อผิดพลาด");
      });
    }
  }

  private moveAllKeywordEntity(data: any, status: string): void {
    var labelStatus: string;
    if (status === "unclassified") {
      labelStatus = "ยังไม่ได้จำแนก";
    } else if (status === "permanent") {
      labelStatus = "ถาวร";
    } else if (status === "trend") {
      labelStatus = "ตามกระแส";
    } else if (status === "common") {
      labelStatus = "ทั่วไป";
    } else if (status === "banned") {
      labelStatus = "แบน";
    }
    let dialogRef = this.dialog.open(DialogAlert, {
      data: { 
        title: 'คุณต้องการย้ายคีย์เวิร์ดทั้งหมดที่อยู่ในกลุ่ม "'+data.entity.name+'" ไปที่ "'+labelStatus+'" ด้วยหรือไม่?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.keywordManaementFacade.updateKeywordEntity(data.entity._id, status).then((res) => {
          this.searchData();
          this._snackBar.open('ย้ายข้อมูลคีย์เวิร์ดในกลุ่มคีย์เวิร์ด "' + data.entity.name + '" เรียบร้อยแล้ว', "ปิด", {
            duration: 2000,
          });
        }).catch((err) => {
          this.dialogWarning("เกิดข้อผิดพลาด");
        });
      }
    });
  }
}