import { Component, OnInit } from '@angular/core';
import { NewsAgencyFacade } from '../../../services/facade/NewsAgencyFacade.service';
import { AbstractPage } from '../AbstractPage';
import { MatDialog } from '@angular/material/dialog';  
import { Router } from '@angular/router';
import { NewsAgency } from '../../../models/models';
import { AuthenManager } from '../../../services/services';

const PAGE_NAME: string = 'newsagency';

@Component({
  selector: 'app-list-news-agency',
  templateUrl: './ListNewsAgency.component.html'
})
export class ListNewsAgency extends AbstractPage implements OnInit {

  public static readonly PAGE_NAME: string = PAGE_NAME;

  private newsAgencyFacade: NewsAgencyFacade;

  public dataForm: NewsAgency;
  public sources: any[];
  public fieldSearch: string[];

  constructor(router: Router, newsAgencyFacade: NewsAgencyFacade, dialog: MatDialog, authenManager: AuthenManager) {
    super(PAGE_NAME, dialog, newsAgencyFacade, authenManager, router); 
    this.newsAgencyFacade = newsAgencyFacade;
    this.fieldSearch = [
      "name",
      "grade"
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
        width: "250pt",
        class: "",formatColor: false, formatObject: [], formatArrary: false, formatImage: false,
        link: [],
        formatDate: false,
        formatId: false,
        align: "left"
      },
      {
        name: "grade",
        label: "เกรด",
        width: "250pt",
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
      isDelete: false,
      isBack: false
    };
    this.setFields();
  }

  public ngOnInit() { 
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
      // {
      //   name: "เกรด",
      //   field: "grade",
      //   type: "integer",
      //   placeholder: "",
      //   required: false,
      //   disabled: false,
      //   subField: []
      // }
    ];
    this.dataForm = new NewsAgency();
    this.dataForm._id = undefined;
    this.dataForm.icon = ""; 
    this.dataForm.name = ""; 
    // this.dataForm.grade = undefined; 
  }

  public clickCreateForm(): void { 
    this.drawer.toggle();
    this.setFields();
  }

  public clickEditForm(data: any): void { 
    this.drawer.toggle();
    this.dataForm = JSON.parse(JSON.stringify(data));
  }

  // public clickDelete(data: NewsAgency): void {
  //   let cloneData = JSON.parse(JSON.stringify(data));
  //   this.newsAgencyFacade.deleteNewsAgency(data._id).then((doc: any) => {
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
  //     this.newsAgencyFacade.updateNewsAgency(data._id, data).then((res) => {
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
  //     this.newsAgencyFacade.addNewsAgency(data).then((doc: any) => {
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
