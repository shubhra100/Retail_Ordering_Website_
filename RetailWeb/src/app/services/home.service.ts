import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';

export interface HomeConfig {
  announcementText: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  ctaText: string;
}

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private http = inject(HttpClient);
  
  config = signal<HomeConfig | null>(null);

  fetchConfig() {
    return this.http.get<HomeConfig>(`${environment.apiUrl}/home/config`).pipe(
      tap(cfg => this.config.set(cfg))
    );
  }

  updateConfig(config: HomeConfig) {
    return this.http.put(`${environment.apiUrl}/home/config`, config).pipe(
      tap(() => this.config.set(config))
    );
  }

  pinProduct(productId: number, isFeatured: boolean, isTrending: boolean) {
    return this.http.post(`${environment.apiUrl}/home/pin-product/${productId}?isFeatured=${isFeatured}&isTrending=${isTrending}`, {});
  }
}
