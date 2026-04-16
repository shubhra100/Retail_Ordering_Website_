import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { OrderService } from '../services/order.service';
import { ReviewService, Review } from '../services/review.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-tracker',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-screen bg-slate-50 py-16 px-6">
      <div class="max-w-4xl mx-auto">
        <header class="flex justify-between items-end mb-12">
          <div>
            <a routerLink="/history" class="text-primary-600 text-[10px] font-black uppercase tracking-widest mb-4 inline-flex items-center gap-2 group">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 19l-7-7 7-7"/></svg>
              Back to History
            </a>
            <h1 class="text-4xl font-serif font-black text-slate-900 tracking-tight">Order Tracking #{{ orderId }}</h1>
          </div>
          <div class="text-right">
             <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Preparation Date</p>
             <p class="font-bold text-slate-800">{{ orderData()?.orderDate | date:'medium' }}</p>
          </div>
        </header>

        <!-- Visual Timeline -->
        <div class="bg-white rounded-[2rem] p-12 shadow-xl shadow-slate-200/50 mb-12 relative overflow-hidden">
            <!-- Timeline Line -->
            <div class="absolute top-1/2 left-12 right-12 h-1 bg-slate-100 -translate-y-1/2 hidden md:block">
               <div class="h-full bg-primary-600 transition-all duration-1000" [style.width]="statusPercent() + '%'"></div>
            </div>

            <div class="flex flex-col md:flex-row justify-between relative z-10 gap-10 md:gap-0">
               <div *ngFor="let step of steps" class="flex flex-row md:flex-col items-center gap-6 md:gap-4 group text-center lg:text-left">
                  <div [class]="isStepActive(step.id) ? 'bg-primary-600 shadow-lg shadow-primary-600/30 text-white' : 'bg-white border-2 border-slate-100 text-slate-300'"
                       class="w-16 h-16 rounded-[1.25rem] flex items-center justify-center transition-all duration-700 transform"
                       [class.scale-110]="orderData()?.status === step.id">
                     <i [class]="step.icon" class="text-2xl"></i>
                  </div>
                  <div>
                    <p [class]="isStepActive(step.id) ? 'text-primary-600' : 'text-slate-400'" class="text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                       {{ step.label }}
                    </p>
                    <p class="text-xs font-bold text-slate-800 hidden md:block">{{ isStepActive(step.id) ? 'Completed' : 'Upcoming' }}</p>
                  </div>
               </div>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
           <!-- Order Details -->
           <div class="lg:col-span-7 space-y-8">
              <div class="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                <h3 class="text-xl font-serif font-black text-slate-900 mb-6 uppercase tracking-widest border-b border-slate-50 pb-4">Your Selection</h3>
                <div class="space-y-4">
                  <div *ngFor="let item of orderData()?.orderItems" class="flex items-center gap-6 group">
                    <img [src]="item.product?.imageUrl" class="w-20 h-20 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform">
                    <div class="flex-1">
                       <h4 class="font-black text-slate-800">{{ item.product?.name }}</h4>
                       <p class="text-xs text-slate-400 font-bold uppercase tracking-tighter">{{ item.product?.category }}</p>
                    </div>
                    <div class="text-right">
                       <p class="font-black text-slate-900">{{ item.price | currency }}</p>
                       <p class="text-[10px] font-bold text-slate-400">QTY {{ item.quantity }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Feedback Section -->
              <div *ngIf="orderData()?.status === 'Delivered' && !isFeedbackSent()" class="bg-bakery-dark rounded-[2rem] p-10 text-white shadow-2xl">
                <h3 class="text-2xl font-serif font-black mb-2 tracking-tight text-amber-500">How was the craft?</h3>
                <p class="text-slate-400 mb-8 text-sm uppercase tracking-widest font-bold">Your palate, our inspiration</p>

                <div class="flex gap-4 mb-10">
                   <button *ngFor="let star of [1,2,3,4,5]" 
                           (click)="feedback.rating = star"
                           [class.text-amber-500]="feedback.rating >= star"
                           [class.text-white/10]="feedback.rating < star"
                           class="text-4xl transition-all transform hover:scale-125">
                      ★
                   </button>
                </div>

                <div class="space-y-4">
                   <textarea [(ngModel)]="feedback.comment" placeholder="Tell us about the freshness..." class="w-full bg-white/5 border-none rounded-2xl py-4 px-6 text-white focus:ring-2 focus:ring-amber-500 min-h-[120px] transition-all"></textarea>
                   
                   <div class="flex gap-4 items-center">
                      <button (click)="submitFeedback()" [disabled]="!feedback.rating" class="w-full bg-primary-600 text-white px-10 h-14 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-lg hover:bg-primary-500 disabled:opacity-30 transition-all">
                        Submit Review
                      </button>
                   </div>
                </div>
              </div>

              <!-- Feedback Sent State -->
              <div *ngIf="isFeedbackSent()" class="bg-emerald-600 rounded-[2rem] p-10 text-white text-center shadow-xl animate-in zoom-in-95">
                 <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor font-bold"><path d="M5 13l4 4L19 7"/></svg>
                 </div>
                 <h4 class="text-2xl font-black mb-2">Artisan Review Received</h4>
                 <p class="text-emerald-100 text-sm font-medium">Thank you for helping us master our craft.</p>
              </div>
           </div>

           <!-- Meta Info -->
           <div class="lg:col-span-5 flex flex-col gap-8">
              <div class="bg-bakery-dark rounded-[2rem] p-8 text-white">
                 <h4 class="text-[10px] font-black uppercase text-amber-500 tracking-[0.3em] mb-6">Order Total</h4>
                 <div class="space-y-4">
                    <div class="flex justify-between text-slate-500 font-bold text-xs uppercase tracking-widest">
                       <span>Subtotal</span>
                       <span>{{ orderData()?.totalAmount | currency }}</span>
                    </div>
                    <div class="flex justify-between text-slate-500 font-bold text-xs uppercase tracking-widest">
                       <span>Delivery</span>
                       <span>Free</span>
                    </div>
                    <div class="pt-4 border-t border-white/5 flex justify-between items-end">
                       <span class="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">Total</span>
                       <span class="text-4xl font-serif font-black text-amber-500">{{ orderData()?.totalAmount | currency }}</span>
                    </div>
                 </div>
              </div>

              <div class="bg-white rounded-[2rem] p-8 border border-slate-100 flex items-center gap-6">
                 <div class="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 text-2xl">
                    <i class="fas fa-headset"></i>
                 </div>
                 <div>
                    <h5 class="font-black text-slate-800">Need Assistance?</h5>
                    <p class="text-xs text-slate-500 mb-2 leading-relaxed">Our master bakers are here to help with your order.</p>
                    <button class="text-sm font-black text-primary-600 hover:text-primary-700 group flex items-center gap-1">
                      Contact Artisan Support <span class="group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class OrderTrackerComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);
  private reviewService = inject(ReviewService);

  orderId!: number;
  orderData = signal<any>(null);
  isFeedbackSent = signal(false);

  steps = [
    { id: 'Pending', label: 'Baking Queue', icon: 'fas fa-hourglass-start' },
    { id: 'Preparing', label: 'In the Oven', icon: 'fas fa-fire' },
    { id: 'Shipped', label: 'Out for Delivery', icon: 'fas fa-bicycle' },
    { id: 'Delivered', label: 'Enjoy!', icon: 'fas fa-utensils' }
  ];

  feedback = {
    rating: 0,
    comment: ''
  };

  ngOnInit() {
    this.orderId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadOrder();
  }

  loadOrder() {
    this.orderService.getHistory().subscribe(orders => {
      const order = orders.find((o: any) => o.orderId === this.orderId);
      if (order) {
        this.orderData.set(order);
        // Check if feedback already exists (mocked for now)
        this.reviewService.getReviewsByOrder(this.orderId).subscribe(reviews => {
          if (reviews.length > 0) this.isFeedbackSent.set(true);
        });
      }
    });
  }

  isStepActive(statusId: string): boolean {
    const currentStatus = this.orderData()?.status || 'Pending';
    const currentIndex = this.steps.findIndex(s => s.id === currentStatus);
    const stepIndex = this.steps.findIndex(s => s.id === statusId);
    return stepIndex <= currentIndex;
  }

  statusPercent(): number {
    const currentStatus = this.orderData()?.status || 'Pending';
    const index = this.steps.findIndex(s => s.id === currentStatus);
    return (index / (this.steps.length - 1)) * 100;
  }

  submitFeedback() {
    if (!this.feedback.rating) return;
    
    // In a real app, we'd loop through items. For now, assume a general order review.
    const review: Review = {
      orderId: this.orderId,
      productId: this.orderData()?.orderItems[0]?.productId || 0, // Mocking first item
      username: 'User', 
      rating: this.feedback.rating,
      comment: this.feedback.comment
    };

    this.reviewService.postReview(review).subscribe(() => {
      this.isFeedbackSent.set(true);
    });
  }
}
