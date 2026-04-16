import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface Product {
  productId: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  imageUrl: string;
  isFeatured: boolean;
  isTrending: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  averageRating: number;
  reviewCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);

  getProducts() {
    return this.http.get<Product[]>(`${environment.apiUrl}/products`);
  }

  getProduct(id: number) {
    return this.http.get<Product>(`${environment.apiUrl}/products/${id}`);
  }

  createProduct(product: Product) {
    return this.http.post<Product>(`${environment.apiUrl}/products`, product);
  }

  updateProduct(id: number, product: Product) {
    return this.http.put(`${environment.apiUrl}/products/${id}`, product);
  }

  updateProducts(products: Product[]) {
    return this.http.put(`${environment.apiUrl}/products/bulk`, products);
  }

  deleteProduct(id: number) {
    return this.http.delete(`${environment.apiUrl}/products/${id}`);
  }
}
