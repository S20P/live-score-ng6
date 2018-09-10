import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule, AppRoutingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { PLATFORM_ID, APP_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DatePipe } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { GroupByPipe } from './short-array.pipe';
import { GroupByArrayPipe } from './group-by.pipe';
import { FormsModule } from '@angular/forms';
import { OrderModule } from 'ngx-order-pipe';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { NgxPaginationModule } from 'ngx-pagination';

import { MatchesApiService } from './service/live_match/matches-api.service';
import { MatchService } from './service/match.service';
import { JsCustomeFunScriptService } from './service/jsCustomeFun/jsCustomeFunScript.service';
import { CompetitionAsideRightComponent } from './competition-aside-right/competition-aside-right.component';
import { SidebarComponent } from './sidebar/sidebar.component';


@NgModule({
  declarations: [
    AppComponent,
    AppRoutingComponents,
    GroupByPipe,
    GroupByArrayPipe,
    SidebarComponent,
    CompetitionAsideRightComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    BrowserTransferStateModule,
    HttpClientModule,
    FormsModule,
    OrderModule,
    NgxPageScrollModule,
    NgxPaginationModule
  ],
  providers: [MatchService, DatePipe, JsCustomeFunScriptService, MatchesApiService],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(APP_ID) private appId: string) {
    const platform = isPlatformBrowser(platformId) ?
      'in the browser' : 'on the server';
    console.log(`Running ${platform} with appId=${appId}`);
  }
}
