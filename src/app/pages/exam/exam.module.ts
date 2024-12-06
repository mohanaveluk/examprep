import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import { QuestionComponent } from './question/question.component';
import { SummaryComponent } from './summary/summary.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExamRoutingModule } from './exam-routing.module';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatListModule } from '@angular/material/list';
import { ExamReviewModule } from '../exam-review/exam-review.module';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { SharedModule } from '../../shared/shared.module';
import { TrueFalseQuestionComponent } from './components/true-false-question/true-false-question.component';
import { OrderingQuestionComponent } from './components/ordering-question/ordering-question.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { ReviewListDialogComponent } from './components/review-list-dialog/review-list-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ExamProgressChartComponent } from './components/exam-progress-chart/exam-progress-chart.component';
import { PauseExamDialogComponent } from './question/pause-exam-dialog.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SessionExpiredDialogComponent } from '../../shared/components/session-expired-dialog/session-expired-dialog.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { ResultComponent } from './result/result.component';
import { InactivityDialogComponent } from './inactivity-dialog/inactivity-dialog.component';
import { ReviewConfirmationDialogComponent } from './components/review-confirmation-dialog/review-confirmation-dialog.component';
import { ResultHistoryComponent } from './components/result-history/result-history.component';
import { ResultDetailsDialogComponent } from './components/result-details-dialog/result-details-dialog.component';
import { ConfirmRetakeComponent } from './components/confirm-retake/confirm-retake.component';



@NgModule({
  declarations: [
    ListComponent,
    DetailComponent,
    QuestionComponent,
    SummaryComponent,
    TrueFalseQuestionComponent,
    OrderingQuestionComponent,
    ReviewListDialogComponent,
    ExamProgressChartComponent,
    PauseExamDialogComponent,
    ResultComponent,
    InactivityDialogComponent,
    ReviewConfirmationDialogComponent,
    ResultHistoryComponent,
    ResultDetailsDialogComponent,
    ConfirmRetakeComponent
  ],
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    DragDropModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,  
    MatCheckboxModule,
    MatRadioModule,
    MatListModule,
    MatProgressBarModule, 
    ExamRoutingModule,
    ExamReviewModule,
    MatIconModule,
    MatDialogModule,
    MatChipsModule,
    MatExpansionModule,
    NgxChartsModule,
    SharedModule
  ]
})
export class ExamModule { }
