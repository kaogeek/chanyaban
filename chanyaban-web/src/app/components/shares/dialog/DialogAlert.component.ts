import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from 'src/app/models/models';

@Component({
  selector: 'dialog-alert',
  templateUrl: './DialogAlert.component.html'

})

export class DialogAlert {

  private isbottom: boolean 

  constructor(public dialogRef: MatDialogRef<DialogAlert>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {

  }

  onConfirm(): void {
    this.isbottom = true
    this.dialogRef.close(this.isbottom);

    if(this.data !== undefined && this.data !== null && this.data.confirmClickedEvent !== undefined){
      this.data.confirmClickedEvent.emit(true);
    }
  }

  onClose(): void {
    this.isbottom = false
    this.dialogRef.close(this.isbottom);
    
    if(this.data !== undefined && this.data !== null && this.data.cancelClickedEvent !== undefined){
      this.data.cancelClickedEvent.emit(false);
    }
  }

  public ngOnInit(): void {
  }
}
