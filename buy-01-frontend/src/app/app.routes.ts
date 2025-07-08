import { Routes } from '@angular/router';
import {SignComponent} from './auth/components/sign/sign.component';
import {ProductListingComponent} from './features/products/components/product-listing/product-listing.component';
import {authGuard} from './auth/guards/auth.guard';
import {ProductDetailsComponent} from './features/products/components/product-details/product-details.component';

export const routes: Routes = [
  {path : "auth", component: SignComponent},
  {path : "products", component: ProductListingComponent, canActivate:[authGuard]},
  {path : "products/:id", component:  ProductDetailsComponent},
  {path : "", redirectTo: "products", pathMatch: "full"}

];
