import { Component } from '@angular/core';
import {ProductService} from '../../services/product.service';
import {ActivatedRoute} from '@angular/router';
import {ProductModels} from '../../models/product.models';

@Component({
  selector: 'app-product-details',
  imports: [],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent {
  product : ProductModels | null = null

  constructor(private productService : ProductService, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    let id = this.activatedRoute.snapshot.paramMap.get('id')
    if (id) this.productService.getOneProduct(id).subscribe({
      next: value => {
        this.product = value
      },
      error: err => {
        console.log("erreur lors de la recuperation")
        console.log(err)
      }
    })
  }

}
