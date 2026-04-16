import { Routes } from '@angular/router';
import { HomeComponent } from './components/home';
import { ProductListComponent } from './components/product-list';
import { AuthPortalComponent } from './components/auth-portal';
import { CheckoutComponent } from './components/checkout';
import { OrderHistoryComponent } from './components/order-history';
import { OrderTrackerComponent } from './components/order-tracker';
import { AdminDashboardComponent } from './components/admin-dashboard';
import { InventoryCenterComponent } from './components/inventory-center';
import { FulfillmentTrackerComponent } from './components/fulfillment-tracker';
import { SentimentDashboardComponent } from './components/sentiment-dashboard';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

const authGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isAuthenticated() ? true : router.navigate(['/login']);
};

const adminGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isAdmin() ? true : router.navigate(['/']);
};

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'login', component: AuthPortalComponent },
  { path: 'register', component: AuthPortalComponent },
  { path: 'checkout', component: CheckoutComponent, canActivate: [authGuard] },
  { path: 'history', component: OrderHistoryComponent, canActivate: [authGuard] },
  { path: 'track/:id', component: OrderTrackerComponent, canActivate: [authGuard] },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [adminGuard] },
  { path: 'inventory', component: InventoryCenterComponent, canActivate: [adminGuard] },
  { path: 'fulfillment', component: FulfillmentTrackerComponent, canActivate: [adminGuard] },
  { path: 'sentiment', component: SentimentDashboardComponent, canActivate: [adminGuard] },
  { path: '**', redirectTo: '' }
];
