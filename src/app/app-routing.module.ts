import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './pages/auth/auth.guard';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { AboutComponent } from './pages/about/about.component';
import { PagesComponent } from './pages/pages.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { FaqComponent } from './shared/components/faq/faq.component';
import { UnderConstructionComponent } from './shared/components/under-construction/under-construction.component';


const routes: Routes = [
  {
    path: "", component: PagesComponent, children: [
      { path: '', component: LandingPageComponent },
      { path: 'home', component: HomePageComponent },
      {
        path: 'home1',
        loadChildren: () => import('./pages/home-page/home-page.module').then((m) => m.HomePageModule),
      },
      { path: 'login', redirectTo: '/auth/login', pathMatch: 'full' },
      {
        path: 'auth',
        loadChildren: () => import('./pages/auth/auth.module').then((m) => m.AuthModule),
      },
      {
        path: 'exam',
        loadChildren: () => import('./pages/exam/exam.module').then((m) => m.ExamModule),
      },
      {
        path: 'inquiry',
        loadChildren: () => import('./pages/inquiry/inquiry.module').then(m => m.InquiryModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'test',
        loadChildren: () => import('./pages/test-history/test-history.module').then(m => m.TestHistoryModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'pricing',
        loadChildren: () => import('./pages/pricing/pricing.module').then(m => m.PricingModule)
      },
      { path: 'contact', component: ContactUsComponent },
      { path: 'about', component: AboutComponent },
      { path: 'faq', component: FaqComponent }

    ]
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  { 
    path: '**', 
    component: UnderConstructionComponent 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
