import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AutoLoginGuard } from './guards/auto-login.guard';

const routes: Routes = [
  { path : '', component: LoginComponent, canActivate : [AutoLoginGuard] }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
