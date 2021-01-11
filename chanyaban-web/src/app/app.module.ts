/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SwiperModule } from 'ngx-swiper-wrapper';

import { AppRoutingModule } from './app-routing.module';
import { ColorChromeModule } from 'ngx-color/chrome';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { AppComponent } from './app.component';
import {
  WebMainPage,
  HomePage,
  KeywordPage,
  NewsAgencyPage,
  EntityTypePage,
  SourceTypePage,
  NewsCategoryPage,
  TrendPage,
  // shares  
  DialogAlert,
  DialogWarningComponent,
  DialogInstanceComponent,
  DialogDeleteComponent,
  MenuTop,
  AutoCompSearch,
  CardKeywordRelated,
  CardNewsRelated,
  CardListTrend,
  CardCounterSourceType,
  TrendChartAll,
  TrendItemChartAll,
  TrendNewsAgencyChartAndCompare,
  KeywordTopRelated,
  EntityTopRelated,
  SafePipe,
  ShortNumberPipe,
  PrefixNumberPipe,
} from './components/components';
import {
  AuthenManager, ObservableManager,
  KeywordFacade,
  NewsAgencyFacade,
  SourceTypeFacade,
  NewsCategoryFacade,
  TrendFacade,
  EntityTypeFacade
} from './services/services';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatCheckboxModule, MatButtonModule, MatInputModule, MatAutocompleteModule, MatDatepickerModule,
  MatFormFieldModule, MatRadioModule, MatSelectModule, MatSliderModule, MatGridListModule,
  MatSlideToggleModule, MatMenuModule, MatSidenavModule, MatToolbarModule, MatListModule,
  MatStepperModule, MatTabsModule, MatExpansionModule, MatButtonToggleModule,
  MatChipsModule, MatIconModule, MatProgressSpinnerModule, MatProgressBarModule, MatDialogModule,
  MatTreeModule,
  MatTooltipModule, MatSnackBarModule, MatTableModule, MatSortModule, MatPaginatorModule, MatNativeDateModule, MatCardModule, MatRippleModule, MAT_DIALOG_DATA, MatDialogRef, MatBadgeModule, DateAdapter
} from '@angular/material';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

export const BOOSTRAP_CLASSES: any[] = [AppComponent];

const COMPONENTS: any[] = [
  AppComponent,
  KeywordPage,
  NewsAgencyPage,
  EntityTypePage,
  SourceTypePage,
  NewsCategoryPage,
  TrendPage,
  WebMainPage,
  HomePage,
  // shares  
  DialogAlert,
  DialogWarningComponent,
  DialogInstanceComponent,
  DialogDeleteComponent,
  MenuTop,
  AutoCompSearch,
  CardKeywordRelated,
  CardNewsRelated,
  CardListTrend,
  CardCounterSourceType,
  TrendChartAll,
  TrendItemChartAll,
  TrendNewsAgencyChartAndCompare,
  KeywordTopRelated,
  EntityTopRelated,
];

const SERVICE_CLASSES: any[] = [
  AuthenManager,
  ObservableManager,
  KeywordFacade,
  NewsAgencyFacade,
  SourceTypeFacade,
  NewsCategoryFacade,
  TrendFacade,
  EntityTypeFacade
];

const PIPE_CLASSES: any[] = [
  //Pipe
  SafePipe,
  ShortNumberPipe,
  PrefixNumberPipe,
];

const DIRECTIVE_CLASSES: any[] = [

];

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    ColorChromeModule,
    CKEditorModule,
    SwiperModule,
    NgxDaterangepickerMd.forRoot(),
    MatCheckboxModule, MatButtonModule, MatInputModule, MatAutocompleteModule, MatDatepickerModule,
    MatFormFieldModule, MatRadioModule, MatSelectModule, MatSliderModule, MatGridListModule,
    MatSlideToggleModule, MatMenuModule, MatSidenavModule, MatToolbarModule, MatListModule,
    MatStepperModule, MatTabsModule, MatExpansionModule, MatButtonToggleModule,
    MatChipsModule, MatIconModule, MatProgressSpinnerModule, MatProgressBarModule, MatDialogModule,
    MatTreeModule,
    MatTooltipModule, MatSnackBarModule, MatTableModule, MatSortModule, MatPaginatorModule, MatNativeDateModule, MatCardModule,
    MatRippleModule, MatBadgeModule
  ],
  providers: SERVICE_CLASSES,
  bootstrap: BOOSTRAP_CLASSES,
  declarations: COMPONENTS.concat(PIPE_CLASSES).concat(DIRECTIVE_CLASSES),
  entryComponents: COMPONENTS
})
export class AppModule { } 
