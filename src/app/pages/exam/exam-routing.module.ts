import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import { QuestionComponent } from './question/question.component';
import { SummaryComponent } from './summary/summary.component';
import { ResultComponent } from './result/result.component';
import { ResultHistoryComponent } from './components/result-history/result-history.component';


const routes: Routes = [
  { path: 'list', component: ListComponent },
  { path: 'take/:id', component: DetailComponent },
  { path: 'question/:id', component: QuestionComponent },
  { path: 'result-summary/:examId', component: ResultHistoryComponent },
  { path: 'summary/:sessionId/:examId', component: SummaryComponent },
  { path: 'result/:sessionId/:examId', component: ResultComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamRoutingModule { }