import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../services/cart.service';
import { OrderService } from '../services/order.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-screen bg-bakery-cream/30 py-20 px-6">
      <div class="max-w-6xl mx-auto">
        
        <!-- Premium Stepper -->
        <div class="flex items-center justify-between mb-20 max-w-2xl mx-auto relative px-10">
           <div class="absolute top-1/2 left-0 w-full h-[1px] bg-primary-100 -translate-y-1/2 z-0"></div>
           <div *ngFor="let step of [1, 2, 3]" class="relative z-10 flex flex-col items-center gap-3">
              <div [class]="currentStep() >= step ? 'bg-primary-600 shadow-[0_10px_25px_-5px_rgba(180,83,9,0.4)] scale-110' : 'bg-white border-2 border-primary-50'"
                   class="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-700">
                 <i *ngIf="currentStep() > step" class="fas fa-check text-white text-lg animate-in zoom-in"></i>
                 <span *ngIf="currentStep() <= step" [class]="currentStep() === step ? 'text-white' : 'text-primary-200'" class="font-black text-xl font-serif italic">{{ step }}</span>
              </div>
              <span class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{{ step === 1 ? 'Logistics' : step === 2 ? 'Settlement' : 'Archive' }}</span>
           </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          <!-- Main Wizard Area -->
          <div class="lg:col-span-8">
            
            <!-- Step 1: The Artisan's Log (Address) -->
            <div *ngIf="currentStep() === 1" class="animate-in fade-in slide-in-from-bottom-6 duration-700">
               <div class="bg-white rounded-[3rem] p-12 shadow-2xl shadow-primary-900/5 border border-primary-50 overflow-hidden relative">
                  <div class="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                  
                  <div class="relative z-10 mb-12">
                     <h2 class="text-4xl font-serif font-black text-slate-900 mb-2">The Artisan's Log</h2>
                     <p class="text-slate-500 font-serif italic text-lg">Indicate the destination for your handcrafted harvest.</p>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                     <!-- Form Side -->
                     <div class="space-y-6">
                        <div class="grid grid-cols-2 gap-4">
                           <div class="space-y-2">
                              <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">First Name</label>
                              <input [(ngModel)]="shipping.firstName" class="w-full px-6 py-5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-primary-100 transition-all outline-none font-bold text-slate-800" placeholder="Baker">
                           </div>
                           <div class="space-y-2">
                              <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Last Name</label>
                              <input [(ngModel)]="shipping.lastName" class="w-full px-6 py-5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-primary-100 transition-all outline-none font-bold text-slate-800" placeholder="Master">
                           </div>
                        </div>

                        <div class="space-y-2">
                           <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Street Address</label>
                           <div class="relative group">
                              <input [(ngModel)]="shipping.address" class="w-full px-6 py-5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-primary-100 transition-all outline-none font-bold text-slate-800" placeholder="123 Sourdough Lane">
                              <i class="fas fa-map-marker-alt absolute right-6 top-1/2 -translate-y-1/2 text-primary-300 group-focus-within:text-primary-600"></i>
                           </div>
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                           <div class="space-y-2">
                              <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Borough / City</label>
                              <input [(ngModel)]="shipping.city" class="w-full px-6 py-5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-primary-100 transition-all outline-none font-bold text-slate-800" placeholder="Atlantis">
                           </div>
                           <div class="space-y-2">
                              <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Parcel Code</label>
                              <input [(ngModel)]="shipping.zip" class="w-full px-6 py-5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-primary-100 transition-all outline-none font-bold text-slate-800" placeholder="560001">
                           </div>
                        </div>
                     </div>

                     <!-- Address Validator Mock UI -->
                     <div class="bg-bakery-cream/30 rounded-[2rem] p-6 border border-primary-50 flex flex-col justify-center items-center text-center relative overflow-hidden group">
                        <div class="absolute inset-x-0 top-0 h-40 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400')] bg-cover opacity-20 filter grayscale group-hover:grayscale-0 transition-all duration-1000"></div>
                        <div class="relative z-10 w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl mb-6 text-primary-600 text-2xl">
                           <i class="fas fa-satellite-dish animate-pulse"></i>
                        </div>
                        <h4 class="text-sm font-black uppercase tracking-[0.2em] text-slate-800 mb-2">Address Validator</h4>
                        <p class="text-xs font-serif italic text-slate-500 mb-4 px-4">Synchronizing with the local borough coordinates for precision delivery.</p>
                        <div class="px-6 py-2 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100">
                           <i class="fas fa-check-circle mr-2"></i> Route Verified
                        </div>
                     </div>
                  </div>

                  <button (click)="nextStep()" [disabled]="!canProceedStep1()" class="mt-12 w-full bg-primary-600 text-white py-6 rounded-2xl text-[11px] font-black uppercase tracking-[0.5em] shadow-[0_20px_50px_-10px_rgba(180,83,9,0.5)] hover:bg-primary-700 transition-all disabled:opacity-30 disabled:scale-100 hover:scale-[1.02]">
                    Proceed to Settlement
                  </button>
               </div>
            </div>

            <!-- Step 2: Settlement (Payment) -->
            <div *ngIf="currentStep() === 2" class="animate-in fade-in slide-in-from-right-10 duration-700">
               <div class="bg-white rounded-[3rem] p-12 shadow-2xl shadow-primary-900/5 border border-primary-50">
                  <div class="mb-12">
                     <h2 class="text-4xl font-serif font-black text-slate-900 mb-2">Secure Settlement</h2>
                     <p class="text-slate-500 font-serif italic text-lg">Finalize the community trade for your selections.</p>
                  </div>

                  <div class="space-y-6">
                     <!-- Stripe Card -->
                     <div (click)="paymentMethod = 'stripe'" [class.border-primary-500]="paymentMethod === 'stripe'" 
                          class="p-8 border-2 border-slate-50 rounded-[2.5rem] cursor-pointer hover:border-primary-200 transition-all flex items-center justify-between group bg-slate-50/50 hover:bg-white relative overflow-hidden">
                        <div *ngIf="paymentMethod === 'stripe'" class="absolute left-0 w-2 h-full bg-primary-600"></div>
                        <div class="flex items-center gap-8">
                           <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary-600 shadow-xl border border-primary-50">
                              <i class="fab fa-stripe text-4xl"></i>
                           </div>
                           <div>
                              <p class="text-xl font-serif font-black text-slate-800">Mastercard / Visa</p>
                              <p class="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Encrypted by Stripe Secure</p>
                           </div>
                        </div>
                        <div class="w-8 h-8 rounded-full border-4 border-slate-100 flex items-center justify-center transition-all" [class.border-primary-600]="paymentMethod === 'stripe'">
                           <div *ngIf="paymentMethod === 'stripe'" class="w-3 h-3 bg-primary-600 rounded-full animate-in zoom-in"></div>
                        </div>
                     </div>

                     <!-- PayPal Card -->
                     <div (click)="paymentMethod = 'paypal'" [class.border-blue-500]="paymentMethod === 'paypal'" 
                          class="p-8 border-2 border-slate-50 rounded-[2.5rem] cursor-pointer hover:border-blue-200 transition-all flex items-center justify-between group bg-slate-50/50 hover:bg-white relative overflow-hidden">
                        <div *ngIf="paymentMethod === 'paypal'" class="absolute left-0 w-2 h-full bg-blue-600"></div>
                        <div class="flex items-center gap-8">
                           <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-xl border border-primary-50">
                              <i class="fab fa-paypal text-3xl"></i>
                           </div>
                           <div>
                              <p class="text-xl font-serif font-black text-slate-800">PayPal Express</p>
                              <p class="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">One-click social settlement</p>
                           </div>
                        </div>
                        <div class="w-8 h-8 rounded-full border-4 border-slate-100 flex items-center justify-center transition-all" [class.border-blue-600]="paymentMethod === 'paypal'">
                           <div *ngIf="paymentMethod === 'paypal'" class="w-3 h-3 bg-blue-600 rounded-full animate-in zoom-in"></div>
                        </div>
                     </div>
                  </div>

                  <div class="mt-16 flex items-center justify-between gap-6">
                     <button (click)="currentStep.set(1)" class="w-1/3 py-6 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-primary-600 transition-all">
                        <i class="fas fa-chevron-left mr-3"></i> Back
                     </button>
                     <button (click)="nextStep()" class="w-2/3 bg-primary-600 text-white py-6 rounded-2xl text-[11px] font-black uppercase tracking-[0.5em] shadow-[0_20px_50px_-10px_rgba(180,83,9,0.5)] hover:bg-primary-700 transition-all hover:scale-[1.02] active:scale-95">
                       Finalize Archive
                     </button>
                  </div>
               </div>
            </div>

            <!-- Step 3: Archive (Review) -->
            <div *ngIf="currentStep() === 3" class="animate-in zoom-in-95 duration-700">
               <div class="bg-bakery-dark rounded-[3.5rem] p-16 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] text-white relative overflow-hidden">
                  <div class="absolute -top-32 -left-32 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px]"></div>
                  
                  <h2 class="text-4xl font-serif font-black mb-12 border-b border-white/5 pb-8 italic tracking-tight text-amber-500">The Master Review</h2>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20 italic font-serif text-lg">
                     <div>
                        <h4 class="text-[10px] font-sans font-black uppercase text-primary-500/50 mb-4 tracking-[0.4em]">Destination</h4>
                        <p class="text-bakery-cream leading-relaxed">
                           {{ shipping.firstName }} {{ shipping.lastName }}<br>
                           {{ shipping.address }}<br>
                           {{ shipping.city }}, {{ shipping.zip }}
                        </p>
                     </div>
                     <div>
                        <h4 class="text-[10px] font-sans font-black uppercase text-primary-500/50 mb-4 tracking-[0.4em]">Protocol</h4>
                        <p class="text-bakery-cream leading-relaxed capitalize">{{ paymentMethod }} Encryption Gateway Active</p>
                        <div class="mt-4 flex items-center gap-3 text-emerald-400 text-[10px] font-sans font-black uppercase tracking-widest">
                           <div class="w-2 h-2 rounded-full bg-current animate-pulse"></div>
                           Treasury Synchronized
                        </div>
                     </div>
                  </div>

                  <button (click)="confirmOrder()" [disabled]="isProcessing()" 
                          class="w-full bg-white text-bakery-dark py-8 rounded-[2.5rem] text-xl font-black uppercase tracking-[0.4em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all overflow-hidden relative group/btn">
                     <span *ngIf="!isProcessing()" class="relative z-10 flex items-center justify-center gap-6">
                        Complete Order
                        <i class="fas fa-long-arrow-alt-right transition-transform group-hover/btn:translate-x-3"></i>
                     </span>
                     <div *ngIf="isProcessing()" class="flex items-center justify-center gap-4">
                        <div class="w-8 h-8 border-[6px] border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
                        Synchronizing Harvest...
                     </div>
                  </button>
               </div>
            </div>

          </div>

          <!-- The Harvest Sidebar (Stickyish Summary) -->
          <div class="lg:col-span-4 h-fit sticky top-24">
             <div class="bg-white rounded-[3rem] p-10 shadow-2xl shadow-primary-900/5 border border-primary-50">
               <h3 class="text-2xl font-serif font-black mb-8 pb-6 border-b border-primary-50 text-slate-800">Your Harvest</h3>
               
               <div class="space-y-8 mb-10 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                  <div *ngFor="let item of cart.cartItems()" class="flex gap-4 group">
                     <div class="w-16 h-16 rounded-2xl bg-bakery-cream/30 p-1 flex-none shadow-inner border border-primary-50 overflow-hidden">
                        <img [src]="item.product?.imageUrl" class="w-full h-full object-cover rounded-xl transition-transform group-hover:scale-110">
                     </div>
                     <div class="flex-1 min-w-0">
                        <h5 class="font-serif font-black text-slate-900 text-sm truncate">{{ item.product?.name }}</h5>
                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ item.quantity }} Units • {{ item.product?.category }}</p>
                        <p class="text-xs font-black text-primary-600 mt-1">{{ (item.product?.price || 0) * item.quantity | currency }}</p>
                     </div>
                  </div>
               </div>

               <div class="space-y-4 pt-8 border-t border-primary-50">
                  <div class="flex justify-between items-center text-slate-400 text-[10px] font-black uppercase tracking-widest">
                     <span>Subtotal</span>
                     <span>{{ cart.totalAmount() | currency }}</span>
                  </div>
                  <div class="flex justify-between items-center text-slate-400 text-[10px] font-black uppercase tracking-widest">
                     <span>Borough Tax</span>
                     <span class="text-emerald-500">Waived</span>
                  </div>
                  <div class="pt-6 flex justify-between items-end">
                     <div>
                        <p class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Grand Harvest</p>
                        <p class="text-4xl font-serif font-black text-primary-700 tracking-tighter">{{ cart.totalAmount() | currency }}</p>
                     </div>
                  </div>
               </div>
             </div>
          </div>

        </div>
      </div>

      <!-- Success Interaction Overlay -->
      <div *ngIf="showSuccess()" class="fixed inset-0 z-[100] flex items-center justify-center bg-bakery-dark backdrop-blur-3xl animate-in fade-in duration-700">
        <div class="text-center group p-12 bg-white/5 rounded-[4rem] border border-white/10 backdrop-blur-xl">
          <div class="relative mb-12 inline-block">
             <div class="absolute inset-0 bg-primary-500/30 blur-[100px] rounded-full scale-150 animate-pulse"></div>
             <div class="w-40 h-40 bg-white rounded-[3rem] flex items-center justify-center shadow-[0_30px_60px_-10px_rgba(255,255,255,0.3)] transform rotate-12 animate-in zoom-in-75 duration-700">
                <i class="fas fa-certificate text-primary-600 text-7xl animate-spin-slow"></i>
                <i class="fas fa-check absolute inset-0 flex items-center justify-center text-primary-600 text-4xl"></i>
             </div>
          </div>
          <h2 class="text-7xl font-serif font-black text-white mb-6 tracking-tight">CRAFTED!</h2>
          <p class="text-primary-400 font-serif italic text-2xl animate-pulse">Your artisanal selections are now in the ovens.</p>
          <div class="mt-12 flex justify-center gap-2">
             <div class="w-3 h-3 bg-white rounded-full animate-bounce"></div>
             <div class="w-3 h-3 bg-white rounded-full animate-bounce delay-100"></div>
             <div class="w-3 h-3 bg-white rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    @keyframes spin-slow {
       from { transform: rotate(0deg); }
       to { transform: rotate(360deg); }
    }
    .animate-spin-slow { animation: spin-slow 12s linear infinite; }
  `]
})
export class CheckoutComponent {
  cart = inject(CartService);
  private orderService = inject(OrderService);
  private router = inject(Router);

  currentStep = signal(1);
  isProcessing = signal(false);
  showSuccess = signal(false);
  paymentMethod = 'stripe';
  
  shipping = {
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zip: ''
  };

  canProceedStep1() {
    return this.shipping.firstName && this.shipping.lastName && this.shipping.address && this.shipping.city && this.shipping.zip;
  }

  nextStep() {
    if (this.currentStep() < 3) {
      this.currentStep.update(s => s + 1);
    }
  }

  confirmOrder() {
    this.isProcessing.set(true);
    const items = this.cart.cartItems().map(i => ({ productId: i.productId, quantity: i.quantity }));

    this.orderService.placeOrder(items).subscribe({
      next: (res) => {
        this.isProcessing.set(false);
        this.showSuccess.set(true);
        this.cart.clearLocal();
        setTimeout(() => {
          this.router.navigate(['/history']);
        }, 3500);
      },
      error: (err) => {
        alert(err.error || 'The treasury encountered a rift. Attempt the trade again.');
        this.isProcessing.set(false);
      }
    });
  }
}
