import { Component, inject, signal, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Overlay (Enhanced Glass) -->
    <div *ngIf="isOpen()" 
         (click)="isOpen.set(false)"
         class="fixed inset-0 bg-bakery-dark/40 backdrop-blur-md z-[60] transition-opacity animate-in fade-in duration-500">
    </div>

    <!-- Drawer (Artisan Design) -->
    <div [class.translate-x-full]="!isOpen()"
         class="fixed right-0 top-0 h-full w-full max-w-[480px] bg-white shadow-[0_0_80px_-20px_rgba(0,0,0,0.3)] z-[70] transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) flex flex-col">
      
      <!-- Header (Bakery Themed) -->
      <div class="px-10 py-10 border-b border-primary-50 flex justify-between items-center bg-bakery-cream/20">
        <div>
          <h2 class="text-3xl font-serif font-black text-slate-900">The Harvest</h2>
          <div class="flex items-center gap-2 mt-1">
             <div class="w-1.5 h-1.5 rounded-full bg-primary-600"></div>
             <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{{ cart.totalCount() }} Signature Bakes</p>
          </div>
        </div>
        <button (click)="isOpen.set(false)" class="w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-sm border border-primary-100 text-slate-400 hover:text-primary-600 hover:rotate-90 transition-all duration-300">
           <i class="fas fa-times text-xl"></i>
        </button>
      </div>

      <!-- Items Section -->
      <div class="flex-1 overflow-y-auto px-10 py-8 space-y-8 no-scrollbar">
        <!-- Header Actions -->
        <div *ngIf="cart.cartItems().length > 0" class="flex justify-between items-center mb-6 animate-in slide-in-from-top-2">
           <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Merchant Selection</p>
           <button (click)="onClearCart()" 
                   class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-700 bg-red-50/50 px-4 py-2 rounded-xl transition-all hover:bg-red-50 shadow-sm hover:shadow-md group/clear">
              <i class="fas fa-trash-can transition-transform group-hover/clear:-rotate-[15deg]"></i>
              Clear Basket
           </button>
        </div>

        <!-- Empty State -->
        <div *ngIf="cart.cartItems().length === 0" class="h-full flex flex-col items-center justify-center text-center py-20">
          <div class="w-32 h-32 bg-bakery-cream/30 rounded-full flex items-center justify-center text-primary-200 text-5xl mb-8 relative">
             <i class="fas fa-shopping-basket"></i>
             <div class="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-primary-600 animate-bounce">
                <i class="fas fa-question text-xl"></i>
             </div>
          </div>
          <h3 class="text-2xl font-serif font-black text-slate-800 mb-2">The Basket is Bare</h3>
          <p class="text-slate-400 text-sm font-serif italic max-w-[200px]">Our ovens are full, but your selection is empty.</p>
          <button (click)="isOpen.set(false)" class="mt-10 px-10 py-4 bg-primary-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/30">
             Explore the Bakery
          </button>
        </div>

        <!-- Product Cards -->
        <div *ngFor="let item of cart.cartItems()" class="group flex gap-6 items-center animate-in slide-in-from-right-10 duration-500">
          <div class="w-24 h-24 rounded-[1.5rem] bg-bakery-cream/30 border border-primary-50 overflow-hidden flex-none shadow-inner p-2">
             <img [src]="item.product?.imageUrl || 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400'" 
                  class="w-full h-full object-cover rounded-[1rem] transition-transform group-hover:scale-110">
          </div>
          
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-start mb-1">
              <h4 class="font-serif font-black text-slate-900 text-lg truncate pr-4">{{ item.product?.name }}</h4>
              <button (click)="onRemoveItem(item.productId)" 
                      class="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-100 shadow-sm hover:shadow-md">
                 <i class="fas fa-trash text-sm"></i>
              </button>
            </div>
            <p class="text-primary-600 font-serif font-black text-sm mb-4">{{ item.product?.price | currency }}</p>
            
            <div class="flex items-center justify-between">
              <div class="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-100 shadow-inner">
                <button (click)="cart.updateQuantity(item.productId, item.quantity - 1).subscribe()" 
                        class="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-primary-600 hover:bg-white rounded-lg transition-all"
                        [disabled]="item.quantity <= 1">
                   <i class="fas fa-minus text-[10px]"></i>
                </button>
                <span class="w-8 text-center text-xs font-black text-slate-900">{{ item.quantity }}</span>
                <button (click)="cart.updateQuantity(item.productId, item.quantity + 1).subscribe()" 
                        class="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-primary-600 hover:bg-white rounded-lg transition-all">
                   <i class="fas fa-plus text-[10px]"></i>
                </button>
              </div>
              <span class="text-sm font-serif font-black text-slate-400">{{ (item.product?.price || 0) * item.quantity | currency }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer (Master Summary) -->
      <div *ngIf="cart.cartItems().length > 0" class="px-10 py-10 border-t border-primary-50 bg-bakery-cream/10">
        <div class="space-y-4 mb-8">
           <div class="flex justify-between items-center text-slate-400 text-[10px] font-black uppercase tracking-widest">
              <span>Subtotal</span>
              <span>{{ cart.totalAmount() | currency }}</span>
           </div>
           <div class="flex justify-between items-center">
             <span class="text-xl font-serif font-black text-slate-900">Total Harvest</span>
             <span class="text-3xl font-serif font-black text-primary-700 tracking-tighter">{{ cart.totalAmount() | currency }}</span>
           </div>
        </div>
        
        <button (click)="checkout()" class="group w-full bg-bakery-dark text-white py-6 rounded-[2rem] text-xs font-black uppercase tracking-[0.4em] shadow-2xl hover:bg-primary-600 transition-all flex items-center justify-center gap-4 active:scale-95">
           Initialize Checkout
           <i class="fas fa-long-arrow-alt-right transition-transform group-hover:translate-x-2"></i>
        </button>
        <p class="text-center text-[10px] font-serif italic text-slate-400 mt-6 tracking-wide">Prices include artisanal tax and community levies.</p>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `]
})
export class CartDrawerComponent implements OnInit {
  cart = inject(CartService);
  private router = inject(Router);
  isOpen = signal(false);

  @HostListener('window:toggle-cart')
  onToggleCart() {
    this.isOpen.set(!this.isOpen());
    if (this.isOpen()) {
      this.cart.loadCart();
    }
  }

  ngOnInit() {
    this.cart.loadCart();
  }

  onRemoveItem(productId: number) {
    this.cart.removeFromCart(productId).subscribe({
      next: () => console.log('Item removed'),
      error: (err) => console.error('Remove failed', err)
    });
  }

  onClearCart() {
    this.cart.clearCart().subscribe({
      next: () => console.log('Cart cleared'),
      error: (err) => console.error('Clear failed', err)
    });
  }

  checkout() {
    this.isOpen.set(false);
    this.router.navigate(['/checkout']);
  }
}
