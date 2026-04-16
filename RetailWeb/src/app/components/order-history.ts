import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../services/order.service';
import { AuthService } from '../services/auth.service';

/**
 * Data Structures for Artisanal Order Ecosystem
 */
export interface Product {
    productId: number;
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
    category?: string;
}

export interface OrderItem {
    orderItemId: number;
    productId: number;
    quantity: number;
    price: number;
    product?: Product;
}

export interface Order {
    orderId: number;
    userId: number;
    orderDate: Date;
    totalAmount: number;
    status: string;
    orderItems: OrderItem[];
}

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-bakery-cream/20 py-20 px-6">
      <div class="max-w-5xl mx-auto">
        
        <!-- Premium Header: Personal Archives -->
        <div class="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
           <div class="animate-in fade-in slide-in-from-left-6 duration-700">
              <span class="text-primary-600 font-black uppercase tracking-[0.4em] text-[10px] mb-2 block">Personal Archives</span>
              <h1 class="text-5xl font-serif font-black text-slate-900 tracking-tight">Track Your Flourish</h1>
           </div>
           <div class="flex items-center gap-6 animate-in fade-in slide-in-from-right-6 duration-700">
              <div class="bg-white px-8 py-4 rounded-[1.5rem] shadow-sm border border-primary-50 flex flex-col items-center">
                 <span class="text-2xl font-serif font-black text-primary-600">{{ orders().length }}</span>
                 <span class="text-[9px] font-black uppercase tracking-widest text-slate-400">Past Harvests</span>
              </div>
           </div>
        </div>

        <!-- Empty State: No Records Found -->
        <div *ngIf="orders().length === 0" class="bg-white rounded-[3rem] p-24 text-center border border-primary-50 shadow-2xl shadow-primary-900/5 animate-in fade-in zoom-in-95 duration-700">
          <div class="w-32 h-32 bg-bakery-cream/30 rounded-full flex items-center justify-center mx-auto mb-10 text-primary-200 text-5xl relative">
             <i class="fas fa-history"></i>
             <div class="absolute inset-0 border-2 border-primary-100 border-dashed rounded-full animate-spin-slow"></div>
          </div>
          <h3 class="text-3xl font-serif font-black text-slate-800 mb-4 tracking-tight">No Flourishing Records</h3>
          <p class="text-slate-500 font-serif italic text-lg max-w-md mx-auto mb-12 leading-relaxed">Your story with our ovens has yet to begin. Deepen your history by selecting your first loaf.</p>
        </div>

        <!-- Order List: The Artisanal Timeline -->
        <div class="space-y-12">
          <div *ngFor="let order of orders()" class="group bg-white rounded-[3rem] overflow-hidden border border-primary-50 shadow-2xl shadow-primary-900/5 transition-all duration-500 hover:shadow-primary-900/10 hover:-translate-y-2">
            
            <!-- Order Status Header -->
            <div class="px-12 py-10 bg-bakery-cream/10 border-b border-primary-50 relative overflow-hidden">
               <div class="flex flex-wrap justify-between items-start gap-8 relative z-10">
                  <div>
                     <p class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Record Authorization</p>
                     <h4 class="text-xl font-serif font-black text-slate-900">#ARKN-{{ order.orderId }}</h4>
                     <p class="text-[11px] font-serif italic text-slate-400 mt-1">{{ order.orderDate | date:'longDate' }} at {{ order.orderDate | date:'shortTime' }}</p>
                  </div>
                  
                  <!-- Timeline Visualization Integration -->
                  <div class="flex-1 max-w-xl px-4">
                     <div class="flex items-center justify-between mb-4">
                        <div *ngFor="let step of statusSteps; let i = index" class="flex flex-col items-center gap-2 group/step">
                           <div [class]="getStatusIndex(order.status) >= i ? 'bg-primary-600 text-white shadow-lg' : 'bg-primary-50 text-secondary-200'"
                                class="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-700">
                              <i [class]="step.icon"></i>
                           </div>
                           <span class="text-[8px] font-black uppercase tracking-widest text-slate-400 opacity-60 group-hover/step:opacity-100">{{ step.label }}</span>
                        </div>
                     </div>
                     <!-- Progress Line Core -->
                     <div class="h-1 bg-primary-50 rounded-full mx-6 relative shadow-inner">
                        <div class="absolute left-0 top-0 h-full bg-primary-600 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(180,83,9,0.3)]"
                             [style.width.%]="(getStatusIndex(order.status) / (statusSteps.length - 1)) * 100">
                        </div>
                     </div>
                  </div>

                  <div class="text-right">
                     <p class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Total Settlement</p>
                     <p class="text-3xl font-serif font-black text-primary-700 tracking-tighter">{{ order.totalAmount | currency }}</p>
                  </div>
               </div>
            </div>

            <!-- Goods Hub: Order Items -->
            <div class="px-12 py-10 bg-white">
               <div class="flex flex-wrap gap-8 items-center">
                  <div *ngFor="let item of order.orderItems" class="flex items-center gap-6 group/item p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                     <div class="w-20 h-20 rounded-[1.5rem] bg-bakery-cream/30 p-1 flex-none shadow-inner border border-primary-50 overflow-hidden relative">
                        <img [src]="item.product?.imageUrl" class="w-full h-full object-cover rounded-[1rem] transition-transform group-hover/item:scale-110">
                        <div class="absolute -top-2 -right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md text-[10px] font-black text-primary-600 border border-primary-50">
                           {{ item.quantity }}
                        </div>
                     </div>
                     <div class="hidden sm:block">
                        <h5 class="font-serif font-black text-slate-900 leading-tight mb-1">{{ item.product?.name }}</h5>
                        <p class="text-[9px] font-black uppercase tracking-widest text-slate-400">{{ (item.price || 0) | currency }} each</p>
                     </div>
                  </div>
                  
                  <!-- Feedback Opportunity: Verdict Button -->
                  <div *ngIf="order.status === 'Delivered'" class="ml-auto animate-in zoom-in-75 duration-1000">
                     <button class="bg-emerald-50 text-emerald-600 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all shadow-sm hover:shadow-xl hover:-translate-y-1">
                        Provide Quality Verdict
                     </button>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .animate-spin-slow { animation: spin-slow 20s linear infinite; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `]
})
export class OrderHistoryComponent implements OnInit {
  private orderService = inject(OrderService);
  private auth = inject(AuthService);
  
  orders = signal<Order[]>([]);

  statusSteps = [
    { label: 'Kneading', icon: 'fas fa-hand-holding-water', status: 'Pending' },
    { label: 'Rising', icon: 'fas fa-cloud-upload-alt', status: 'Confirmed' },
    { label: 'Baking', icon: 'fas fa-fire', status: 'Shipped' },
    { label: 'Finished', icon: 'fas fa-certificate', status: 'Delivered' }
  ];

  ngOnInit() {
    this.refreshHistory();
  }

  /**
   * Fetches history for Customer View 
   * (Implicitly supports tracking for same data structure used by Fulfillment Tracker)
   */
  refreshHistory() {
    this.orderService.getHistory().subscribe({
      next: (res) => {
        this.orders.set(res as Order[]);
      },
      error: (err) => {
        console.error('History Retrieval Conflict:', err);
      }
    });
  }

  getStatusIndex(status: string): number {
    const idx = this.statusSteps.findIndex(s => s.status === status);
    return idx === -1 ? 0 : idx;
  }
}
