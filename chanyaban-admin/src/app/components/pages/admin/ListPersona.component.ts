import { Component, OnInit } from '@angular/core';
import { Persona } from '../../../models/models';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractPage } from '../AbstractPage';
import { MatDialog } from '@angular/material';
import { PersonaFacade, AuthenManager } from '../../../services/services';

const PAGE_NAME: string = 'entity';

@Component({
  selector: 'app-list-persona',
  templateUrl: './ListPersona.component.html'
})
export class ListPersona extends AbstractPage implements OnInit {

  public static readonly PAGE_NAME: string = PAGE_NAME;

  private personaFacade: PersonaFacade;
  private route: ActivatedRoute;

  public dataForm: Persona;
  public fieldSearch: string[];

  constructor(personaFacade: PersonaFacade, dialog: MatDialog, authenManager: AuthenManager, router: Router) {
    super(PAGE_NAME, dialog, personaFacade, authenManager, router)
    this.personaFacade = personaFacade;
    this.fieldSearch = [
      "name",
      "details",
      // "type",
      "isTag"
    ];
    this.fieldTable = [
      {
        name: "image",
        label: "รูป",
        width: "100pt",
        class: "",
        formatColor: false,
        formatObject: [],
        formatArrary: false,
        formatImage: true,
        link: [],
        formatDate: false,
        formatId: false,
        align: "left"
      },
      {
        name: "name",
        label: "ชื่อ",
        width: "150pt",
        class: "",
        formatColor: false,
        formatObject: [],
        formatArrary: false,
        formatImage: false,
        link: [
          {
            link: "https://www.chanyaban.com/keyword/:",
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
        name: "personaType",
        label: "ประเภท",
        width: "150pt",
        class: "",
        formatColor: false,
        formatObject: ["name"],
        formatArrary: false,
        formatImage: false,
        link: [
          {
            link: "/personatype?search=",
            isField: false
          },
          {
            link: ["personaType", "name"],
            isField: true
          }
        ],
        formatDate: false,
        formatId: false,
        align: "left"
      },
      {
        name: "keywords",
        label: "คีย์เวิร์ดที่เกี่ยวข้อง",
        width: "250pt",
        class: "",
        formatColor: false,
        formatObject: [],
        formatArrary: {
          color: "",
          bgColor: "",
          fields: [],
          dataKey: "name"
        },
        formatImage: false,
        link: [
          {
            link: "/keyword?search=",
            isField: false
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
        class: "",
        formatColor: false,
        formatObject: [],
        formatArrary: false,
        formatImage: false,
        link: [],
        formatDate: false,
        formatId: false,
        align: "left"
      }
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
        name: "รูป",
        field: "image",
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
        name: "ประเภท",
        field: "personaType",
        type: "autocomp",
        placeholder: "",
        required: true,
        disabled: false,
        subField: []
      },
      {
        name: "keywords",
        field: "keywords",
        type: "autocompSelector",
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
    this.dataForm = new Persona();
    this.dataForm._id = undefined;
    this.dataForm.name = "";
    this.dataForm.details = "";
    this.dataForm.personaType = "";
    this.dataForm.keywords = [];
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
  //   this.personaFacade.deletePersona(data._id).then((doc: any) => {
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

  public clickSave(dataForm: Persona): Promise<any> {
    let data = JSON.parse(JSON.stringify(dataForm));
    let keywords = [];
    for (const d of data.keywords) {
      keywords.push(d._id);
    }
    data.keywords = keywords;
    super.clickSave(data);
    return;
    // if (data._id) {
    //   data.modifiedDate = new Date();
    //   this.personaFacade.updatePersona(data._id, data).then((res) => {
    //     let index = 0;
    //     let dataTable = this.table.data;
    //     for (let d of dataTable) {
    //       if (d._id == res._id) { 
    //         dataTable[index] = res;
    //         break;
    //       }
    //       index++;
    //     }
    //     this.table.setTableConfig(dataTable);
    //     this.drawer.toggle();
    //   }).catch((err) => {
    //     console.log(err);
    //   });
    // } else {
    //   let date = new Date();
    //   data.createdDate = date;
    //   data.modifiedDate = date;
    //   this.personaFacade.addPersona(data).then((doc: any) => {
    //     this.table.data.push(doc);
    //     this.table.setTableConfig(this.table.data);
    //     this.drawer.toggle();
    //   }).catch((err) => {
    //     console.log(err);
    //   });
    // } 
  }
}