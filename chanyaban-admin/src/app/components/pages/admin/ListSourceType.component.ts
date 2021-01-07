import { Component, OnInit } from '@angular/core';
import { SourceType } from '../../../models/models';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractPage } from '../AbstractPage';
import { MatDialog } from '@angular/material';
import { SourceTypeFacade, AuthenManager } from '../../../services/services';

const PAGE_NAME: string = 'sourcetype';

@Component({
  selector: 'app-list-source-type',
  templateUrl: './ListSourceType.component.html'
})
export class ListSourceType extends AbstractPage implements OnInit {

  public static readonly PAGE_NAME: string = PAGE_NAME;

  private sourceTypeFacade: SourceTypeFacade;
  private route: ActivatedRoute;

  public dataForm: SourceType;
  public sources: any[];
  public fieldSearch: string[];

  constructor(dialog: MatDialog, sourceTypeFacade: SourceTypeFacade, authenManager: AuthenManager, router: Router) {
    super(PAGE_NAME, dialog, sourceTypeFacade, authenManager, router)
    this.sourceTypeFacade = sourceTypeFacade;
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
        class: "", formatColor: false, formatObject: [], formatArrary: false, formatImage: false,
        link: [],
        formatDate: false,
        formatId: false,
        align: "left"
      },
      {
        name: "details",
        label: "รายละเอียด",
        width: "350pt",
        class: "", formatColor: false, formatObject: [], formatArrary: false, formatImage: false,
        link: [],
        formatDate: false,
        formatId: false,
        align: "left"
      },
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
    this.dataForm = new SourceType();
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
}