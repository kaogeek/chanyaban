/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

import { Component, OnInit } from '@angular/core';
import { SourceFacade } from '../../../services/facade/SourceFacade.service';
import { AbstractPage } from '../AbstractPage';
import { MatDialog } from '@angular/material/dialog';
import { Source } from '../../../models/Source';
import { Router } from '@angular/router';
import { DialogInstanceComponent, DialogAlert } from '../../shares/shares';
import { CountryFacade, SourceTypeFacade, NewsAgencyFacade, NewsCategoryFacade, AuthenManager } from '../../../services/services';

const PAGE_NAME: string = 'source';

@Component({
  selector: 'app-list-source',
  templateUrl: './ListSource.component.html'
})
export class ListSource extends AbstractPage implements OnInit {

  public static readonly PAGE_NAME: string = PAGE_NAME;

  private sourceFacade: SourceFacade;

  public dataForm: Source;
  public dataFormOrigin: Source;
  public sources: any[];
  public selectSourceType: any;
  public fieldSearch: string[];
  public isSocialLoading: boolean;
  public isTestUpdateLoading: boolean;
  public isTestDataLoading: boolean;
  public isTestUpdate: boolean;
  public isTestData: boolean;
  public isSourceType: boolean;
  public isSocial: boolean;
  public times: {
    name: string,
    value: number
  }[] = [
      {
        name: "ไม่เปิดใช้งาน",
        value: 0
      },
      {
        name: "ทุก 10 นาที",
        // value: 600000
        value: 1
      },
      {
        name: "ทุก 30 นาที",
        // value: 1800000
        value: 3
      },
      {
        name: "ทุก 1 ชั่วโมง",
        // value: 3600000
        value: 6
      },
      {
        name: "ทุก 2 ชั่วโมง",
        // value: 7200000
        value: 12
      },
      {
        name: "ทุก 3 ชั่วโมง",
        // value: 7200000
        value: 18
      }
    ];

  constructor(router: Router, sourceFacade: SourceFacade, dialog: MatDialog,
    public countryFacade: CountryFacade,
    public sourceTypeFacade: SourceTypeFacade,
    public newsAgencyFacade: NewsAgencyFacade,
    public newsCategoryFacade: NewsCategoryFacade, authenManager: AuthenManager) {
    super(PAGE_NAME, dialog, sourceFacade, authenManager, router);
    this.sourceFacade = sourceFacade;
    this.isSourceType = false;
    this.fieldSearch = [
      "name",
      "link"
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
        link: [
          {
            link: "link",
            isField: true
          }
        ],
        formatDate: false,
        formatId: false,
        align: "left"
      },
      {
        name: "name",
        label: "ชื่อแหล่งที่มา",
        width: "250pt",
        class: "",
        formatColor: false,
        formatObject: [],
        formatArrary: false,
        formatImage: false,
        link: [
          {
            link: "link",
            isField: true
          }
        ],
        formatDate: false,
        formatId: false,
        align: "left"
      },
      {
        name: "country",
        label: "ประเทศ",
        width: "100pt",
        class: "",
        formatColor: false,
        formatObject: ["name"],
        formatArrary: false,
        formatImage: false,
        link: [],
        formatDate: false,
        formatId: false,
        align: "left"
      },
      {
        name: "city",
        label: "เมือง",
        width: "100pt",
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
        name: "newsAgency",
        label: "สำนักข่าว",
        width: "100pt",
        class: "",
        formatColor: false,
        formatObject: ["name"],
        formatArrary: false,
        formatImage: false,
        link: [
          {
            link: "/newsagency?search=",
            isField: false
          },
          {
            link: ["newsAgency", "name"],
            isField: true
          }
        ],
        formatDate: false,
        formatId: false,
        align: "left"
      },
      {
        name: "sourceType",
        label: "ประเภทแหล่งที่มา",
        width: "100pt",
        class: "",
        formatColor: false,
        formatObject: ["name"],
        formatArrary: false,
        formatImage: false,
        link: [
          {
            link: "/sourcetype?search=",
            isField: false
          },
          {
            link: ["sourceType", "name"],
            isField: true
          }
        ],
        formatDate: false,
        formatId: false,
        align: "left"
      },
      {
        name: "newsCategory",
        label: "หทวดหมู่ข่าว",
        width: "100pt",
        class: "",
        formatColor: false,
        formatObject: ["name"],
        formatArrary: false,
        formatImage: false,
        link: [
          {
            link: "/newscategory?search=",
            isField: false
          },
          {
            link: ["newsCategory", "name"],
            isField: true
          }
        ],
        formatDate: false,
        formatId: false,
        align: "left"
      },
      {
        name: "link",
        label: "link source",
        width: "150pt",
        class: "",
        formatColor: false,
        formatObject: [],
        formatArrary: false,
        formatImage: false,
        link: [
          {
            link: "link",
            isField: true
          }
        ],
        formatDate: false,
        formatId: false,
        align: "left"
      }
    ]
    this.actions = {
      isRunTest: true,
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
    this.dataForm = new Source();
    this.dataForm._id = undefined;
    this.dataForm.image = "";
    this.dataForm.name = "";
    this.dataForm.newsAgency = "";
    this.dataForm.sourceType = "";
    this.dataForm.newsCategory = "";
    this.dataForm.selectorUpdate = {
      find: "",
      paginate: "",
      pageLimit: 1,
      setLink: "",
      addLink: "",
      preAddLink: ""
    };
    this.dataForm.selectorData = {
      find: "",
      preAddLinkImg: "",
      setData: {
        title: "",
        content: "",
        img: "",
        tags: "",
        date: "",
        journalistImage: "",
        journalistName: "",
      },
      configDate: {
        isConvert: false,
        format: "",
        locale: ""
      }
    };
    this.dataForm.setTimeout = 0;
  }

  public selectedSourceType(data: any): void {
    this.selectSourceType = data;
  }

  public clickCreateForm(): void {
    // this.router.navigateByUrl("addsource");
    this.isSocial = false;
    this.isTestUpdate = false;
    this.isTestData = false;
    this.isSourceType = false;
    this.selectSourceType = undefined;
    this.drawer.toggle();
    this.setFields();
  }

  public clickEditForm(data: any): void {
    this.drawer.toggle();
    this.isSocial = false;
    this.isTestUpdate = true;
    this.isTestData = true;
    this.isSourceType = true;
    this.dataForm = JSON.parse(JSON.stringify(data));
    this.dataFormOrigin = JSON.parse(JSON.stringify(data));
  }

  public clickTestSocial(): void {
    if (this.dataForm.link === "") {
      return this.dialogWarning("กรุณาใส่ ลิงค์");
    }
    if (!this.selectSourceType || (this.selectSourceType.name !== "facebook" && this.selectSourceType.name !== "twitter")) {
      return this.dialogWarning("กรุณาใส่ ประเภทแหล่งที่มา");
    }
    let data = {
      link: this.dataForm.link,
      name: this.selectSourceType.name
    }
    this.isSocialLoading = true;
    this.sourceFacade.testSocial(data).then((res) => {
      // alert(JSON.stringify(res));
      this.dialog.open(DialogInstanceComponent, {
        data: {
          title: "test หัวข่าว",
          items: res,
          isData: true
        }
      });
      this.isSocial = true;
      this.isSocialLoading = false;
    }).catch((err) => {
      this.isSocial = false;
      this.isSocialLoading = false;
      console.log(err);
    });
  }

  public clickTestSelectorUpdate(): void {
    if (this.dataForm.link === "") {
      return this.dialogWarning("กรุณาใส่ ลิงค์");
    }
    if (this.dataForm.selectorUpdate.find === "") {
      return this.dialogWarning("กรุณาใส่ selector หัวข่าว");
    }
    if (this.dataForm.selectorUpdate.setLink === "") {
      return this.dialogWarning("กรุณาใส่ selector ลิงค์่ข่าว");
    }
    let data = {
      link: this.dataForm.link,
      find: this.dataForm.selectorUpdate.find,
      paginate: this.dataForm.selectorUpdate.paginate,
      pageLimit: this.dataForm.selectorUpdate.pageLimit,
      setLink: this.dataForm.selectorUpdate.setLink,
      preAddLink: this.dataForm.selectorUpdate.preAddLink,
      addLink: this.dataForm.selectorUpdate.addLink
    }
    this.isTestUpdateLoading = true;
    this.sourceFacade.testSelectorUpdate(data).then((res) => {
      // alert(JSON.stringify(res));
      this.dialog.open(DialogInstanceComponent, {
        data: {
          title: "test หัวข่าว",
          items: res,
          isData: false
        }
      });
      this.isTestUpdate = true;
      this.isTestUpdateLoading = false;
      if (this.dataForm._id) {
        this.dataFormOrigin.selectorUpdate = JSON.parse(JSON.stringify(this.dataForm.selectorUpdate));
      }
    }).catch((err) => {
      this.isTestUpdate = false;
      this.isTestUpdateLoading = false;
      console.log(err);
    });
  }

  public clickTestSelectorData(): void {
    if (this.dataForm.link === "") {
      return this.dialogWarning("กรุณาใส่ ลิงค์");
    }
    if (this.dataForm.selectorUpdate.find === "") {
      return this.dialogWarning("กรุณาใส่ selector หัวข่าว");
    }
    if (this.dataForm.selectorUpdate.setLink === "") {
      return this.dialogWarning("กรุณาใส่ selector ลิงค์่ข่าว");
    }
    if (this.dataForm.selectorData.find === "") {
      return this.dialogWarning("กรุณาใส่ selector หัวข่าว");
    }
    if (this.dataForm.selectorData.setData.title === "") {
      return this.dialogWarning("กรุณาใส่ title");
    }
    if (this.dataForm.selectorData.setData.content === "") {
      return this.dialogWarning("กรุณาใส่ content");
    }
    if (this.dataForm.selectorData.setData.img === "") {
      return this.dialogWarning("กรุณาใส่ img");
    }
    if (this.dataForm.selectorData.setData.date === "") {
      return this.dialogWarning("กรุณาใส่ date");
    }
    let data = {
      link: this.dataForm.link,
      selectorUpdate: this.dataForm.selectorUpdate,
      selectorData: this.dataForm.selectorData
    }
    this.isTestDataLoading = true;
    this.sourceFacade.testSelectorData(data).then((res) => {
      this.dialog.open(DialogInstanceComponent, {
        data: {
          title: "test เนื้อข่าว",
          items: res,
          isData: true
        }
      });
      this.isTestData = true;
      this.isTestDataLoading = false;
      if (this.dataForm._id) {
        this.dataFormOrigin.selectorData = JSON.parse(JSON.stringify(this.dataForm.selectorData));
      }
    }).catch((err) => {
      this.isTestData = false;
      this.isTestDataLoading = false;
      console.log(err);
    });
  }

  private setIsScraping(id: any, isScraping: boolean, isUsable?: boolean): void {
    let index = 0;
    let dataTable = this.table.data;
    for (let d of dataTable) {
      if (d._id === id) {
        dataTable[index].isScraping = isScraping;
        if (isUsable !== undefined && isUsable !== null) {
          dataTable[index].isUsable = isUsable;
        }
        break;
      }
      index++;
    }
    this.table.setTableConfig(dataTable);
  }

  public clickRunTest(data: any): void {
    let dialog = this.dialog.open(DialogAlert, {
      data: {
        title: "คุณต้องการ run " + data.name + "หรือไม่ ?"
      }
    });
    dialog.afterClosed().subscribe((res) => {
      if (res) {
        this.setIsScraping(data._id, true);
        this.sourceFacade.runTest(data._id).then((res) => {
          this.setIsScraping(data._id, false, true);
          this.dialog.open(DialogInstanceComponent, {
            data: {
              title: "run",
              items: res,
              isData: true
            }
          });
        }).catch((err) => {
          this.dialogWarning(err.message);
          // if (err.error !== "Is scraping!") {
            this.setIsScraping(data._id, false, false);
          // }
        });
      }
    });
  }

  public clickStopTest(data: any): void {
    let dialog = this.dialog.open(DialogAlert, {
      data: {
        title: "คุณต้องการ stop " + data.name + "หรือไม่ ?"
      }
    });
    dialog.afterClosed().subscribe((res) => {
      if (res) {
        this.sourceFacade.stopTest(data._id).then((res) => {
          this.setIsScraping(data._id, false);
        }).catch((err) => {
          this.dialogWarning(err.message);
        });
      }
    });
  }

  public clickDelete(data: any): void {
    let cloneData = JSON.parse(JSON.stringify(data));
    this.sourceFacade.deleteSource(cloneData._id).then((doc: any) => {
      let index = 0;
      let dataTable = this.table.data;
      for (let d of dataTable) {
        if (d._id == cloneData._id) {
          dataTable[index] = cloneData;
          dataTable.splice(index, 1);
          this.table.setTableConfig(dataTable);
          this.dialogWarning("ลบข้อมูลสำเร็จ");
          break;
        }
        index++;
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  public clickSave(): Promise<any> {
    if (!this.dataForm.name) {
      this.dialogWarning("กรุณาใส่ ชื่อแหล่งที่มา");
      return;
    }
    if (!this.dataForm.newsAgency) {
      this.dialogWarning("กรุณาใส่ สือ");
      return;
    }
    if (!this.dataForm.sourceType) {
      this.dialogWarning("กรุณาใส่ ประเภทแหล่งที่มา");
      return;
    }
    if (!this.dataForm.newsCategory) {
      this.dialogWarning("กรุณาใส่ หมวดหมู่ข่าว");
      return;
    }
    if (this.dataForm.setTimeout === null && this.dataForm.setTimeout === undefined) {
      this.dialogWarning("กรุณาใส่ ความถี่");
      return;
    }
    if (this.dataForm._id) {
      if (!this.isTestUpdate || (JSON.stringify(this.dataForm.selectorUpdate) !== JSON.stringify(this.dataFormOrigin.selectorUpdate) && this.selectSourceType.name === "web")) {
        this.isTestUpdate = false;
        this.dialogWarning("กรุณา test หัวข่าว");
        return;
      }
      if (!this.isTestData || (JSON.stringify(this.dataForm.selectorData) !== JSON.stringify(this.dataFormOrigin.selectorData) && this.selectSourceType.name === "web")) {
        this.isTestData = false;
        this.dialogWarning("กรุณา test เนื้อข่าว");
        return;
      }
    } else {
      if ((!this.isTestUpdate || !this.isTestData) && this.selectSourceType.name === "web") {
        this.dialogWarning("กรุณา test ให้ครบ 2 หัวข้อ");
        return;
      }
    }
    if (!this.isSocial && (this.selectSourceType.name === "twitter" || this.selectSourceType.name === "facebook")) {
      this.dialogWarning("กรุณา test");
      return;
    }
    this.dataForm.isUsable = true;
    super.clickSave(this.dataForm);
  }
}
