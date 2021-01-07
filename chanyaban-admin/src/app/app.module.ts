import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module'; 
import { ColorChromeModule } from 'ngx-color/chrome';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular'; 
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AppComponent } from './app.component'; 
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
import { 
  AdminMainPage,
  LoginPage,
  ListSource,
  ListSourceType,
  ListNewsCategory,
  ListNewsAgency,
  ListJournalist,
  ListKeyword, 
  ListManageKeyword,
  ListPersona,
  ListPersonaType, 
  ListNews,
  ListConfig, 
  // shares
  MenuItem,
  TableComponent,
  ColumnTable,
  FormComponent,
  DialogAlert,
  DialogWarningComponent,
  DialogInstanceComponent,
  DialogDeleteComponent,
  SelectorComponent,
  AutoComp, 
  AutoCompSelector,
  FormMap,
  SafePipe,
  ShortNumberPipe,
  PrefixNumberPipe,
} from './components/components';
import {
  AuthenManager, ObservableManager, SourceFacade,
  SourceTypeFacade,
  ConfigFacade,
  NewsFacade,
  PersonaFacade,
  CountryFacade,
  PersonaTypeFacade,
  NewsCategoryFacade, 
  NewsAgencyFacade,
  KeywordFacade,
  KeywordManagementFacade,
  JournalistFacade
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
import { environment } from '../environments/environment';

export const BOOSTRAP_CLASSES: any[] = [AppComponent];

const COMPONENTS: any[] = [
  AppComponent, 
  AdminMainPage,
  LoginPage,
  ListSource,
  ListSourceType,
  ListNewsCategory,
  ListNewsAgency,
  ListJournalist,
  ListKeyword, 
  ListManageKeyword,
  ListPersona,
  ListPersonaType, 
  ListNews,
  ListConfig, 
  // shares
  MenuItem,
  TableComponent,
  ColumnTable,
  FormComponent,
  DialogAlert,
  DialogWarningComponent,
  DialogInstanceComponent,
  DialogDeleteComponent,
  SelectorComponent,
  AutoComp, 
  AutoCompSelector,
  FormMap,
];

const SERVICE_CLASSES: any[] = [
  AuthenManager,
  ObservableManager,
  SourceFacade,
  SourceTypeFacade,
  ConfigFacade,
  PersonaFacade,
  CountryFacade,
  PersonaTypeFacade,
  NewsFacade,
  NewsCategoryFacade,
  JournalistFacade,
  NewsAgencyFacade,
  KeywordFacade,
  KeywordManagementFacade
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
    DragDropModule,
    SatDatepickerModule, SatNativeDateModule,
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
  entryComponents: COMPONENTS,
})
export class AppModule { } 
