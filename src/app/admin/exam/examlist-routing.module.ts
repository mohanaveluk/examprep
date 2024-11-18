import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExamlistComponent } from './examlist/examlist.component';
import { ExamPageComponent } from './exam-page/exam-page.component';
import { QuestionPageComponent } from './question-page/question-page.component';
import { QuestionOptionComponent } from './question-option/question-option.component';



const routes: Routes = [
  { path: 'list', component: ExamlistComponent },
  { path: 'update', component: ExamPageComponent },
  { path: 'question', component: QuestionOptionComponent }
//   { path: 'take/:id', component: DetailComponent },
//   { path: 'question/:id', component: QuestionComponent },
//   { path: 'summary/:id', component: SummaryComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamListRoutingModule { }