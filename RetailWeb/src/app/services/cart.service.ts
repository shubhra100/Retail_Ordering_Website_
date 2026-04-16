import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Product } from './product.service';
import { tap } from 'rxjs/operators';

export interface CartItem {
  cartId?: number;
  userId?: number;
  productId: number;
  quantity: number;
  product?: Product;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  
  // State
  cartItems = signal<CartItem[]>([]);

  // Derived signals
  totalCount = computed(() => this.cartItems().reduce((acc, item) => acc + item.quantity, 0));
  totalAmount = computed(() => this.cartItems().reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0));

  loadCart() {
    return this.http.get<CartItem[]>(`${environment.apiUrl}/cart`).pipe(
      tap(items => this.cartItems.set(items))
    ).subscribe();
  }

  addToCart(product: Product) {
    const item = { productId: product.productId, quantity: 1 };
    return this.http.post(`${environment.apiUrl}/cart/add`, item).pipe(
      tap(() => this.loadCart())
    );
  }

  updateQuantity(productId: number, quantity: number) {
    return this.http.put(`${environment.apiUrl}/cart/update`, { productId, quantity }).pipe(
      tap(() => this.loadCart())
    );
  }

  removeFromCart(productId: number) {
    return this.http.delete(`${environment.apiUrl}/cart/${productId}`).pipe(
      tap(() => this.loadCart())
    );
  }

  clearCart() {
    return this.http.delete(`${environment.apiUrl}/cart/clear`).pipe(
      tap(() => this.loadCart())
    );
  }

  clearLocal() {
    this.cartItems.set([]);
  }
}
