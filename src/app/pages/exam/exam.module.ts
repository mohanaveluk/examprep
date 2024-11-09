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



@NgModule({
  declarations: [
    ListComponent,
    DetailComponent,
    QuestionComponent,
    SummaryComponent,
  ],
  imports: [
    CommonModule,
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
    FormsModule, 
    ReactiveFormsModule,
    ExamRoutingModule
  ]
})
export class ExamModule { }
