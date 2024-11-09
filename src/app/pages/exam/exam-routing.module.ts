import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import { QuestionComponent } from './question/question.component';
import { SummaryComponent } from './summary/summary.component';


const routes: Routes = [
  { path: 'list', component: ListComponent },
  { path: 'take/:id', component: DetailComponent },
  { path: 'question/:id', component: QuestionComponent },
  { path: 'summary/:id', component: SummaryComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamRoutingModule { }