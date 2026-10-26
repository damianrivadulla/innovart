import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { CompanyComponent } from './pages/company/company.component';
import { PortfolioComponent } from './pages/portfolio/portfolio.component';
import { MethodologyComponent } from './pages/methodology/methodology.component';
import { ContactComponent } from './pages/contact/contact.component';
import { LegalComponent } from './pages/legal/legal.component';
import { WorkWithUsComponent } from './pages/work-with-us/work-with-us.component';
import { SinglePortfolioComponent } from './pages/single-portfolio/single-portfolio.component';
import { InmersiveComponent } from './pages/inmersive/inmersive.component';

export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'company',
        component: CompanyComponent
      },
      {
        path: 'portfolio',
        component: PortfolioComponent
      },
      {
        path: 'portfolio/:id',
        component: SinglePortfolioComponent
      },
      {
        path: 'methodology',
        component: MethodologyComponent
      },
      {
        path: 'contact',
        component: ContactComponent
      },
      {
        path: 'privacy-policy',
        component: LegalComponent
      },
      {
        path: 'terms-of-use',
        component: LegalComponent
      },
      {
        path: 'terms-of-sale',
        redirectTo: 'terms-of-use',
        pathMatch: 'full'
      },
      {
        path: 'work-with-us',
        component: WorkWithUsComponent
      },
      {
        path: 'renderings',
        component: InmersiveComponent
      },
      {
        path: 'inmersive',
        redirectTo: 'renderings',
        pathMatch: 'full'
      }

    ]
  }
];
