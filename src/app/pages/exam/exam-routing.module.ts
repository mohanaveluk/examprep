import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import { QuestionComponent } from './question/question.component';
import { SummaryComponent } from './summary/summary.component';
import { ResultComponent } from './result/result.component';
import { ResultHistoryComponent } from './components/result-history/result-history.component';
import { OverviewComponent } from './overview/overview.component';
import { ModelQuestionComponent } from './model-question/model-question.component';
import { ModelTestListComponent } from './trial-exam/model-test-list/model-test-list.component';
import { ModelQuestionV2Component } from './model-question-v2/model-question-v2.component';
import { QuestionV2Component } from './question-v2/question-v2.component';


const routes: Routes = [
  { path: 'list', component: ListComponent },
  { path: 'take/:id', component: DetailComponent },
  { path: 'trial', component: ModelTestListComponent },
  { path: 'trial/:examId', component: ModelQuestionComponent },
  { path: 'trialv2/:examId', component: ModelQuestionV2Component },
  { path: 'overview/:id', component: OverviewComponent },
  { path: 'question/:id', component: QuestionComponent },
  { path: 'questionv2/:id', component: QuestionV2Component },
  { path: 'result-summary/:examId', component: ResultHistoryComponent },
  { path: 'summary/:sessionId/:examId', component: SummaryComponent },
  { path: 'result/:sessionId/:examId', component: ResultComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamRoutingModule { }