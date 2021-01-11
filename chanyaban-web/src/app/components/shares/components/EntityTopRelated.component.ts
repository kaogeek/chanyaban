/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';

@Component({
  selector: 'entity-top-related',
  templateUrl: './EntityTopRelated.component.html'
})
export class EntityTopRelated implements OnInit {

  @Input()
  public entityTopRelated: any[];
  @Input()
  public isLoadingEntity: boolean = false;
  @Output()
  public clickAddEntityInUrl: EventEmitter<any> = new EventEmitter();

  public selectEntity: any;
  public listEntity: any[] = [];
  public swiperIndex: Number = 0;
  public config: SwiperConfigInterface;

  constructor() {
  }

  public ngOnInit() {
  }

  public ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (this.entityTopRelated && this.entityTopRelated.length > 0 && !this.isLoadingEntity) {
      this.selectEntity = this.entityTopRelated[0]._id;
      this.listEntity = this.entityTopRelated[0].list;
    } else {
      this.selectEntity = undefined;
      this.listEntity = [];
    }
    this.setSwiper();
  }

  public setSwiper(): void {
    setTimeout(() => {
      this.swiperIndex = 0;
      this.config = {
        direction: 'horizontal',
        slidesPerView: 3,
        keyboard: false,
        mousewheel: false,
        scrollbar: false,
        loop: false,
        navigation: {
          nextEl: '.icon-arrow-right',
          prevEl: '.icon-arrow-left',
        }
      };
    }, 100);
  }

  public selectedEntity(): void {
    for (const entity of this.entityTopRelated) {
      if (entity._id === this.selectEntity) {
        this.listEntity = entity.list;
        this.swiperIndex = this.listEntity.length > 0 ? 0 : undefined;
        this.setSwiper();
        return;
      }
    }
  }
}
