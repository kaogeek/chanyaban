/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

import { Component, OnInit } from '@angular/core';
import { NewsCategoryFacade } from '../../../services/facade/NewsCategoryFacade.service';
import { Category } from '../../../models/models';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractPage } from '../AbstractPage';
import { MatDialog } from '@angular/material'; 
import { AuthenManager } from '../../../services/services';

const PAGE_NAME: string = 'newscategory';

@Component({
  selector: 'app-list-news-category',
  templateUrl: './ListNewsCategory.component.html'
})
export class ListNewsCategory extends AbstractPage implements OnInit {

  public static readonly PAGE_NAME: string = PAGE_NAME;
 
  private route: ActivatedRoute;

  public dataForm: Category;
  public sources: any[];
  public fieldSearch: string[];

  constructor(dialog: MatDialog,
    private newsCategoryFacade: NewsCategoryFacade, authenManager: AuthenManager, router: Router) {
    super(PAGE_NAME, dialog, newsCategoryFacade, authenManager, router) 
    this.fieldSearch = [
      "name",
      "details"
    ];
    this.fieldTable = [
      {
        name: "icon",
        label: "ไอคอน",
        width: "100pt",
        class: "", formatColor: false, formatObject: [], formatArrary: false, formatImage: true,
        link: [],
        formatDate: false,
        formatId: false,
        align: "left"
      },
      {
        name: "name",
        label: "ชื่อ",
        width: "200pt",
        class: "",formatColor: false, formatObject: [], formatArrary: false, formatImage: false,
        link: [],
        formatDate: false,
        formatId: false,
        align: "left"
      },
      {
        name: "details",
        label: "รายละเอียด",
        width: "350pt",
        class: "",formatColor: false, formatObject: [], formatArrary: false, formatImage: false,
        link: [],
        formatDate: false,
        formatId: false,
        align: "left"
      }
    ]
    this.actions = { isRunTest: false,
      isCreate: true,
      isEdit: true,
      isDelete: true,
      isBack: false
    };
    this.setFields();
  }

  public ngOnInit(): void {
  }

  private setFields(): void {
    this.fields = [
      {
        name: "ไอคอน",
        field: "icon",
        type: "text",
        placeholder: "",
        required: true,
        disabled: false,
        subField: []
      },
      {
        name: "ชื่อ",
        field: "name",
        type: "text",
        placeholder: "",
        required: true,
        disabled: false,
        subField: []
      },
      {
        name: "รายละเอียด",
        field: "details",
        type: "contentEditor",
        placeholder: "",
        required: false,
        disabled: false,
        subField: []
      }
    ];
    this.dataForm = new Category();
    this.dataForm._id = undefined;
    this.dataForm.name = ""; 
    this.dataForm.details = "";
  }

  public clickCreateForm(): void {
    this.drawer.toggle();
    this.setFields();
  }

  public clickEditForm(data: any): void {
    this.drawer.toggle();
    this.dataForm = JSON.parse(JSON.stringify(data));
  } 

  // public clickDelete(data: any): void {
  //   let cloneData = JSON.parse(JSON.stringify(data));
  //   this.newsCategoryFacade.deleteNewsCategory(data._id).then((doc: any) => {
  //     let index = 0;
  //     let dataTable = this.table.data;
  //     for (let d of dataTable) {
  //       if (d._id == cloneData._id) {
  //         dataTable[index] = cloneData;
  //         dataTable.splice(index, 1);
  //         this.table.setTableConfig(dataTable);
  //         this.dialogWarning("ลบข้อมูลสำเร็จ");
  //         break;
  //       }
  //       index++;
  //     }
  //   }).catch((err) => {
  //     console.log(err);
  //   });
  // }
 
  // public clickSave(): void {
  //   let data = JSON.parse(JSON.stringify(this.dataForm));
  //   if (data._id) { 
  //     data.modifiedDate = new Date();
  //     this.newsCategoryFacade.updateNewsCategory(data._id , data).then((res) => {
  //       let index = 0;
  //       let dataTable = this.table.data;
  //       for (let d of dataTable) {
  //         if (d._id == res._id) { 
  //           dataTable[index] = res;
  //           break;
  //         }
  //         index++;
  //       }
  //       this.table.setTableConfig(dataTable);
  //       this.drawer.toggle();
  //     }).catch((err) => {
  //       console.log(err);
  //     });
  //   } else {
  //     let date = new Date();
  //     data.createdDate = date;
  //     data.modifiedDate = date;
  //     this.newsCategoryFacade.addNewsCategory(data).then((doc: any) => {
  //       let dataAdd = data;
  //       dataAdd._id = doc._id;
  //       this.table.data.push(dataAdd);
  //       this.table.setTableConfig(this.table.data);
  //       this.drawer.toggle();
  //     }).catch((err) => {
  //       console.log(err);
  //     });
  //   }
  // }
}