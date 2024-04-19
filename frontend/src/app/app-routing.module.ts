import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomepageComponent} from "./homepage/homepage.component";
import {WebsiteAddComponent} from "./websiteadd/websiteadd.component";
import {WebsiteListComponent} from "./websitelist/websitelist.component";

const routes: Routes = [
  { path: '' , redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomepageComponent },
  { path: 'addwebsite', component: WebsiteAddComponent },
  { path: 'websitelist', component: WebsiteListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
