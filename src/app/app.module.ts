import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClientModule } from '@angular/common/http';

import { AuthModule } from './pages/auth/auth.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExamModule } from './pages/exam/exam.module';
import { NavigationComponent } from './pages/navigation/navigation.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { InquiryModule } from './pages/inquiry/inquiry.module';
import { TestHistoryModule } from './pages/test-history/test-history.module';
import { PricingModule } from './pages/pricing/pricing.module';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { AboutComponent } from './pages/about/about.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FooterComponent } from './pages/footer/footer.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatListModule } from '@angular/material/list';
import { SharedModule } from './shared/shared.module';
import { AdminModule } from './admin/admin.module';
import { PagesComponent } from './pages/pages.component';
import { MatCard, MatCardModule } from '@angular/material/card';
import { AlertComponent } from './shared/components/alert/alert.component';
import { CoreModule } from './core/core.module';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { HomePageModule } from './pages/home-page/home-page.module';
//import { TruncatePipe } from './shared/utility/truncate.pipe';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    ContactUsComponent,
    AboutComponent,
    FooterComponent,
    PagesComponent,
    LandingPageComponent,
    //TruncatePipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatSidenavModule,    
    MatDialogModule,
    FlexLayoutModule,
    MatListModule,
    CoreModule,
    AuthModule,
    ExamModule,
    InquiryModule,
    TestHistoryModule,
    PricingModule,
    AdminModule,
    HomePageModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
