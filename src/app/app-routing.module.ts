import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AdminPanelComponent } from './component/admin-panel/admin-panel.component';
import { AgencyComponent } from './component/agency/agency.component';
import { CityComponent } from './component/city/city.component';
import { CurrencyComponent } from './component/currency/currency.component';
import { DistrictComponent } from './component/district/district.component';
import { HomeTypeComponent } from './component/home-type/home-type.component';
import { LoginComponent } from './component/login/login.component';
import { MainPageComponent } from './component/main-page/main-page.component';
import { NeighbourhoodComponent } from './component/neighbourhood/neighbourhood.component';
import { PriorityComponent } from './component/priority/priority.component';
import { ProfilePageComponent } from './component/profile-page/profile-page.component';
import { RegisterComponent } from './component/register/register.component';
import { RequestedHomesComponent } from './component/requested-homes/requested-homes.component';
import { ResetPasswordComponent } from './component/reset-password/reset-password.component';
import { RoomNumberComponent } from './component/room-number/room-number.component';
import { StatusComponent } from './component/status/status.component';
import { TypeComponent } from './component/type/type.component';
import { UserPanelComponent } from './component/user-panel/user-panel.component';
import { UserComponent } from './component/user/user.component';
import { AuthenticationGuard } from './guard/authentication.guard';
import { HasRoleGuardGuard } from './guard/has-role-guard.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'user', component: UserPanelComponent, canActivate: [AuthenticationGuard, HasRoleGuardGuard], data: { role: ['ROLE_USER', 'ROLE_HR', 'ROLE_MANAGER'] } },
  {
    path: 'admin', component: AdminPanelComponent, canActivate: [AuthenticationGuard, HasRoleGuardGuard], data: { role: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN'] }, children: [
      { path: 'main', component: MainPageComponent },
      { path: 'priority', component: PriorityComponent },
      { path: 'requested-homes', component: RequestedHomesComponent},
      { path: 'cities', component: CityComponent },
      { path: 'branches', component: AgencyComponent },
      { path: 'districts', component: DistrictComponent },
      { path: 'neighbourhoods', component: NeighbourhoodComponent },
      { path: 'currencies', component: CurrencyComponent },
      { path: 'users', component: UserComponent },
      { path: 'room-numbers', component: RoomNumberComponent },
      { path: 'home-types', component: HomeTypeComponent },
      { path: 'home-status', component: StatusComponent },
      { path: 'type', component: TypeComponent },
      { path: 'profile', component: ProfilePageComponent }
    ]
  },
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
export const routingComponents = [
  AppComponent,
  LoginComponent,
  RegisterComponent,
  ResetPasswordComponent,
  UserPanelComponent,
  AdminPanelComponent,
  CityComponent,
  DistrictComponent,
  AgencyComponent,
  NeighbourhoodComponent,
  CurrencyComponent,
  UserComponent,
  RoomNumberComponent,
  HomeTypeComponent,
  StatusComponent,
  TypeComponent,
  MainPageComponent,
  ProfilePageComponent
]
