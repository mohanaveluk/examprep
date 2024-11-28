import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExamlistComponent } from './examlist/examlist.component';
import { ExamPageComponent } from './exam-page/exam-page.component';
import { QuestionPageComponent } from './question-page/question-page.component';
import { QuestionOptionComponent } from './question-option/question-option.component';
import { CategoryListComponent } from '../category/category-list/category-list.component';
import { ExamUploadComponent } from './exam-upload/exam-upload.component';



const routes: Routes = [
  { path: 'category', component: CategoryListComponent },
  { path: 'list', component: ExamlistComponent },
  { path: 'update', component: ExamPageComponent },
  { path: 'question/:examId', component: QuestionOptionComponent },
  { path: 'examupload', component: ExamUploadComponent }
//   { path: 'take/:id', component: DetailComponent },
//   { path: 'question/:id', component: QuestionComponent },
//   { path: 'summary/:id', component: SummaryComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamListRoutingModule { }