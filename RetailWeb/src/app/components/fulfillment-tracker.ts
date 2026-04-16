import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../services/order.service';
import { ReviewService, Review } from '../services/review.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-fulfillment-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex min-h-screen bg-bakery-cream/20">
      <!-- Admin Sidebar (High Fidelity) -->
      <aside class="w-72 bg-bakery-dark text-white p-10 flex flex-col gap-10">
         <div class="mb-10">
            <h2 class="text-2xl font-serif font-black text-amber-500">Expeditions</h2>
            <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">Logistics Center</p>
         </div>
         <nav class="flex flex-col gap-6">
            <a routerLink="/inventory" class="text-sm font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all flex items-center gap-3">
               <i class="fas fa-boxes"></i> Master Stock
            </a>
            <a routerLink="/fulfillment" class="text-sm font-black uppercase tracking-widest text-white transition-all flex items-center gap-3">
               <i class="fas fa-truck"></i> Fulfillment
            </a>
            <a routerLink="/sentiment" class="text-sm font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all flex items-center gap-3">
               <i class="fas fa-heartbeat"></i> Bake Quality
            </a>
         </nav>
      </aside>

      <!-- Main Hub -->
      <main class="flex-1 py-16 px-10">
        <header class="flex justify-between items-end mb-16">
          <div>
            <span class="text-primary-600 font-black uppercase tracking-[0.4em] text-[10px] mb-2 block">Supply Chain Governance</span>
            <h1 class="text-5xl font-serif font-black tracking-tight mb-2 text-slate-900">Fulfillment Hub</h1>
          </div>
          <div class="flex gap-4">
             <div class="bg-white px-8 py-4 rounded-[1.5rem] shadow-xl shadow-primary-900/5 border border-primary-50 text-center min-w-[160px]">
                <p class="text-4xl font-serif font-black text-primary-600 mb-1">{{ activeOrders().length }}</p>
                <p class="text-[9px] font-black uppercase tracking-widest text-slate-400">In Preparation</p>
             </div>
          </div>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <!-- Orders Expedition Queue -->
          <div class="lg:col-span-12 space-y-10">
            <div *ngFor="let order of activeOrders()" class="group bg-white rounded-[3rem] p-10 border border-primary-50 hover:border-primary-200 transition-all duration-500 shadow-2xl shadow-primary-900/5 relative overflow-hidden">
               <!-- High Contrast Status Header -->
               <div class="absolute top-0 right-0 px-10 py-4 bg-bakery-dark rounded-bl-[2rem] text-white flex items-center gap-3">
                  <div class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                  <span class="text-[10px] font-black uppercase tracking-widest">{{ order.status }}</span>
               </div>

               <div class="flex flex-wrap justify-between items-start gap-12 mb-10">
                  <div class="flex gap-8">
                     <div class="w-24 h-24 bg-bakery-cream/30 rounded-[2rem] flex items-center justify-center text-4xl text-primary-600 shadow-inner border border-primary-50">
                        <i class="fas fa-scroll"></i>
                     </div>
                     <div>
                        <div class="flex items-center gap-4 mb-2">
                           <h4 class="text-3xl font-serif font-black text-slate-900 tracking-tight">Order ARK-{{ order.orderId }}</h4>
                        </div>
                        <p class="text-slate-500 font-serif italic text-lg">{{ order.totalAmount | currency }} • Authorized for Delivery</p>
                     </div>
                  </div>

                  <!-- Status Controller -->
                  <div class="flex gap-3 p-1.5 bg-slate-50 rounded-[1.5rem] border border-slate-100 shadow-inner">
                     <button *ngFor="let status of statuses" 
                             (click)="updateStatus(order.orderId, status)"
                             [class]="order.status === status ? 'bg-white text-primary-600 shadow-xl scale-105' : 'text-slate-400 opacity-60 hover:opacity-100'"
                             class="px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                        {{ status }}
                     </button>
                  </div>
               </div>

               <!-- Goods Visualization -->
               <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-10 border-t border-primary-50">
                  <div *ngFor="let item of order.orderItems" class="bg-bakery-cream/20 p-4 rounded-[1.5rem] border border-primary-50/50 flex items-center gap-4 group/item">
                     <div class="w-14 h-14 rounded-xl overflow-hidden shadow-sm flex-none">
                        <img [src]="item.product?.imageUrl" class="w-full h-full object-cover group-hover/item:scale-110 transition-transform">
                     </div>
                     <div class="min-w-0">
                        <p class="text-sm font-serif font-black text-slate-800 truncate">{{ item.product?.name }}</p>
                        <p class="text-[10px] font-black uppercase tracking-widest text-primary-600">{{ item.quantity }} Signature Picks</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class FulfillmentTrackerComponent implements OnInit {
  private orderService = inject(OrderService);
  private reviewService = inject(ReviewService);

  activeOrders = signal<any[]>([]);
  recentReviews = signal<Review[]>([]);
  activeReview = signal<Review | null>(null);
  adminComment = '';

  statuses = ['Pending', 'Preparing', 'Shipped', 'Delivered'];

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.orderService.getHistory().subscribe(orders => {
      this.activeOrders.set(orders);
    });
    this.reviewService.getAllReviews().subscribe(reviews => {
      this.recentReviews.set(reviews);
    });
  }

  updateStatus(orderId: number, status: string) {
    const orders = this.activeOrders().map(o => {
      const newOrder = { ...o };
      if (newOrder.orderId === orderId) newOrder.status = status;
      return newOrder;
    });
    this.activeOrders.set(orders);
  }

  openResponse(review: Review) {
    this.activeReview.set(review);
    this.adminComment = '';
  }

  submitResponse() {
    if (this.activeReview()) {
      this.reviewService.respondToReview(this.activeReview()!.reviewId!, this.adminComment).subscribe(() => {
        alert('Response Transmitted.');
        this.activeReview.set(null);
      });
    }
  }
}
