import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar';
import { CartDrawerComponent } from './components/cart-drawer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CartDrawerComponent],
  template: `
    <app-navbar></app-navbar>
    <main class="min-h-screen">
      <router-outlet></router-outlet>
    </main>
    <app-cart-drawer></app-cart-drawer>

    <!-- Simple Footer -->
    <footer class="bg-white border-t border-slate-100 py-12 px-6 mt-20">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <p class="text-slate-400 text-sm font-medium">© 2026 RetailShop Inc. All rights reserved.</p>
        <div class="flex gap-8 text-slate-400 text-sm font-bold">
          <a href="#" class="hover:text-primary-600 transition-colors">Privacy</a>
          <a href="#" class="hover:text-primary-600 transition-colors">Terms</a>
          <a href="#" class="hover:text-primary-600 transition-colors">Help</a>
        </div>
      </div>
    </footer>
  `,
  styleUrl: './app.css'
})
export class AppComponent {
}
