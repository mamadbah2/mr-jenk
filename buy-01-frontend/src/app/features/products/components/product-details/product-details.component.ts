import { Component } from '@angular/core';
import {ProductService} from '../../services/product.service';

@Component({
  selector: 'app-product-details',
  imports: [],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent {

  constructor(private productService : ProductService) {
  }


}
