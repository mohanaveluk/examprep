import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { InquiryDashboardComponent } from './inquiry-dashboard/inquiry-dashboard.component';
import { AskQuestionComponent } from './ask-question/ask-question.component';
import { InquiryRoutingModule } from './inquiry-routing.module';
import { QuestionListComponent } from './question-list/question-list.component';
import { QuestionDetailComponent } from './question-detail/question-detail.component';
import { SharedModule } from '../../shared/shared.module';
import { AdminResponseComponent } from './components/admin-response/admin-response.component';
import { AdminInquiryDashboardComponent } from './components/admin-inquiry-dashboard/admin-inquiry-dashboard.component';
import { MatListModule } from '@angular/material/list';
import { AdminResponseDialogComponent } from './components/admin-response-dialog/admin-response-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { AdminInquiryOverviewComponent } from './components/admin-inquiry-overview/admin-inquiry-overview.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';



@NgModule({
  declarations: [
    InquiryDashboardComponent,
    AskQuestionComponent,
    //StatCardComponent,
    QuestionListComponent,
    QuestionDetailComponent,
    AdminResponseComponent,
    AdminInquiryDashboardComponent,
    AdminResponseDialogComponent,
    AdminInquiryOverviewComponent,
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatBadgeModule,
    MatChipsModule,
    MatDividerModule,
    MatExpansionModule,
    MatSnackBarModule,
    MatListModule,
    InquiryRoutingModule,
    MatDialogModule,
    SharedModule
  ],
  exports: [
    AdminResponseComponent
  ]
})
export class InquiryModule { }
