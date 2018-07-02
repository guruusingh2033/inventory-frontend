import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';

import { fuseConfig } from './fuse-config';

import { AppComponent } from './app.component';
//  import { FuseFakeDbService } from './fuse-fake-db/fuse-fake-db.service';
import { FuseMainModule } from './main/main.module';
// import { AppStoreModule } from './store/store.module';
import { UserService, AuthGuard } from './main/content/services';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { BankService } from './main/content/services/bank.service';

const appRoutes: Routes = [
  {
    path: 'auth',
    loadChildren: './main/content/pages/pages.module#FusePagesModule'
  }, 
  {
    path: 'services',
    loadChildren: './main/content/services/services.module#FuseServicesModule'
  },
  {
    path: '**',
    redirectTo: 'auth/profile'
  }
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, 
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),

    TranslateModule.forRoot(),
    // InMemoryWebApiModule.forRoot(FuseFakeDbService, {
    //   delay: 0,
    //   passThruUnknownUrl: true
    // }),

    // Fuse Main and Shared modules
    FuseModule.forRoot(fuseConfig),
    FuseSharedModule,

    // AppStoreModule,
    FuseMainModule,
    //Telephone input country code
    BsDropdownModule.forRoot(),
    NgxIntlTelInputModule

  ],
  bootstrap: [
    AppComponent
  ],
  providers: [UserService,AuthGuard,BankService
  ],
})
export class AppModule {
}
