import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractPage } from '../AbstractPage';
import { MatDialog } from '@angular/material/dialog';
import { NewsFacade } from '../../../services/facade/NewsFacade.service';
import { AuthenManager } from '../../../services/services';

const PAGE_NAME: string = 'news';

@Component({
  selector: 'app-list-news',
  templateUrl: './ListNews.component.html'
})
export class ListNews extends AbstractPage implements OnInit {

  public static readonly PAGE_NAME: string = PAGE_NAME;

  private newsFacade: NewsFacade;
 
  private route: ActivatedRoute;
  public fieldSearch: string[];

  constructor(newsFacade: NewsFacade, dialog: MatDialog, route: ActivatedRoute, authenManager: AuthenManager, router: Router) {
    super(PAGE_NAME, dialog, newsFacade, authenManager, router);
    this.newsFacade = newsFacade;
    this.route = route;

    this.fieldSearch = [
      "title",
      "link",
      "date"
    ];
    this.fieldTable = [
      {
        name: "img",
        label: "รูปข่าว",
        width: "200pt",
        class: "",formatColor: false, formatObject: [], formatArrary: false, formatImage: true,
        link: [
          {
            link: "link",
            isField: true
          }
        ],
        formatDate: false,
        formatId: false,
        align: "left"
      },
      {
        name: "title",
        label: "หัวข้อข่าว",
        width: "250pt",
        class: "",formatColor: false, formatObject: [], formatArrary: false, formatImage: false,
        link: [
          {
            link: "link",
            isField: true
          }
        ],
        formatDate: false,
        formatId: false,
        align: "left"
      },
      {
        name: "content",
        label: "เนื้อข่าว",
        width: "250pt",
        class: "",formatColor: false, formatObject: [], formatArrary: false, formatImage: false,
        link: [],
        formatDate: false,
        formatId: false,
        align: "left"
      },
      {
        name: "date",
        label: "วันที่ลงข่าว",
        width: "150pt",
        class: "",formatColor: false, formatObject: [], formatArrary: false, formatImage: false,
        link: [],
        formatDate: true,
        formatId: false,
        align: "left"
      }
    ];
    this.actions = { isRunTest: false,
      isCreate: false,
      isEdit: false,
      isDelete: false,
      isBack: false
    };
  }

  public ngOnInit(): void {
  }

}
