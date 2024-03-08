
import { LocationStrategy, HashLocationStrategy, PathLocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToastrModule } from 'ngx-toastr';
import {
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface,
} from 'ngx-perfect-scrollbar';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ClipboardModule } from 'ngx-clipboard';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { firebaseConfig } from '@environments/environment';
import { NgxDropzoneModule } from 'ngx-dropzone';

import { HeaderComponent } from './layout/header/header.component';
import { HeaderAdminComponent } from './layout/header-admin/header-admin.component';
import { PageLoaderComponent } from './layout/page-loader/page-loader.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { SidebarAdminComponent } from './layout/sidebar-admin/sidebar-admin.component';
import { RightSidebarComponent } from './layout/right-sidebar/right-sidebar.component';
import { AuthLayoutComponent } from './layout/app-layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layout/app-layout/main-layout/main-layout.component';
import { AdminLayoutComponent } from './layout/app-layout/admin-layout/admin-layout.component';
import { FooterComponent } from './layout/footer/footer.component';
import { LogoComponent } from './layout/logo/logo.component';
import { ClientModule } from './client/client.module';
import { MembershipManagerModule } from "./client/membership-manager/membership-manager.module";
import { TermsConditionsModalComponent } from './layout/terms-conditions-modal/terms-conditions-modal.component';
import { ImgProfileComponent } from './layout/img-profile/img-profile.component';


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: false,
};

export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HeaderAdminComponent,
    PageLoaderComponent,
    SidebarComponent,
    SidebarAdminComponent,
    RightSidebarComponent,
    AuthLayoutComponent,
    MainLayoutComponent,
    AdminLayoutComponent,
    FooterComponent,
    LogoComponent,
    ImgProfileComponent,
    TermsConditionsModalComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    LoadingBarRouterModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    // core & shared
    CoreModule,
    ToastrModule.forRoot(),
    SharedModule,
    NgbModule,
    ClipboardModule,
    MembershipManagerModule,
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideStorage(() => getStorage()),
    ClientModule,
    NgxDropzoneModule,
  ],
  providers: [
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
  ],
  exports: [LogoComponent, ImgProfileComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }
