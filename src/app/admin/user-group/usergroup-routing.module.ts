import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupListComponent } from './group-list/group-list.component';
import { UserGroupsViewComponent } from './user-groups-view/user-groups-view.component';
import { AuthGuard } from '../../pages/auth/auth.guard';
import { AccessGroupComponent } from './access-group/access-group.component';
import { PermissionListComponent } from './permission-list/permission-list.component';




const routes: Routes = [
    { path: 'resource', component: PermissionListComponent },
    { path: 'list', component: GroupListComponent },
    { path: 'access-groups', component: AccessGroupComponent, canActivate: [AuthGuard] },
    { path: 'my-access', component: UserGroupsViewComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserGroupRoutingModule { }