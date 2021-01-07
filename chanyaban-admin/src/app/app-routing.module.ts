import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListSource, ListConfig, ListKeyword, ListNewsAgency, ListNewsCategory, ListJournalist, ListNews, ListPersona, ListPersonaType, ListSourceType, AdminMainPage, LoginPage, ListManageKeyword } from './components/components';

const routes: Routes = [ 
  {
    path: LoginPage.PAGE_NAME,
    component: LoginPage
  },
  {
    path: AdminMainPage.PAGE_NAME,
    component: AdminMainPage,
    children: [
      {
        path: ListConfig.PAGE_NAME,
        component: ListConfig,
      },
      {
        path: ListSource.PAGE_NAME,
        component: ListSource,
      },
      // {
      //   path: ListSourceType.PAGE_NAME,
      //   component: ListSourceType,
      // },
      {
        path: ListManageKeyword.PAGE_NAME,
        component: ListManageKeyword,
      },
      {
        path: ListNewsCategory.PAGE_NAME,
        component: ListNewsCategory,
      },
      {
        path: ListPersona.PAGE_NAME,
        component: ListPersona,
      },
      {
        path: ListPersonaType.PAGE_NAME,
        component: ListPersonaType,
      },
      {
        path: "",
        component: ListNews,
      }, 
      {
        path: ListNews.PAGE_NAME,
        component: ListNews,
      }, 
      {
        path: ListKeyword.PAGE_NAME,
        component: ListKeyword,
      }, 
      {
        path: ListJournalist.PAGE_NAME,
        component: ListJournalist,
      },
      {
        path: ListNewsAgency.PAGE_NAME,
        component: ListNewsAgency,
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
