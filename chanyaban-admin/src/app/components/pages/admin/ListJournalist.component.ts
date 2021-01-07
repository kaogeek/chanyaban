import { Component, OnInit } from '@angular/core';
import { Journalist } from '../../../models/models';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractPage } from '../AbstractPage';
import { MatDialog } from '@angular/material';
import { JournalistFacade } from '../../../services/facade/JournalistFacade.service';
import { AuthenManager } from '../../../services/services';

const PAGE_NAME: string = 'journalist';

@Component({
  selector: 'app-list-journalist',
  templateUrl: './ListJournalist.component.html'
})
export class ListJournalist extends AbstractPage implements OnInit {

  public static readonly PAGE_NAME: string = PAGE_NAME;

  private route: ActivatedRoute;

  public dataForm: Journalist;
  public sources: any[];
  public fieldSearch: string[];

  constructor(dialog: MatDialog, private journalistFacade: JournalistFacade, authenManager: AuthenManager, router: Router) {
    super(PAGE_NAME, dialog, dialog, authenManager, router) 
    this.fieldSearch = [
      "name",
      "detail",
      "grade"
    ];
    this.fieldTable = [
      {
        name: "image",
        label: "รูป",
        width: "200pt",
        class: "", formatColor: false, formatObject: [], formatArrary: false, formatImage: true,
        link: [],
        formatDate: false,
        formatId: false,
        align: "left"
      },
      {
        name: "name",
        label: "ชื่อนักข่าว",
        width: "250pt",
        class: "", formatColor: false, formatObject: [], formatArrary: false, formatImage: false,
        link: [],
        formatDate: false,
        formatId: false,
        align: "left"
      },
      {
        name: "detail",
        label: "รายละเอียด",
        width: "450pt",
        class: "", formatColor: false, formatObject: [], formatArrary: false, formatImage: false,
        link: [],
        formatDate: false,
        formatId: false,
        align: "left"
      },
      {
        name: "source",
        label: "แหล่งที่มา",
        width: "450pt",
        class: "", formatColor: false, formatObject: [], formatArrary: false, formatImage: false,
        link: [],
        formatDate: false,
        formatId: false,
        align: "left"
      },
      // {
      //   name: "grade",
      //   label: "เกรด",
      //   width: "100pt",
      //   class: "", formatColor: false, formatObject: [], formatArrary: false, formatImage: false,
      //   link: [],
      //   formatDate: false,
      //   formatId: false,
      //   align: "left"
      // }
    ]
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
    this.fields = [
      {
        name: "แหล่งที่มา",
        field: "source",
        type: "select",
        placeholder: "",
        required: true,
        disabled: false,
        subField: []
      },
      {
        name: "รูป",
        field: "image",
        type: "text",
        placeholder: "",
        required: true,
        disabled: false,
        subField: []
      },
      {
        name: "ชื่อนักข่าว",
        field: "name",
        type: "text",
        placeholder: "",
        required: true,
        disabled: false,
        subField: []
      },
      {
        name: "รายละเอียด",
        field: "detail",
        type: "textarea",
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
      //   required: true,
      //   disabled: false,
      //   subField: []
      // },
    ];
    this.dataForm = new Journalist();
    this.dataForm._id = undefined;
    this.dataForm.image = "";
    this.dataForm.name = "";
    this.dataForm.detail = "";
    this.dataForm.grade = undefined;
  }

  public clickCreateForm(): void {
    this.drawer.toggle();
    this.setFields();
  }

  public clickEditForm(data: any): void {
    this.drawer.toggle();
    this.dataForm = JSON.parse(JSON.stringify(data));
  }
}