import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WebMainPage,HomePage, KeywordPage, NewsAgencyPage, EntityTypePage, TrendPage, SourceTypePage, NewsCategoryPage } from './components/components';

const routes: Routes = [
  {
    path: WebMainPage.PAGE_NAME,
    component: WebMainPage,
    children: [
    {
      path: "",
        component: HomePage,
      },
      {
        path: HomePage.PAGE_NAME,
        component: HomePage,
      },
          {
            path: TrendPage.PAGE_NAME,
            component: TrendPage,
          },
      {
        path: KeywordPage.PAGE_NAME + "/:keyword",
        component: KeywordPage,
      },
      {
        path: NewsAgencyPage.PAGE_NAME + "/:newsAgency",
        component: NewsAgencyPage,
      },
      {
        path: NewsAgencyPage.PAGE_NAME + "/:newsAgency/:keyword",
        component: NewsAgencyPage,
      },
      {
        path: SourceTypePage.PAGE_NAME + "/:sourceType",
        component: SourceTypePage,
      },
      {
        path: SourceTypePage.PAGE_NAME + "/:sourceType/:keyword",
        component: SourceTypePage,
      },
      {
        path: NewsCategoryPage.PAGE_NAME + "/:category",
        component: NewsCategoryPage,
      },
      {
        path: NewsCategoryPage.PAGE_NAME + "/:category/:keyword",
        component: NewsCategoryPage,
      },
      {
        path: EntityTypePage.PAGE_NAME + "/:type",
        component: EntityTypePage,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
