import { Component, OnInit, Input, ViewChild, ElementRef, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, fromEvent } from 'rxjs';
import { startWith, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { DialogWarningComponent } from '../dialog/DialogWarningComponent.component';
import { SearchFilter } from '../../../models/models';

export interface autoComp {
  _id: string;
  name: string;
}

@Component({
  selector: 'admin-autocomp',
  templateUrl: './AutoComp.component.html'
})
export class AutoComp implements OnInit {

  private dialog: MatDialog;

  @ViewChild("inPut", { static: false })
  public inPut: ElementRef;
  @Input("facade")
  public facade: any;
  @Input("title")
  public title: string;
  @Input("field")
  public field: string;
  @Input("data")
  public data: any;
  @Input("isDisabled")
  public isDisabledMain: boolean;
  @Output("select")
  public select: EventEmitter<any> = new EventEmitter;
  public isDisabled: boolean;
  public autoComp: any;
  public autoCompControl = new FormControl();
  public options: autoComp[];
  public filteredOptions: Observable<autoComp[]>;
  public isLoading: boolean;

  constructor(dialog: MatDialog) {
    this.dialog = dialog;
    this.options = [];
    // this.isDisabled = false;
    this.isLoading = false;
  }

  public ngOnInit() {
    this.filteredOptions = this.autoCompControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this.filter(name) : this.options.slice())
      );
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.autoComp = undefined;
    this.autoCompControl.setValue("");
    if (this.inPut) {
      this.inPut.nativeElement.blur();
    }
    if (this.data[this.field]) {
      this.isLoading = true;
      // this.isDisabled = true;
      this.facade.findById(this.data[this.field]._id).then((res) => {
        this.autoComp = res.name ? res.name : res.title;
        this.select.emit(res);
        this.autoCompControl.setValue(this.autoComp);
        // this.isDisabled = false;
        this.stopIsloading();
      }).catch((err) => {
        // this.isDisabled = false;
        this.stopIsloading();
        this.dialogWarning(err.message);
      });
    } else {
      // this.isDisabled = false;
    }
  }

  public ngAfterViewInit(): void {
    fromEvent(this.inPut.nativeElement, 'keyup').pipe(
      // get value
      map((event: any) => {
        return event.target.value;
      })
      // if character length greater then 2
      // , filter(res => res.length > 2)
      // Time in milliseconds between key events
      , debounceTime(1000)
      // If previous query is diffent from current   
      , distinctUntilChanged()
      // subscription for response
    ).subscribe((text: string) => {
      this.isLoading = true;
      this.keyUpAutoComp(text);
    });
    fromEvent(this.inPut.nativeElement, 'focusout').pipe(
      // get value
      map((event: any) => {
        return event.target.value;
      })
      // Time in milliseconds between key events
      , debounceTime(100)
      // If previous query is diffent from current   
      , distinctUntilChanged()
      // subscription for response
    ).subscribe(() => {
      this.focusOutAutoComp();
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

  private filter(name: string): autoComp[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  private keyUpAutoComp(value: string): void {
    let search: SearchFilter = new SearchFilter();
    let searchText = value.trim();
    // search.limit = 5;
    search.whereConditions = {};
    search.isCount = false;
    if (searchText !== "") {
      search.whereConditions["name"] = {
        $regex: searchText
      }
    }
    this.facade.search(search).then((res: any) => {
      this.options = res.map(obj => {
        var rObj: autoComp = {
          _id: obj._id,
          name: obj.name ? obj.name : obj.title
        };
        return rObj;
      });
      this.stopIsloading();
    }).catch((err: any) => {
      console.log(err);
      this.stopIsloading();
      this.dialogWarning(err.message);
    });
  }

  public isDisabledInput(): boolean {
    return this.isDisabled || this.isDisabledMain;
  }

  public clearAutoComp(): void {
    // this.isDisabled = false;
    this.data[this.field] = undefined;
    this.autoComp = undefined;
    this.autoCompControl.setValue("");
    setTimeout(() => {
      this.inPut.nativeElement.blur();
    }, 10);
  }

  public focusOutAutoComp(): void {
    if (this.autoComp !== this.autoCompControl.value) {
      this.data[this.field] = undefined;
      this.autoComp = undefined;
      this.autoCompControl.setValue("");
    }
  }

  public selectAutoComp(option: any): void {
    this.select.emit(option);
    this.data[this.field] = option._id;
    this.autoComp = option.name;
    this.autoCompControl.setValue(option.name);
    // this.isDisabled = true;
    setTimeout(() => {
      this.inPut.nativeElement.blur();
    }, 10);
  }
}
