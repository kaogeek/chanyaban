import { ViewChild, Output, EventEmitter } from '@angular/core';
import { Field, FieldTable, ActionTable, TableComponent, DialogWarningComponent } from '../shares/shares';
import { MatDrawer, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { AuthenManager } from '../../services/AuthenManager.service';

export abstract class AbstractPage {

    @Output()
    public back: EventEmitter<any> = new EventEmitter();
    @ViewChild("drawer", { static: false })
    public drawer: MatDrawer;
    @ViewChild("table", { static: false })
    public table: TableComponent;
    public titleForm: string;
    public fieldTable: FieldTable[];
    public actions: ActionTable;
    public fields: Field[];
    public dialog: MatDialog;
    public facade: any;

    constructor(titleForm: string, dialog: MatDialog, facade: any, private authenManager: AuthenManager, private router: Router) {
        this.titleForm = titleForm;
        this.dialog = dialog;
        this.facade = facade;
        if (!this.authenManager.isUserLogin()) {
            this.router.navigateByUrl("/login");
        }
    }

    public clickBack(): void {
        this.back.emit(null);
    }

    public clickCloseDrawer(): void {
        this.drawer.toggle();
    }

    public dialogWarning(message: string): void {
        if (this.table) {
            this.table.isLoading = false;
        }
        this.dialog.open(DialogWarningComponent, {
            data: {
                title: message,
                error: true
            }
        });
    }

    public clickDelete(data: any): void {
        let cloneData = JSON.parse(JSON.stringify(data));
        this.facade.delete(data._id).then((doc: any) => {
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

    public clickSave(dataForm: any): Promise<any> {
        return new Promise((resolve, reject) => {
            let data = JSON.parse(JSON.stringify(dataForm));
            if (data._id) {
                data.modifiedDate = new Date();
                this.facade.update(data._id, data).then((res) => {
                    let index = 0;
                    let dataTable = this.table.data;
                    for (let d of dataTable) {
                        if (d._id == res._id) {
                            dataTable[index] = res;
                            break;
                        }
                        index++;
                    }
                    this.table.setTableConfig(dataTable);
                    this.drawer.toggle();
                    resolve();
                }).catch((err) => {
                    if (typeof err.error === "string") {
                        this.dialogWarning(err.error);
                    } else {
                        this.dialogWarning("เกิดข้อผิดพลาด");
                    }
                    reject();
                    console.log(err);
                });
            } else {
                let date = new Date();
                data.createdDate = date;
                data.modifiedDate = date;
                this.facade.add(data).then((res: any) => {
                    this.table.data.push(res);
                    this.table.setTableConfig(this.table.data);
                    this.drawer.toggle();
                    resolve();
                }).catch((err) => {
                    if (typeof err.error === "string") {
                        this.dialogWarning(err.error);
                    } else {
                        this.dialogWarning("เกิดข้อผิดพลาด");
                    }
                    reject();
                    console.log(err);
                });
            }
        });
    }
}
