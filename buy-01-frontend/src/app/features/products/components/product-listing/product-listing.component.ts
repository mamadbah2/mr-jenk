import { Component } from '@angular/core';
import {ProductService} from '../../services/product.service';
import {ProductModels} from '../../models/product.models';

@Component({
  selector: 'app-product-listing',
  imports: [],
  templateUrl: './product-listing.component.html',
  styleUrl: './product-listing.component.css'
})
export class ProductListingComponent {
  allProducts:ProductModels[] | null = null

  constructor(private productService: ProductService) {
  }

  ngOnInit() {
    this.productService.getProductList().subscribe({
      next : value => {
        console.log("La liste de tous les products")
        this.allProducts = value;
        console.log(value)
      },
      error : err => {
        console.log(err)
        console.log("Une erreur de product service")
      }
      }
    )
  }
}
