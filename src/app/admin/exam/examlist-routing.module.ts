import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExamlistComponent } from './examlist/examlist.component';



const routes: Routes = [
  { path: 'list', component: ExamlistComponent },
//   { path: 'take/:id', component: DetailComponent },
//   { path: 'question/:id', component: QuestionComponent },
//   { path: 'summary/:id', component: SummaryComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamListRoutingModule { }