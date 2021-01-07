import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthenManager } from '../../../services/AuthenManager.service';
import { DialogWarningComponent } from '../../shares/dialog/DialogWarningComponent.component';
import {Md5} from 'ts-md5/dist/md5';

const PAGE_NAME: string = "login";

@Component({
    selector: 'admin-login-page',
    templateUrl: './LoginPage.component.html'
})
export class LoginPage implements OnInit {

    public static readonly PAGE_NAME: string = PAGE_NAME;

    private dialog: MatDialog;
    private authenManager: AuthenManager;
    private router: Router;

    public isLoading: boolean = false;
    public username: string = "";
    public password: string = "";

    constructor(authenManager: AuthenManager, router: Router, dialog: MatDialog) {
        this.dialog = dialog;
        this.router = router;
        this.authenManager = authenManager;
    }

    public ngOnInit() {
        if (this.authenManager.isUserLogin()) {
            this.router.navigateByUrl("news");
        }
    }

    public clickLogin(): void {
        if (this.username.trim() === "") {
            this.dialogWarning("กรุณาใส่ username");
            return;
        }
        if (this.password.trim() === "") {
            this.dialogWarning("กรุณาใส่ password");
            return;
        }
        this.isLoading = true;
        const md5 = new Md5();
        let encryptPassword = md5.appendStr(this.password).end().toString();
        this.authenManager.login(this.username, encryptPassword).then((res) => {
            setTimeout(() => {
                this.isLoading = false;
                if (res) {
                    this.router.navigateByUrl("news")
                } else {
                    this.dialogWarning("username หรือ password ไม่ถูกต้อง");
                }
            }, 500);
        }).catch((err) => {
            this.isLoading = false;
            this.dialogWarning(err.message);
        });
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
