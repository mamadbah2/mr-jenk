import { Routes } from '@angular/router';
import {SignComponent} from './auth/components/sign/sign.component';
import {ProductListingComponent} from './features/products/components/product-listing/product-listing.component';
import {authGuard} from './auth/guards/auth.guard';

export const routes: Routes = [
  {path : "auth", component: SignComponent},
  {path : "", component: ProductListingComponent, canActivate:[authGuard]},

];
