import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="glass sticky top-0 z-50 px-6 py-4 flex justify-between items-center bg-bakery-cream/70 backdrop-blur-md border-b border-primary-100 shadow-sm">
      <div class="flex items-center gap-10">
        <a routerLink="/" class="text-3xl font-serif font-black text-primary-600 tracking-tight flex items-center gap-2">
          Gourmet
        </a>
        <div class="hidden md:flex gap-8 items-center">
          <a routerLink="/products" routerLinkActive="text-primary-600" class="text-slate-500 font-bold uppercase tracking-widest text-xs hover:text-primary-600 transition-colors">The Menu</a>
          <a *ngIf="auth.isAuthenticated()" routerLink="/history" routerLinkActive="text-primary-600" class="text-slate-500 font-bold uppercase tracking-widest text-xs hover:text-primary-600 transition-colors">My Orders</a>
          
          <ng-container *ngIf="auth.isAdmin()">
            <div class="w-px h-4 bg-primary-100 ml-4"></div>
            <a routerLink="/inventory" routerLinkActive="text-indigo-600" class="text-indigo-500 font-black uppercase tracking-widest text-[10px] hover:text-indigo-700 transition-all flex items-center gap-2">
               Admin Hub
            </a>
          </ng-container>
        </div>
      </div>

      <div class="flex items-center gap-6">
        <button (click)="toggleCart()" class="relative p-2 text-slate-400 hover:text-primary-600 rounded-xl transition-all group">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span *ngIf="cart.totalCount() > 0" class="absolute -top-1 -right-1 bg-primary-600 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-lg shadow-lg">
            {{ cart.totalCount() }}
          </span>
        </button>

        <div *ngIf="!auth.isAuthenticated()" class="flex gap-4">
          <a routerLink="/login" class="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary-600 transition-colors py-2 px-2">Sign In</a>
          <a routerLink="/register" class="bg-primary-600 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-700 transition-all shadow-md shadow-primary-500/20">Join</a>
        </div>

        <div *ngIf="auth.isAuthenticated()" class="flex items-center gap-4 pl-6 border-l border-primary-50">
          <div class="flex flex-col items-end">
            <span class="text-[9px] font-black text-primary-500 uppercase tracking-tighter">{{ auth.currentUser()?.role }}</span>
            <span class="text-sm font-black text-slate-800 tracking-tight">{{ auth.currentUser()?.username }}</span>
          </div>
          <button (click)="auth.logout()" class="p-2 text-slate-300 hover:text-red-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          </button>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class NavbarComponent {
  auth = inject(AuthService);
  cart = inject(CartService);

  toggleCart() {
    // This will be implemented to open the drawer
    const event = new CustomEvent('toggle-cart');
    window.dispatchEvent(event);
  }
}
