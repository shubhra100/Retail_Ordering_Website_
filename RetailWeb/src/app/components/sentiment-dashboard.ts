import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewService, Review } from '../services/review.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sentiment-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="flex min-h-screen bg-slate-50">
      <!-- Admin Sidebar (Reused/Themed) -->
      <aside class="w-72 bg-bakery-dark text-white p-10 flex flex-col gap-10">
         <div class="mb-10">
            <h2 class="text-2xl font-serif font-black text-amber-500">Analytics</h2>
            <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">Sentiment Archive</p>
         </div>
         <nav class="flex flex-col gap-6">
            <a routerLink="/inventory" class="text-sm font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all flex items-center gap-3">
               <i class="fas fa-boxes"></i> Master Stock
            </a>
            <a routerLink="/fulfillment" class="text-sm font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all flex items-center gap-3">
               <i class="fas fa-truck"></i> Fulfillment
            </a>
            <a routerLink="/sentiment" class="text-sm font-black uppercase tracking-widest text-white flex items-center gap-3">
               <i class="fas fa-heartbeat"></i> Bake Quality
            </a>
         </nav>
      </aside>

      <!-- Main Dashboard Content -->
      <main class="flex-1 py-16 px-10">
         <header class="flex justify-between items-end mb-16">
           <div>
             <span class="text-primary-600 font-black uppercase tracking-[0.4em] text-[10px] mb-2 block">Voice of the Community</span>
             <h1 class="text-5xl font-serif font-black text-slate-900 tracking-tight">Quality Heat Map</h1>
           </div>
           <div class="flex gap-4">
              <div class="bg-emerald-100 text-emerald-700 px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest border border-emerald-200">
                 Overall Health: 94%
              </div>
           </div>
         </header>

         <!-- Strategic Sentiment Metrics -->
         <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div class="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
               <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Sentiment Index</p>
               <div class="flex items-end gap-3 mb-6">
                  <span class="text-5xl font-serif font-black text-slate-900">4.8</span>
                  <span class="text-emerald-500 font-bold text-sm mb-1"><i class="fas fa-caret-up"></i> 0.3</span>
               </div>
               <div class="w-full h-2 bg-slate-50 rounded-full overflow-hidden">
                  <div class="h-full bg-emerald-500 rounded-full" style="width: 92%"></div>
               </div>
            </div>

            <div class="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
               <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Crust Consistency</p>
               <div class="flex items-end gap-3 mb-6">
                  <span class="text-5xl font-serif font-black text-slate-900">High</span>
                  <span class="text-slate-400 font-bold text-sm mb-1 italic">Stable</span>
               </div>
               <div class="flex gap-1">
                  <div *ngFor="let i of [1,2,3,4,5,6,7,8]" class="h-2 flex-1 bg-amber-400 rounded-full animate-pulse" [style.animationDelay]="i * 100 + 'ms'"></div>
               </div>
            </div>

            <div class="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
               <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Fulfillment Fidelity</p>
               <div class="flex items-end gap-3 mb-6">
                  <span class="text-5xl font-serif font-black text-slate-900">98%</span>
                  <span class="text-emerald-500 font-bold text-sm mb-1">On Time</span>
               </div>
               <div class="w-full h-2 bg-slate-50 rounded-full overflow-hidden">
                  <div class="h-full bg-primary-500 rounded-full" style="width: 98%"></div>
               </div>
            </div>
         </div>

         <!-- Quality Heat Map / Recent Reviews -->
         <div class="bg-white rounded-[3rem] p-12 shadow-2xl shadow-primary-900/5 border border-primary-50">
            <h3 class="text-2xl font-serif font-black text-slate-900 mb-10 pb-6 border-b border-primary-50">Artisanal Verdicts</h3>
            
            <div class="space-y-8">
               <div *ngFor="let review of reviews()" class="group flex flex-wrap lg:flex-nowrap gap-8 items-start p-8 rounded-[2rem] hover:bg-bakery-cream/10 transition-all border border-transparent hover:border-primary-50">
                  <div class="w-16 h-16 rounded-2xl bg-bakery-cream flex items-center justify-center text-primary-600 text-2xl flex-none">
                     <i [class]="getSentimentIcon(review.rating)"></i>
                  </div>
                  
                  <div class="flex-1">
                     <div class="flex justify-between items-start mb-2">
                        <div>
                           <h4 class="text-lg font-serif font-black text-slate-900">{{ review.username }}</h4>
                           <div class="flex gap-1 text-amber-500 text-[8px] mt-1">
                              <i class="fas fa-star" *ngFor="let s of getStars(review.rating)"></i>
                           </div>
                        </div>
                        <span class="text-[10px] font-black uppercase tracking-widest text-slate-300">Order #{{ review.orderId }}</span>
                     </div>
                     <p class="text-slate-600 font-serif italic text-lg leading-relaxed mb-6">"{{ review.comment }}"</p>
                     
                     <div class="flex items-center gap-6">
                        <span class="px-4 py-1.5 bg-slate-900 text-white rounded-full text-[9px] font-black uppercase tracking-widest">
                           Sentiment: {{ review.rating >= 4 ? 'Positive' : 'Critical' }}
                        </span>
                        <button class="text-[10px] font-black uppercase tracking-widest text-primary-600 hover:text-primary-700 transition-colors">
                           Acknowledge Verdict
                        </button>
                     </div>
                  </div>

                  <div class="w-full lg:w-48 bg-slate-50 rounded-2xl h-4 relative overflow-hidden flex-none self-center">
                     <div class="h-full rounded-full transition-all duration-1000" 
                          [style.width.%]="review.rating * 20"
                          [class]="review.rating >= 4 ? 'bg-emerald-500' : 'bg-red-400'">
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
export class SentimentDashboardComponent implements OnInit {
  private reviewService = inject(ReviewService);
  
  reviews = signal<Review[]>([]);

  ngOnInit() {
    this.reviewService.getAllReviews().subscribe(res => {
      this.reviews.set(res);
    });
  }

  getSentimentIcon(rating: number): string {
    if (rating >= 4) return 'fas fa-smile-beam';
    if (rating >= 3) return 'fas fa-meh';
    return 'fas fa-angry';
  }

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }
}
