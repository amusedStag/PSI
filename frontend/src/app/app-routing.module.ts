import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomepageComponent} from "./homepage/homepage.component";
import {WebsiteAddComponent} from "./websiteadd/websiteadd.component";
import {WebsiteListComponent} from "./websitelist/websitelist.component";
import {WebsiteDetailComponent} from "./websitedetail/websitedetail.component";
import {WebpageDetailComponent} from "./webpage-detail/webpage-detail.component";

const routes: Routes = [
  { path: '' , redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomepageComponent },
  { path: 'addwebsite', component: WebsiteAddComponent },
  { path: 'websitelist', component: WebsiteListComponent },
  { path: 'websitelist/:id', component: WebsiteDetailComponent },
  { path: 'webpagedetail/:id', component: WebpageDetailComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
