import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface Review {
  reviewId?: number;
  orderId: number;
  productId: number;
  userId?: number;
  username: string;
  rating: number;
  comment: string;
  imageUrl?: string;
  sentiment?: string;
  adminResponse?: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private http = inject(HttpClient);

  postReview(review: Review) {
    return this.http.post(`${environment.apiUrl}/reviews`, review);
  }

  getReviewsByProduct(productId: number) {
    return this.http.get<Review[]>(`${environment.apiUrl}/reviews/product/${productId}`);
  }

  getReviewsByOrder(orderId: number) {
    return this.http.get<Review[]>(`${environment.apiUrl}/reviews/order/${orderId}`);
  }

  getAllReviews() {
    return this.http.get<Review[]>(`${environment.apiUrl}/reviews`);
  }

  respondToReview(reviewId: number, response: string) {
    return this.http.put(`${environment.apiUrl}/reviews/${reviewId}/respond`, { response });
  }
}
