import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TasksComponent } from './tasks/tasks.component';
import { LoginComponent } from './login/login.component';
import { CreateTaskComponent } from './tasks/create-task/create-task.component';
import { EditTaskComponent } from './tasks/edit-task/edit-task.component';
import { canActivate } from './RouteGuards/authGuard';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'Tasks', component: TasksComponent, canActivate: [canActivate] },
  { path: 'CreateTask', component: CreateTaskComponent },
  { path: 'EditTask/:id', component: EditTaskComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
