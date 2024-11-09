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
import { StatCardComponent } from './components/stat-card/stat-card.component';
import { InquiryRoutingModule } from './inquiry-routing.module';
import { QuestionListComponent } from './question-list/question-list.component';
import { QuestionDetailComponent } from './question-detail/question-detail.component';



@NgModule({
  declarations: [
    InquiryDashboardComponent,
    AskQuestionComponent,
    StatCardComponent,
    QuestionListComponent,
    QuestionDetailComponent,
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
    InquiryRoutingModule
  ]
})
export class InquiryModule { }
