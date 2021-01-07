import { Component, OnInit, Input, ViewChild, ElementRef, SimpleChanges } from '@angular/core';
import { fromEvent } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators'; 
import { MatDialog } from '@angular/material/dialog';
import { DialogWarningComponent } from '../dialog/DialogWarningComponent.component';
import { SearchFilter } from '../../../models/SearchFilter';

@Component({
  selector: 'admin-autocomp-selector',
  templateUrl: './AutoCompSelector.component.html'
})
export class AutoCompSelector implements OnInit {

  private dialog: MatDialog;

  @ViewChild("inPut", {static: false})
  public inPut: ElementRef;
  @Input("facade")
  public facade: any;
  @Input("title")
  public title: string;
  @Input("field")
  public field: string;
  @Input("fieldSearch")
  public fieldSearch: string | string[];
  @Input("data")
  public data: any; 
  public options: any;
  public isLoading: boolean;

  constructor(dialog: MatDialog) {
    this.dialog = dialog;
    this.options = [];
    this.isLoading = false;
  }

  public ngOnInit() {
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.data[this.field] = this.data[this.field] ? this.data[this.field] : [];
    this.clearAutoComp();
    if (this.data[this.field].length > 0) {
      let search: SearchFilter = new SearchFilter(); 
      search.isCount = false;
      let whereIn = [];
      for (let data of this.data[this.field]) {
        whereIn.push(data);
      }
      search.whereConditions = {
        _id: {
          $in: whereIn
        }
      };
      this.facade.search(search).then((res) => {
        this.data[this.field] = res;
      }).catch((err) => {
        this.dialogWarning(err.message);
      });
    } else {
      this.data[this.field] = [];
    }
  }

  public ngAfterViewInit(): void {
    fromEvent(this.inPut.nativeElement, 'keyup').pipe(
      // get value
      map((event: any) => {
        return event.target.value;
      })
      // Time in milliseconds between key events
      , debounceTime(1000)
      // If previous query is diffent from current   
      , distinctUntilChanged()
      // subscription for response
    ).subscribe((text: string) => {
      this.isLoading = true;
      this.keyUpAutoComp(text);
    });
  }

  private stopIsloading(): void {
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }

  private dialogWarning(message: string): void {
    this.dialog.open(DialogWarningComponent, {
      data: {
        title: message,
        error: true
      }
    });
  }

  private checkSelected(id: any): boolean {
    for (let d of this.data[this.field]) {
      if (d._id == id) {
        return true;
      }
    }
    return false;
  }

  private keyUpAutoComp(value: string): void { 
    let searchText = value.trim();
    let search: SearchFilter = new SearchFilter();
    search.whereConditions = {
      name: {
        $regex: searchText
      }
    };
    search.limit = 30;
    search.isCount = false;
    let whereIn = [];
    for (let data of this.data[this.field]) {
      whereIn.push(data);
    }
    this.facade.search(search).then((res) => {
        this.options = res.map(obj => {
          var rObj: any = obj;
          rObj["selected"] = this.checkSelected(obj._id);
          return rObj;
        });
        this.stopIsloading();
    }).catch((err) => {
        this.stopIsloading();
      this.dialogWarning(err.message);
    }); 
  }

  public changeSelect(value: any, del?: boolean): void {
    if (value.selected && !del) {
      this.data[this.field].push(value);
    } else {
      let index = 0;
      for (let d of this.data[this.field]) {
        if (d._id == value._id) {
          this.data[this.field].splice(index, 1);
          break;
        }
        index++;
      }
    }
  }

  public clearAutoComp(): void {
    if (this.inPut) {
      this.inPut.nativeElement.value = "";
    }
    this.options = [];
  }
}
