import { Routes } from '@angular/router';
import {SignComponent} from './auth/components/sign/sign.component';
import {ProductListingComponent} from './features/products/components/product-listing/product-listing.component';

export const routes: Routes = [
  {path : "auth", component: SignComponent},
  {path : "", component: ProductListingComponent},

];
