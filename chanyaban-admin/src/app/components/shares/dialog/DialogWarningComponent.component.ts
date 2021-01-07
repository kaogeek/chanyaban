import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'dialog-warning',
    templateUrl: './DialogWarningComponent.component.html'
})
export class DialogWarningComponent {

    constructor(public dialogRef: MatDialogRef<DialogWarningComponent>, 
        @Inject(MAT_DIALOG_DATA) public data: any) {
    }
}