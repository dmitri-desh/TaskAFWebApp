import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RolesComponent } from './roles/roles.component';
import { RoleEditComponent } from './roles/role-edit.component';
import { UsersComponent } from './users/users.component';
import { UserEditComponent } from './users/user-edit.component';

const routes: Routes = [
    { path: '', component: HomeComponent, pathMatch: 'full' },
    { path: 'roles', component: RolesComponent },
    { path: 'role/:id', component: RoleEditComponent },
    { path: 'role', component: RoleEditComponent },
    { path: 'users', component: UsersComponent },
    { path: 'user/:id', component: UserEditComponent },
    { path: 'user', component: UserEditComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }