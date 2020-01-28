import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { TravelerInfoComponent } from './traveler-info/traveler-info.component';
import { TermsOfServicesComponent } from './pages/terms-of-services/terms-of-services.component';


const routes: Routes = [
  {path: '', component: WelcomeComponent},
  {path: 'traveler-info', component: TravelerInfoComponent},
  {path: 'page/terms-of-service', component: TermsOfServicesComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
