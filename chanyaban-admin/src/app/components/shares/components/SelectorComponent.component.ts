import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogWarningComponent } from '../dialog/DialogWarningComponent.component';
import { JournalistFacade, NewsCategoryFacade, SourceTypeFacade, SourceFacade } from '../../../services/services';
import { NewsAgencyFacade } from '../../../services/facade/NewsAgencyFacade.service';

@Component({
  selector: 'admin-select',
  templateUrl: './SelectorComponent.component.html'
})
export class SelectorComponent implements OnInit {

  private dialog: MatDialog;
  private facade: any;

  @Input("title")
  public title: string;
  @Input("field")
  public field: string;
  @Input("data")
  public data: any;
  @Input("isDisabled")
  public isDisabled: boolean;
  public options: any;

  constructor(dialog: MatDialog,
    private journalistFacade: JournalistFacade,
    private sourceFacade: SourceFacade,
    private sourceTypeFacade: SourceTypeFacade,
    private newsAgencyFacade: NewsAgencyFacade,
    private newsCategoryFacade: NewsCategoryFacade) {
    this.dialog = dialog;
    this.isDisabled = false;
  }

  public ngOnInit() {
    this.options = [];
    if (this.field) {
      if (this.field === "keywordType") {
        this.facade = this.journalistFacade.getJournalist();
      } else if (this.field === "newsAgency") {
        this.facade = this.newsAgencyFacade.getNewsAgency();
      } else if (this.field === "newsCategory") {
        this.facade = this.newsCategoryFacade.getNewsCategory();
      } else if (this.field === "source") {
        this.facade = this.sourceFacade.getSource();
      } else if (this.field === "sourceType") {
        this.facade = this.sourceTypeFacade.getSourceType();
      } else {
        this.facade = this.journalistFacade.getJournalist();
      }
    } else {
      this.facade = this.journalistFacade.getJournalist();
    }
    if (this.field === "status") {
      this.options = [
        {id: "unclassified", name: "unclassified"},
        {id: "trend", name: "trend"},
        {id: "permanent", name: "permanent"},
        {id: "common", name: "common"},
        {id: "banned", name: "banned"}
      ]
    } else {
      this.facade.then((res) => {
        this.options = res;
      }).catch((err) => {
        this.dialogWarning(err);
      });
    }
  }

  private dialogWarning(message: string): void {
    this.dialog.open(DialogWarningComponent, {
      data: {
        title: message,
        error: true
      }
    });
  }
}
