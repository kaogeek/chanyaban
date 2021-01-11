/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

import { Component, OnInit } from '@angular/core';
import { Config } from '../../../models/models';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractPage } from '../AbstractPage';
import { MatDialog } from '@angular/material'; 
import { DialogWarningComponent } from '../../shares/dialog/DialogWarningComponent.component';
import { ConfigFacade } from '../../../services/facade/ConfigFacade.service';
import { AuthenManager } from '../../../services/services';

const PAGE_NAME: string = 'config';

@Component({
  selector: 'app-list-config',
  templateUrl: './ListConfig.component.html'
})
export class ListConfig extends AbstractPage implements OnInit {

  public static readonly PAGE_NAME: string = PAGE_NAME;

  private configFacade: ConfigFacade;
  private route: ActivatedRoute;

  public dataForm: Config;
  public fieldSearch: string[]; 
  public valueBool: boolean;
  public valuetring: string;
  public valueNum: number;
  public orinalDataForm: Config;
  public submitted = false;

  constructor(configFacade: ConfigFacade, dialog: MatDialog, authenManager: AuthenManager, router: Router) {
    super(PAGE_NAME, dialog, configFacade, authenManager, router)
    this.configFacade = configFacade;
    this.fieldSearch = [
      "name",
      "type"
    ];
    this.fieldTable = [
      {
          name: "name",
          label: "ชื่อ",
          width: "200pt",
          class: "",
          formatColor: false,
          formatObject: [],
          formatArrary: false,
          formatImage: false,
          link: [],
          formatDate: false,
          formatId: false,
          align: "left"
        },
        {
          name: "type",
          label: "ประเภท",
          width: "200pt",
          class: "", 
          formatColor: false,
          formatObject: [],
          formatArrary: false,
          formatImage: false,
          link: [],
          formatDate: false,
          formatId: false,
          align: "left"
        },
        {
          name: "value",
          label: "ค่า",
          width: "300pt",
          class: "", 
          formatColor: false,
          formatObject: [],
          formatArrary: false,
          formatImage: false,
          link: [],
          formatDate: false,
          formatId: false,
          align: "left"
      },
  ];
    this.actions = {
      isRunTest: false,
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
    this.dataForm = new Config();
    this.dataForm.name = "";
    this.dataForm.type = "boolean";
    this.dataForm.value = "";
    this.valueBool = true;
    this.valuetring = "";
    this.valueNum = 0;
    this.orinalDataForm = JSON.parse(JSON.stringify(this.dataForm));
  }

  public clickCloseDrawer(): void {
      let pass = true;
      for (const key in this.orinalDataForm) {
          if (this.orinalDataForm[key] !== this.dataForm[key]) {
              pass = false;
              break;
          }
      }
      if (!pass) {
          let dialogRef = this.dialog.open(DialogWarningComponent, {
              data: {
                  title: "คุณมีข้อมูลที่ยังไม่ได้บันทึกต้องการปิดหรือไม่"
              }
          });
          dialogRef.afterClosed().subscribe(result => {
              if (result) {
                  this.submitted = false;
                  this.drawer.toggle();
              }
          });
      } else {
          this.drawer.toggle();
      }
  }

  public clickCreateForm(): void {
    this.drawer.toggle();
    this.setFields();
  }

  public clickEditForm(data: any): void {
    this.drawer.toggle();
    this.valueBool = true;
    this.valuetring = "";
    this.valueNum = 0;
    this.dataForm = JSON.parse(JSON.stringify(data));
    if (data.type === "boolean") {
        this.valueBool = (this.dataForm.value as boolean);
    }
    if (data.type === "string") {
        this.valuetring = (this.dataForm.value as string);
    }
    if (data.type === "number") {
        this.valueNum = (this.dataForm.value as any);
    }
    this.orinalDataForm = JSON.parse(JSON.stringify(data));
  } 

  public clickSave(dataForm: Config): Promise<any> {
    this.submitted = true;
    if (dataForm.name.trim() === "") {
        return;
    }
    if (dataForm.type === "boolean") {
        dataForm.value = this.valueBool;
    }
    if (dataForm.type === "string") {
        dataForm.value = this.valuetring;
    }
    if (dataForm.type === "number") {
        dataForm.value = this.valueNum;
    }
    dataForm.name = dataForm.name.trim();
    let data= JSON.parse(JSON.stringify(dataForm));
    super.clickSave(data).then(() => {
      this.submitted = false;
    }).catch(() => {
      this.submitted = false;
    }); 
  }
}