import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { DialogDeleteComponent } from '../dialog/DialogDeleteComponent.component';
import { DialogWarningComponent } from '../dialog/DialogWarningComponent.component';
import { SearchFilter } from '../../../models/models';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

const DEFAULT_DATE_TIME_FORMAT: string = "dd-MM-yyyy HH:mm:ss";
const ITEMS_PER_PAGE: string = 'รายการต่อหน้า';

interface LinkTable {
    link: string | string[];
    isField: boolean;
}

export interface FieldTable {
    name: string;
    label: string;
    width: string;
    align: "center" | "left" | "right";
    class: string | string[];
    formatId: boolean;
    formatDate: boolean;
    formatObject: string[];
    formatArrary: false | {
        color: string,
        bgColor: string,
        fields: string[],
        dataKey: string
    };
    formatColor: boolean;
    formatImage: boolean;
    link: LinkTable[];
}

export interface ActionTable {
    isRunTest: boolean;
    isCreate: boolean;
    isEdit: boolean;
    isDelete: boolean;
    isBack: boolean;
}

@Component({
    selector: 'admin-table-component',
    templateUrl: './TableComponent.component.html'
})
export class TableComponent implements OnInit {

    private dialog: MatDialog;
    private route: ActivatedRoute;

    @Input()
    public facade: any;
    @Input()
    public title: string;
    @Input()
    public relation: string[];
    @Input()
    public fieldTable: FieldTable[];
    @Input()
    public actions: ActionTable;
    @Input()
    public fieldSearch: string[];
    @Output() runTest: EventEmitter<any> = new EventEmitter();
    @Output() stopTest: EventEmitter<any> = new EventEmitter();
    @Output() create: EventEmitter<any> = new EventEmitter();
    @Output() edit: EventEmitter<any> = new EventEmitter();
    @Output() delete: EventEmitter<any> = new EventEmitter();
    @Output() back: EventEmitter<any> = new EventEmitter();

    @ViewChild(MatPaginator, { static: true })
    public paginator: MatPaginator;

    @ViewChild(MatSort, { static: true })
    public sort: MatSort;
    public search: string;
    public defaultDateTimeFormat: string = DEFAULT_DATE_TIME_FORMAT;
    public displayedColumns: string[];
    public isLoading: boolean;
    public dataSource: MatTableDataSource<any>;
    public filter: any;
    public filters = new FormControl();
    public data: any;
    public parentId: string;
    public widthAction: string;
    public lastVisible: any;

    constructor(dialog: MatDialog, route: ActivatedRoute) {
        this.dialog = dialog;
        this.route = route;
        this.search = "";
        this.fieldSearch = [];
        this.data = [];

        this.route.queryParams.subscribe((params) => {
            this.search = params.search ? params.search : "";
        });
    }

    public ngOnInit() {
        this.displayedColumns = [];
        for (let field of this.fieldTable) {
            this.displayedColumns.push(field.name);
        }
        this.displayedColumns.push("createdDate");
        this.displayedColumns.push("modifiedDate");
        this.displayedColumns.push("action");
        this.fieldSearch.push("createdDate");
        this.fieldSearch.push("modifiedDate");
        this.filters.setValue(this.fieldSearch);
        this.filter = this.fieldSearch[0];
        this.setTableConfig(this.data);
        this.searchData();
        this.widthAction = this.getWidthAction();
        this.sort.sortChange.subscribe(() =>
            this.searchData(false, true)
        );
        this.paginator.page.subscribe(() =>
            this.nextPage()
        )
    }

    public nextPage(): void {
        if (!this.paginator.hasNextPage()) {
            this.searchData(true);
        }
    }

    public searchData(isNextPage?: boolean, isSort?: boolean): void {
        this.isLoading = true;
        let search: SearchFilter = new SearchFilter();
        let where = {};
        if (this.search.trim() !== "") {
            let search = this.search.trim();
            if (this.filter.includes("is")) {
                search = search === "true" || search === "false" ? JSON.parse(this.search.trim()) : false;
                this.search = search + "";
                where[this.filter] = search;
            } else if (this.filter.includes("date") || this.filter.includes("Date")) {
                let startTime: any = moment(search, "DD-MM-YYYY").utc();
                let endTime: any = startTime.clone().toDate();
                endTime.setHours(23);
                endTime.setMinutes(59);
                endTime.setSeconds(59);
                where[this.filter] = {
                    $gte: startTime.toDate(),
                    $lte: endTime
                    // $and: [
                    //     { $gte: startTime.toDate() },
                    //     { $lte: endTime }
                    // ]
                };
                // where[this.filter] = date;
            } else { 
                where[this.filter] = search.charAt(0) === "=" ? search.substring(1) : {
                    $regex: search
                }
            }
        }
        search.sort = {};
        search.offset = isNextPage ? this.paginator.length : 0;
        search.limit = 200;
        search.whereConditions = where;
        search.isCount = false;
        if (isNextPage || isSort) {
            search.sort[this.sort.active] = this.sort.direction === "desc" ? -1 : 1;
        } else {
            this.sort.active = "modifiedDate";
            this.sort.direction = "desc";
            search.sort = { modifiedDate: -1 };
        }
        this.facade.search(search).then((res: any) => {
            if (isNextPage) {
                for (let r of res) {
                    this.data.push(r);
                }
            } else {
                this.paginator.pageIndex = 0;
                this.data = res ? res : [];
            }
            setTimeout(() => {
            this.setTableConfig(this.data);
            }, 150);
        }).catch((err: any) => {
            this.setTableConfig([]);
            this.dialogWarning(err.message);
        });
    }

    public setTableConfig(data: any): void {
        // fix bug TypeError: data.slice is not a function
        if (!Array.isArray(data)) {
            return;
        }
        this.data = data;
        this.isLoading = false;
        this.dataSource = new MatTableDataSource<any>(this.data);
        this.paginator._intl.itemsPerPageLabel = ITEMS_PER_PAGE;
        this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => { if (length == 0 || pageSize == 0) { return `0 ของ ${length}`; } length = Math.max(length, 0); const startIndex = page * pageSize; const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize; return `${startIndex + 1} - ${endIndex} ของ ${length}`; };
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    public getWidthAction(): string {
        let ationWidth: number = 75;
        let count: number = 0;
        for (let action in this.actions) {
            if (action !== "isBack" && action !== "isCreate" && this.actions[action]) {
                count++;
            }
        }
        ationWidth += this.actions.isRunTest ? 10 : 0;
        return (ationWidth * count) + "px";
    }

    public clearSerach() {
        this.search = "";
        this.dataSource.filter = "";
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    public clickRunTest(data: any): void {
        this.runTest.emit(data);
    }

    public clickStopTest(data: any): void {
        this.stopTest.emit(data);
    }

    public clickCreateForm(): void {
        this.create.emit(null);
    }

    public clickEditForm(data: any): void {
        this.edit.emit(data);
    }

    public clickDelete(data: any): void {
        let dialogRef;
        if (data.name || data.title) {
            dialogRef = this.dialog.open(DialogDeleteComponent, {
                data: data
            });
        } else {
            dialogRef = this.dialog.open(DialogWarningComponent, {
                data: {
                    title: "คุณต้องการที่จะลบข้อมูลนี้ ?"
                }
            });
        }
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.delete.emit(data);
            }
        });
    }

    public clickBack(): void {
        this.back.emit(null);
    }
    public dialogWarning(message: string): void {
        this.dialog.open(DialogWarningComponent, {
            data: {
                title: message,
                error: true
            }
        });
    }
}
