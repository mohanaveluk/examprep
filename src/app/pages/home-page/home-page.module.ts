import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './home-page.component';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { ExamCategoriesComponent } from './components/exam-categories/exam-categories.component';
import { ModelTestCardComponent } from './components/model-test-card/model-test-card.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { FeaturesSectionComponent } from './components/features-section/features-section.component';



@NgModule({
  declarations: [
    HomePageComponent,
    HeroSectionComponent,
    ExamCategoriesComponent,
    ModelTestCardComponent,
    FeaturesSectionComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    SharedModule  
  ],
  exports: [HomePageComponent]
})
export class HomePageModule { }
