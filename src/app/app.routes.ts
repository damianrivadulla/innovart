import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { CompanyComponent } from './pages/company/company.component';
import { PortfolioComponent } from './pages/portfolio/portfolio.component';
import { MethodologyComponent } from './pages/methodology/methodology.component';
import { ContactComponent } from './pages/contact/contact.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { TermsOfSaleComponent } from './pages/terms-of-sale/terms-of-sale.component';
import { WorkWithUsComponent } from './pages/work-with-us/work-with-us.component';
import { SinglePortfolioComponent } from './pages/single-portfolio/single-portfolio.component';

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
        component: PrivacyPolicyComponent
      },
      {
        path: 'terms-of-sale',
        component: TermsOfSaleComponent
      },
      {
        path: 'work-with-us',
        component: WorkWithUsComponent
      }

    ]
  }
];
