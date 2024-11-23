import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamlistComponent } from './examlist/examlist.component';
import { ExamListRoutingModule } from './examlist-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ExamPageComponent } from './exam-page/exam-page.component';
import { QuestionPageComponent, ViewQuestionDialog } from './question-page/question-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatRadioModule } from '@angular/material/radio';
import { QuestionOptionComponent } from './question-option/question-option.component';
import { QuestionViewDialogComponent } from './question-view-dialog/question-view-dialog.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { TestQuestionComponent } from './test-question/test-question.component';
import { ExamDialogComponent } from './exam-dialog/exam-dialog.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CategoryListComponent } from '../category/category-list/category-list.component';
import { CategoryDialogComponent } from '../category/category-dialog/category-dialog.component';



@NgModule({
  declarations: [
    ExamlistComponent,
    ExamPageComponent,
    QuestionPageComponent,
    ViewQuestionDialog,
    QuestionOptionComponent,
    QuestionViewDialogComponent,
    TestQuestionComponent,
    ExamDialogComponent,
    CategoryListComponent,
    CategoryDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    MatDividerModule,
    MatTooltipModule,
    MatTableModule,
    MatSnackBarModule,
    MatSortModule,
    MatPaginatorModule,
    MatDialogModule,
    DragDropModule,
    ExamListRoutingModule
  ],
  
})
export class ExamListModule { }
