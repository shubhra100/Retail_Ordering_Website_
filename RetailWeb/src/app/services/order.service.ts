import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);

  placeOrder(items: { productId: number, quantity: number }[]) {
    return this.http.post<any>(`${environment.apiUrl}/orders`, { items });
  }

  getHistory() {
    return this.http.get<any[]>(`${environment.apiUrl}/orders/history`);
  }

  getAllOrders() {
    return this.http.get<any[]>(`${environment.apiUrl}/orders/all`);
  }

  updateOrderStatus(orderId: number, status: string) {
    return this.http.put(`${environment.apiUrl}/orders/${orderId}/status`, `"${status}"`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
