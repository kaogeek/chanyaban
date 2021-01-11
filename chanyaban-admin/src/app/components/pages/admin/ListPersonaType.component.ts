/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

import { Component, OnInit } from '@angular/core';
import { PersonaType } from '../../../models/models';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractPage } from '../AbstractPage';
import { MatDialog } from '@angular/material';
import { PersonaTypeFacade, AuthenManager } from '../../../services/services';

const PAGE_NAME: string = 'entitytype';

@Component({
  selector: 'app-list-persona-type',
  templateUrl: './ListPersonaType.component.html'
})
export class ListPersonaType extends AbstractPage implements OnInit {

  public static readonly PAGE_NAME: string = PAGE_NAME;

  private personaTypeFacade: PersonaTypeFacade;
  private route: ActivatedRoute;

  public dataForm: PersonaType;
  public sources: any[];
  public fieldSearch: string[];

  constructor(dialog: MatDialog, personaTypeFacade: PersonaTypeFacade, authenManager: AuthenManager, router: Router) {
  super(PAGE_NAME, dialog, personaTypeFacade, authenManager, router)
  this.personaTypeFacade = personaTypeFacade;
    this.fieldSearch = [
      "name",
      "details"
    ];
    this.fieldTable = [ 
      {
        name: "icon",
        label: "ไอคอน",
        width: "100pt",
        class: "",formatColor: false, formatObject: [], formatArrary: false, formatImage: true,
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
      }, 
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
        name: "name",
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
    this.dataForm = new PersonaType();
    this.dataForm._id = undefined; 
    this.dataForm.icon = ""; 
    this.dataForm.name = ""; 
    this.dataForm.details = ""; 
  }

  public clickCreateForm(): void {
    this.drawer.toggle();
    this.setFields();
  }

  public clickEditForm(data: any): void {
    this.drawer.toggle();
    this.fields[2].disabled = true;
    this.dataForm = JSON.parse(JSON.stringify(data));
  }

  // public clickDelete(data: any): void {
  //   let cloneData = JSON.parse(JSON.stringify(data));
  //   this.personaTypeFacade.deletePersonaType(data._id).then((doc: any) => {
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
  //     this.personaTypeFacade.updatePersonaType(data._id , data).then((res) => {
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
  //     this.personaTypeFacade.addPersonaType(data).then((doc: any) => {
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