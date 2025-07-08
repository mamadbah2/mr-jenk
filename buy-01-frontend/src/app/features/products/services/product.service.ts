import { Injectable } from '@angular/core';
import {catchError, Observable, of, throwError} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ProductModels} from '../models/product.models';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = "http://localhost:8080"

  constructor(private httpClient: HttpClient) { }


  getProductList():Observable<ProductModels[]> {
    const xender = this.httpClient.get<ProductModels[]>(`${this.apiUrl}/api/products`).pipe(
      catchError(err => throwError(()=>err))
    )

    return xender;
  }

  getOneProduct(id:string):Observable<ProductModels> {
    const xender = this.httpClient.get<ProductModels>(`${this.apiUrl}/api/products/${id}`).pipe(
      catchError(err => throwError(()=>err))
    )

    return xender;
  }

}
