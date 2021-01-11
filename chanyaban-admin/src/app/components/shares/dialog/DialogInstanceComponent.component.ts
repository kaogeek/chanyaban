/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'dialog-instance',
    templateUrl: './DialogInstanceComponent.component.html'
})
export class DialogInstanceComponent {

    constructor(public dialogRef: MatDialogRef<DialogInstanceComponent>, 
        @Inject(MAT_DIALOG_DATA) public data: any) {
    }
}