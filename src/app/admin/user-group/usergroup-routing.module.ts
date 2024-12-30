import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupListComponent } from './group-list/group-list.component';




const routes: Routes = [
  { path: 'list', component: GroupListComponent },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserGroupRoutingModule { }