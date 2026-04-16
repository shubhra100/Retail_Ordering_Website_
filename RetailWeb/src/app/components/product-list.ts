import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-bakery-cream/20 pt-24 pb-12 px-6">
      <div class="max-w-7xl mx-auto">
        
        <!-- Header & Filters Section -->
        <div class="flex flex-col lg:flex-row justify-between items-end mb-12 gap-8">
           <div class="max-w-xl">
              <h2 class="text-5xl font-serif font-black text-slate-900 mb-4 tracking-tight">The Artisan Menu</h2>
              <p class="text-slate-500 font-serif italic text-lg leading-relaxed">Every bake is a labor of love, crafted with the finest local ingredients and traditional techniques.</p>
           </div>
           
           <div class="w-full lg:w-auto flex flex-col gap-5">
              <!-- Search Bar with Autocomplete Feel -->
              <div class="relative group">
                 <input type="text" [ngModel]="searchQuery()" (ngModelChange)="searchQuery.set($event)"
                        class="pl-14 pr-6 py-5 bg-white border border-primary-100 rounded-[2rem] w-full lg:w-[450px] shadow-sm hover:shadow-md focus:ring-4 focus:ring-primary-100 transition-all outline-none font-bold text-slate-700"
                        placeholder="Search our bakes (e.g. Sourdough)...">
                 <i class="fas fa-search absolute left-6 top-1/2 -translate-y-1/2 text-primary-300 transition-colors group-focus-within:text-primary-600 text-xl"></i>
              </div>
              
              <!-- Category Chips -->
              <div class="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                 <button *ngFor="let cat of categories" 
                         (click)="selectedCategory.set(cat)"
                         [class]="selectedCategory() === cat ? 'bg-primary-600 text-white border-primary-600 shadow-xl shadow-primary-200' : 'bg-white text-slate-500 border-slate-100 hover:border-primary-300'"
                         class="px-6 py-3 rounded-2xl text-[10px] font-extrabold uppercase tracking-[0.2em] border transition-all whitespace-nowrap">
                    {{ cat }}
                 </button>
              </div>
           </div>
        </div>

        <!-- Product Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <div *ngFor="let product of filteredProducts()" 
               class="group bg-white rounded-[2.5rem] border border-primary-50 p-6 transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_20px_60px_-15px_rgba(180,83,9,0.15)] flex flex-col relative overflow-hidden">
            
            <!-- Category Badge -->
            <div class="absolute top-6 right-6 z-10">
               <span class="px-4 py-1.5 bg-bakery-cream/90 backdrop-blur-md text-primary-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-primary-100 shadow-sm">
                  {{ product.category }}
               </span>
            </div>

            <!-- Image Container -->
            <div class="aspect-square bg-bakery-cream/30 rounded-[2rem] mb-6 flex items-center justify-center p-4 relative overflow-hidden">
               <img [src]="product.imageUrl || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400'" 
                    class="w-full h-full object-cover rounded-[1.5rem] transition-transform duration-1000 group-hover:scale-110">
               <!-- Gradient Overlay on Hover -->
               <div class="absolute inset-0 bg-gradient-to-t from-primary-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>

            <!-- Content Area -->
            <div class="flex-1">
               <div class="flex items-center gap-1 text-amber-400 text-[10px] mb-3">
                  <i class="fas fa-star" *ngFor="let i of [1,2,3,4,5]"></i>
                  <span class="ml-1 text-slate-400 font-bold uppercase tracking-widest">(4.9)</span>
               </div>
               <h3 class="text-2xl font-serif font-black text-slate-800 mb-2 truncate">{{ product.name }}</h3>
               <p class="text-slate-500 text-xs font-serif italic mb-6 line-clamp-2 leading-relaxed h-8">{{ product.category }} selections crafted daily.</p>
            </div>

            <!-- Bottom Action Line -->
            <div class="flex items-center justify-between pt-6 border-t border-primary-50">
               <div class="flex flex-col">
                  <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">Price</span>
                  <span class="text-2xl font-serif font-black text-primary-700">{{ product.price | currency }}</span>
               </div>
               <button (click)="addToCart(product)" 
                       [disabled]="product.stock <= 0"
                       class="px-6 py-3 bg-white border-2 border-primary-50 text-primary-600 rounded-[1.25rem] flex items-center gap-3 transition-all hover:bg-primary-50/50 hover:border-primary-100 hover:shadow-xl hover:shadow-primary-100/20 active:scale-95 disabled:bg-slate-50 disabled:text-slate-300 disabled:border-slate-100 disabled:scale-100 group/btn font-black text-[10px] uppercase tracking-widest">
                  <i *ngIf="product.stock > 0" class="fas fa-cart-plus text-lg transition-transform group-hover/btn:-translate-y-0.5"></i>
                  <i *ngIf="product.stock <= 0" class="fas fa-times-circle text-lg"></i>
                  <span class="pb-[1px]">{{ product.stock > 0 ? 'Add to Cart' : 'Out of Stock' }}</span>
               </button>
            </div>
          </div>
        </div>

        <!-- Empty & Search Error State -->
        <div *ngIf="filteredProducts().length === 0" class="py-32 text-center animate-in fade-in duration-700">
           <div class="w-32 h-32 bg-primary-50 rounded-full flex items-center justify-center text-primary-200 text-5xl mx-auto mb-8 shadow-inner">
              <i class="fas fa-bread-slice"></i>
           </div>
           <h3 class="text-3xl font-serif font-black text-slate-900 mb-2">No Bakes Found</h3>
           <p class="text-slate-500 font-serif italic text-lg">Our ovens couldn't find matches for your search. Try another category?</p>
           <button (click)="selectedCategory.set('All'); searchQuery.set('')" 
                   class="mt-8 px-8 py-3 bg-white border border-primary-200 text-primary-600 rounded-full font-black uppercase tracking-widest text-xs hover:bg-primary-50 transition-all">
              Clear All Filters
           </button>
        </div>

      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `]
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private auth = inject(AuthService);
  private router = inject(Router);

  products = signal<Product[]>([]);
  categories = ['All', 'Signature', 'Pastries', 'Breads', 'Vegan', 'Specials'];
  selectedCategory = signal('All');
  searchQuery = signal('');

  filteredProducts = computed(() => {
    const cat = this.selectedCategory();
    const query = this.searchQuery().toLowerCase();
    
    return this.products().filter(p => {
      const matchesCat = cat === 'All' || p.category === cat;
      const matchesSearch = p.name.toLowerCase().includes(query) || 
                          p.category.toLowerCase().includes(query);
      return matchesCat && matchesSearch;
    });
  });

  ngOnInit() {
    this.productService.getProducts().subscribe(res => {
      this.products.set(res);
    });
  }

  addToCart(product: Product) {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.cartService.addToCart(product).subscribe();
  }
}
