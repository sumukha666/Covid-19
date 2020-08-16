import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { StatesComponent } from './components/states/states.component';
import { AboutCovidComponent } from './components/about-covid/about-covid.component';

const routes: Routes = [
  {
    path: "homepage",
    component: HomepageComponent
  },
  {
    path: "states/:name",
    component: StatesComponent
  },
  {
    path:"aboutcovid",
    component: AboutCovidComponent
  },
  {
    path: "**",
    component: HomepageComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
