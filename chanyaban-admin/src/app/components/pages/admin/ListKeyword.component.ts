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
import { MatDialog } from '@angular/material';
import { KeywordFacade, AuthenManager } from '../../../services/services';

const PAGE_NAME: string = 'keyword';

@Component({
  selector: 'app-list-keyword',
  templateUrl: './ListKeyword.component.html'
})
export class ListKeyword extends AbstractPage implements OnInit {

  public static readonly PAGE_NAME: string = PAGE_NAME;

  private keywordFacade: KeywordFacade;
  private route: ActivatedRoute;

  public dataForm: Keyword;
  public sources: any[];
  public fieldSearch: string[];

  constructor(dialog: MatDialog, keywordFacade: KeywordFacade, authenManager: AuthenManager, router: Router) {
  super(PAGE_NAME, dialog, keywordFacade, authenManager, router)
  this.keywordFacade = keywordFacade;
    this.fieldSearch = [
      "name",
      "details",
      "isTag"
    ];
    this.fieldTable = [ 
      {
        name: "name",
        label: "คีย์เวิร์ด",
        width: "200pt",
        class: "",formatColor: false, formatObject: [], formatArrary: false, formatImage: false,
        link: [
          {
            link: "https://www.chanyaban.com/keyword/",
            isField: false
          },
          {
            link: "name",
            isField: true
          }
        ],
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
      },
      {
        name: "isTag",
        label: "แท็ก",
        width: "200pt",
        class: "",formatColor: false, formatObject: [], formatArrary: false, formatImage: false,
        link: [],
        formatDate: false,
        formatId: false,
        align: "center"
      },
      {
        name: "status",
        label: "สถานะ",
        width: "200pt",
        class: "",formatColor: false, formatObject: [], formatArrary: false, formatImage: false,
        link: [],
        formatDate: false,
        formatId: false,
        align: "center"
      }
      // {
      //   name: "isBanned",
      //   label: "แบน",
      //   width: "200pt",
      //   class: "",formatColor: false, formatObject: [], formatArrary: false, formatImage: false,
      //   link: [],
      //   formatDate: false,
      //   formatId: false,
      //   align: "center"
      // }
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
        name: "คีย์เวิร์ด",
        field: "name",
        type: "text",
        placeholder: "",
        required: true,
        disabled: false,
        subField: []
      }, 
      {
        name: "แท็ก",
        field: "isTag",
        type: "boolean",
        placeholder: "",
        required: false,
        disabled: false,
        subField: []
      },
      {
        name: "สถานะ",
        field: "status",
        type: "select",
        placeholder: "",
        required: true,
        disabled: false,
        subField: []
      },
      // {
      //   name: "แบน",
      //   field: "isBanned",
      //   type: "boolean",
      //   placeholder: "",
      //   required: false,
      //   disabled: false,
      //   subField: []
      // },
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
    this.dataForm = new Keyword();
    this.dataForm._id = undefined; 
    this.dataForm.name = ""; 
    this.dataForm.details = "";
    this.dataForm.isTag = false;
    this.dataForm.status = "unclassified";
    // this.dataForm.isBanned = false;
  }

  public clickCreateForm(): void {
    this.drawer.toggle();
    this.setFields();
  }

  public clickEditForm(data: any): void {
    this.drawer.toggle();
    data.status = data.status ? data.status : "unclassified";
    // this.fields[2].disabled = true;
    this.dataForm = JSON.parse(JSON.stringify(data));
  }
}