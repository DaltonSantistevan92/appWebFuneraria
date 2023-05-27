import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoPageFoundComponent } from './components/no-page-found/no-page-found.component';
import { AutoLoginGuard } from './auth/guards/auto-login.guard';
import { AuthGuard } from './auth/guards/auth.guard';

const routes: Routes = [
  { path : '', redirectTo: '/login', pathMatch : 'full'},
  { path : 'login', loadChildren: () => import('./auth/auth.module').then( m => m.AuthModule), canActivate : [AutoLoginGuard] },
  { path : 'home', loadChildren: () => import('./home/home.module').then( m => m.HomeModule), canActivate : [AuthGuard] },
  { path: '404', component: NoPageFoundComponent},
  { path: '**', redirectTo: '/404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
