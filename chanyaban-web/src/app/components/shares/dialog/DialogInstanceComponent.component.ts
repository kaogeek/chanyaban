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