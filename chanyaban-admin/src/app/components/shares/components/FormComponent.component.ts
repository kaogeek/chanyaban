/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { ColorEvent } from 'ngx-color';
import { MatDialog } from '@angular/material'; 
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { DialogWarningComponent } from '../dialog/DialogWarningComponent.component';
import { KeywordFacade, PersonaTypeFacade, JournalistFacade, SourceTypeFacade, NewsAgencyFacade, NewsCategoryFacade } from '../../../services/services';

export interface Field {
  name: string;
  field: string;
  type: "select" | "password" | "object" | "text" | "textarea" | "contentEditor" | "integer" | "float" | "date" | "boolean" | "color" | "autocomp" | "autocompSelector";
  placeholder: string;
  required: boolean;
  disabled: boolean;
  subField: Field[];
}

export interface FieldRadio {
  name: string;
  fieldSelect: string;
  field: Field[];
}

@Component({
  selector: 'admin-form-component',
  templateUrl: './FormComponent.component.html'
})
export class FormComponent implements OnInit {
 
  private dialog: MatDialog;
  private keywordFacade: KeywordFacade;
  private personaTypeFacade: PersonaTypeFacade;
  private journalistFacade: JournalistFacade;
  private sourceTypeFacade: SourceTypeFacade;
  private newsAgencyFacade: NewsAgencyFacade;
  private newsCategoryFacade: NewsCategoryFacade;
  private dataOriginal: any;

  @Input()
  public fieldRadios: FieldRadio[];
  @Input()
  public fields: Field[];
  @Input()
  public title: string;
  @Input()
  public data: any;
  @Output()
  public close: EventEmitter<any> = new EventEmitter();
  @Output()
  public save: EventEmitter<any> = new EventEmitter();
  public submitted = false;
  public Editor = ClassicEditor;

  constructor(dialog: MatDialog,keywordFacade: KeywordFacade,personaTypeFacade: PersonaTypeFacade,  
    journalistFacade: JournalistFacade,
    sourceTypeFacade: SourceTypeFacade,
    newsAgencyFacade: NewsAgencyFacade,
    newsCategoryFacade: NewsCategoryFacade) {
    this.dialog = dialog; 
    this.keywordFacade = keywordFacade; 
    this.personaTypeFacade = personaTypeFacade; 
    this.journalistFacade = journalistFacade;
    this.sourceTypeFacade = sourceTypeFacade;
    this.newsAgencyFacade = newsAgencyFacade;
    this.newsCategoryFacade = newsCategoryFacade;
  }

  public ngOnInit(): void {
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.dataOriginal = JSON.parse(JSON.stringify(this.data));
  }

  private checkIsEditData(): boolean {
    if (this.fieldRadios) {
      for (let fieldRadio of this.fieldRadios) {
        for (let field of fieldRadio.field) {
          if (this.data[field.field] !== this.dataOriginal[field.field]) {
            return true;
          }
        }
      }
    }
    for (let field of this.fields) {
      if (this.data[field.field] !== this.dataOriginal[field.field]) {
        return true;
      }
    }
    return false;
  }

  private checkMatchPassword(index: number): boolean {
    let pass: any = document.getElementById("f" + index);
    let rePass: any = document.getElementById("f" + index + "matchpassword");
    if (pass.value !== rePass.value) {
      document.getElementById("f" + index + "matchpassword").focus();
      return false;
    }
    return true
  }

  private checkIsFieldRadios(): boolean {
    let frIndex = 0;
    if (this.fieldRadios) {
      let index = 0;
      for (let fieldRadio of this.fieldRadios) {
        for (let field of fieldRadio.field) {
          if ((field.type === "integer" || field.type === "float") && !field.required && field.field === fieldRadio.fieldSelect && this.data[field.field]) {
            if (this.data[field.field] < 1 && field.type === "float") {
              return true;
            } else if ((!Number.isInteger(this.data[field.field]) || this.data[field.field] < 0) && field.type === "integer") {
              return true;
            }
          } else if (field.required && field.field === fieldRadio.fieldSelect) {
            if ((field.type === "text" || field.type === "textarea") && this.data[field.field] !== undefined && this.data[field.field] !== "" )  {
                if (this.data[field.field].trim() === "") {
                  document.getElementById("fr" + frIndex + "f" + index).focus();
                  return true;
                }
            } else if ((field.type === "integer" || field.type === "float")) {
              if (!this.data[field.field]) {
                document.getElementById("fr" + frIndex + "f" + index).focus();
                return true;
              } else if (this.data[field.field] < 1 && field.type === "float") {
                document.getElementById("fr" + frIndex + "f" + index).focus();
                return true;
              } else if ((!Number.isInteger(this.data[field.field]) || this.data[field.field] < 0) && field.type === "integer") {
                document.getElementById("fr" + frIndex + "f" + index).focus();
                return true;
              }
            } else if (!this.data[field.field]) {
              return true;
            }
          }
          index++;
        }
        frIndex++;
      }
      return false;
    } else {
      return false;
    }
  }

  private checkIsField(): boolean {
    let index = 0;
    for (let field of this.fields) {
      if (!field.required) {
        if ((field.type === "integer" || field.type === "float") && this.data[field.field]) {
          if (this.data[field.field] < 1 && field.type === "float") {
            return true;
          } else if ((!Number.isInteger(this.data[field.field]) || this.data[field.field] < 0) && field.type === "integer") {
            return true;
          }
        }
      } else {
        if (field.type === "boolean") {
          if (this.data[field.field] !== true && this.data[field.field] !== false) { 
            return true;
          }
        } else if (field.type === "text" || field.type === "textarea") {
          if (this.data[field.field].trim() === "") {
            document.getElementById("f" + index).focus();
            return true;
          }
        } else if (field.type === "integer" || field.type === "float") {
          if (!this.data[field.field]) {
            document.getElementById("f" + index).focus();
            return true;
          } else if (this.data[field.field] < 1 && field.type === "float") {
            document.getElementById("f" + index).focus();
            return true;
          } else if ((!Number.isInteger(this.data[field.field]) || this.data[field.field] < 0) && field.type === "integer") {
            document.getElementById("f" + index).focus();
            return true;
          }
        } else if (field.type === "password") {
          if (this.data[field.field].trim == "") {
            document.getElementById("f" + index).focus();
            return true;
          } else if (!this.checkMatchPassword(index)) {
            return true;
          }
        } else if (!this.data[field.field]) {
          return true;
        }
      }
      index++;
    }
    return false;
  } 

  public checkAutoCompFacade(field: string): any {
    if (field === "keywords") {
      return this.keywordFacade;
    } else if (field === "personaType") {
      return this.personaTypeFacade;
    } else if (field === "journalist") {
      return this.journalistFacade;
    } else if (field === "newsAgency") {
      return this.newsAgencyFacade;
    } else if (field === "newsCategory") {
      return this.newsCategoryFacade;
    } else if (field === "sourceType") {
      return this.sourceTypeFacade;
    }
    return "";
  }

  public checkIsInteger(num: number): boolean {
    return Number.isInteger(num);
  }

  public handleColorChange($event: ColorEvent) {
    for (let f of this.fields) {
      if (f.type === "color") {
        this.data[f.field] = $event.color.hex;
        break;
      }
    }
  }

  public clickCloseDrawer() {
    if (this.checkIsEditData()) {
      let dialogRef = this.dialog.open(DialogWarningComponent, {
        data: {
          title: "คุณมีข้อมูลที่ยังไม่ได้บันทึกต้องการปิดหรือไม่"
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.submitted = false;
          this.close.emit(null);
        }
      });
    } else {
      this.submitted = false;
      this.close.emit(null);
    }
  }

  public clickSave() {
    this.submitted = true;
    if (this.checkIsFieldRadios() || this.checkIsField()) {
      return;
    }
    this.submitted = false;
    this.save.emit(null);
  }

  public textTrim(text: string): string {
    return !text ? "" : text.trim();
  }
}
