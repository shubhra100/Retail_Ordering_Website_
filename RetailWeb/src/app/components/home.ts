import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HomeService, HomeConfig } from '../services/home.service';
import { ProductService, Product } from '../services/product.service';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <!-- Global Announcement Bar (Live Editable) -->
    <div class="h-10 bg-primary-600 text-bakery-cream flex items-center justify-center px-6 transition-all relative group/anno overflow-hidden">
       <div class="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em]">
          <i class="fas fa-certificate animate-spin-slow text-amber-300"></i>
          <span *ngIf="!isEditMode || activeEditField !== 'announcementText'">{{ config()?.announcementText }}</span>
          <input *ngIf="isEditMode && activeEditField === 'announcementText'" [(ngModel)]="editConfig.announcementText" 
                 class="bg-white/20 border-none px-4 py-1 rounded text-white outline-none w-[600px] text-center" (blur)="activeEditField = null">
       </div>
       <button *ngIf="isEditMode && activeEditField !== 'announcementText'" (click)="activeEditField = 'announcementText'"
               class="absolute right-4 text-white opacity-0 group-hover/anno:opacity-100 transition-opacity">
          <i class="fas fa-edit"></i>
       </button>
    </div>

    <!-- Artisan Hero Section -->
    <div class="relative h-[95vh] flex items-center justify-center overflow-hidden bg-bakery-dark">
      <!-- Background Image with Parallax-like effect -->
      <img [src]="config()?.heroImageUrl" class="absolute inset-0 w-full h-full object-cover transform scale-100 hover:scale-105 transition-transform duration-[6000ms] opacity-70">
      
      <!-- Gradient Overlays -->
      <div class="absolute inset-0 bg-gradient-to-b from-bakery-dark/40 via-bakery-dark/0 to-bakery-cream"></div>
      <div class="absolute inset-0 bg-gradient-to-r from-bakery-dark/95 via-bakery-dark/40 to-transparent"></div>
      
      <!-- Main Content -->
      <div class="relative z-10 max-w-7xl mx-auto px-6 w-full text-center lg:text-left">
        <div class="max-w-4xl">
          <div class="inline-flex items-center gap-4 bg-white/5 backdrop-blur-2xl px-6 py-3 rounded-[2rem] border border-white/10 mb-10 animate-in fade-in slide-in-from-top-6 duration-1000 shadow-2xl">
             <i class="fas fa-crown text-amber-400 text-lg shadow-amber-400/50"></i>
             <span class="text-[11px] font-black uppercase tracking-[0.5em] text-bakery-cream">Established 1892 • Heritage Craft</span>
          </div>

          <div class="relative group/title">
            <h1 *ngIf="!isEditMode || activeEditField !== 'heroTitle'" class="text-7xl lg:text-[9rem] font-serif font-black text-white mb-8 leading-[0.85] tracking-tight drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              {{ config()?.heroTitle }}
            </h1>
            <button *ngIf="isEditMode && activeEditField !== 'heroTitle'" (click)="activeEditField = 'heroTitle'"
                    class="absolute -top-10 left-0 text-primary-400 opacity-0 group-hover/title:opacity-100 transition-opacity">
               <i class="fas fa-pencil-alt"></i>
            </button>
            <textarea *ngIf="isEditMode && activeEditField === 'heroTitle'" [(ngModel)]="editConfig.heroTitle" 
                     (blur)="activeEditField = null"
                     class="text-7xl lg:text-[9rem] font-serif font-black text-white bg-white/10 border-none w-full mb-8 leading-[0.85] tracking-tight outline-none resize-none h-[300px]"></textarea>
          </div>

          <div class="relative group/sub">
            <p *ngIf="!isEditMode || activeEditField !== 'heroSubtitle'" class="text-2xl text-bakery-cream/90 mb-16 font-serif italic max-w-2xl leading-relaxed drop-shadow-xl">
              {{ config()?.heroSubtitle }}
            </p>
            <button *ngIf="isEditMode && activeEditField !== 'heroSubtitle'" (click)="activeEditField = 'heroSubtitle'"
                    class="absolute -top-6 left-0 text-primary-400 opacity-0 group-hover/sub:opacity-100 transition-opacity">
               <i class="fas fa-pencil-alt"></i>
            </button>
            <textarea *ngIf="isEditMode && activeEditField === 'heroSubtitle'" [(ngModel)]="editConfig.heroSubtitle" 
                     (blur)="activeEditField = null"
                     class="text-2xl text-bakery-cream bg-white/10 border-none w-full mb-16 h-32 outline-none font-serif italic"></textarea>
          </div>

          <!-- Dual Conversion CTAs -->
          <div class="flex flex-wrap gap-8 items-center justify-center lg:justify-start">
            <a routerLink="/products" class="px-14 py-6 bg-primary-600 text-white rounded-[2rem] text-xl font-black uppercase tracking-[0.2em] hover:bg-primary-700 transition-all transform hover:-translate-y-2 shadow-[0_15px_40px_-5px_rgba(180,83,9,0.5)] active:scale-95">
               Order Now
            </a>
            <div *ngIf="!auth.isAuthenticated()" class="flex items-center gap-8">
               <a routerLink="/register" class="text-lg font-black uppercase tracking-widest text-white hover:text-primary-400 transition-colors border-b-2 border-white/20 pb-2">
                  Membership Entrance
               </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Scroll Indicator -->
      <div class="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-40">
        <span class="text-[10px] font-black uppercase tracking-widest text-bakery-dark">Descend into Flour</span>
        <i class="fas fa-chevron-down text-bakery-dark"></i>
      </div>
    </div>

    <!-- Trending Row (Horizontal Mastery) -->
    <section class="py-24 bg-bakery-cream overflow-hidden">
       <div class="max-w-7xl mx-auto px-6 mb-12 flex justify-between items-end">
          <div>
             <h2 class="text-4xl font-serif font-black text-bakery-dark">Trending Now</h2>
             <p class="text-slate-400 font-serif italic">This week's most sought-after harvests.</p>
          </div>
          <div class="flex gap-4">
             <button class="w-12 h-12 rounded-full border border-primary-200 text-primary-600 hover:bg-white transition-all flex items-center justify-center shadow-sm">
                <i class="fas fa-arrow-left"></i>
             </button>
             <button class="w-12 h-12 rounded-full border border-primary-200 text-primary-600 hover:bg-white transition-all flex items-center justify-center shadow-sm">
                <i class="fas fa-arrow-right"></i>
             </button>
          </div>
       </div>
       <div class="flex gap-8 overflow-x-auto pb-8 no-scrollbar px-6 max-w-7xl mx-auto">
          <div *ngFor="let product of trendingProducts()" class="flex-none w-[350px] group relative">
             <div class="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-xl mb-6 relative">
                <img [src]="product.imageUrl" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <button (click)="addToCart(product)" class="absolute bottom-6 right-6 w-14 h-14 bg-white text-primary-600 rounded-2xl flex items-center justify-center shadow-2xl scale-0 group-hover:scale-100 transition-transform hover:bg-primary-600 hover:text-white">
                   <i class="fas fa-cart-arrow-down text-xl"></i>
                </button>
             </div>
             <h4 class="text-xl font-serif font-black text-bakery-dark">{{ product.name }}</h4>
             <p class="text-[10px] font-black uppercase tracking-widest text-primary-600">{{ product.price | currency }}</p>
          </div>
       </div>
    </section>

    <!-- Artisan Favorites Grid -->
    <section class="py-32 px-6 bg-white relative">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col md:flex-row justify-between items-end mb-20 gap-4">
          <div class="max-w-2xl">
            <span class="text-primary-600 font-black uppercase tracking-[0.4em] text-[11px] mb-6 block">Our Signature Gallery</span>
            <h2 class="text-6xl font-serif font-black text-bakery-dark tracking-tight leading-tight">Master Selection</h2>
            <p class="text-xl text-slate-400 font-serif italic mt-4">Hand-plucked recommendations from our lead baker.</p>
          </div>
          <a routerLink="/products" class="px-10 py-5 bg-bakery-cream text-primary-600 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-sm hover:bg-white border border-primary-50 transition-all flex items-center gap-4">
             Explore Menu <i class="fas fa-long-arrow-alt-right"></i>
          </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          <div *ngFor="let product of featuredProducts()" class="group relative bg-bakery-cream/30 rounded-[3rem] p-6 transition-all duration-500 hover:bg-white hover:shadow-[0_40px_100px_-20px_rgba(180,83,9,0.1)] border border-transparent hover:border-primary-50">
            <div class="aspect-square overflow-hidden relative rounded-[2.5rem] mb-8 shadow-2xl">
              <img [src]="product.imageUrl" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110">
              <!-- Admin Glass Overlay -->
              <div *ngIf="isEditMode" class="absolute inset-0 bg-white/40 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <button (click)="unpinProduct(product.productId)" class="bg-red-500 text-white px-8 py-4 rounded-full font-black uppercase text-xs tracking-widest shadow-2xl hover:bg-red-600">Unpin from Home</button>
              </div>
            </div>
            
            <div class="px-2">
              <div class="flex justify-between items-center mb-6">
                 <div>
                    <h3 class="text-3xl font-serif font-black text-bakery-dark mb-1">{{ product.name }}</h3>
                    <div class="flex items-center gap-1 text-primary-500 text-[10px] font-black uppercase tracking-widest">
                       <i class="fas fa-star" *ngFor="let i of [1,2,3,4,5]"></i>
                       <span class="ml-2 text-slate-400">Featured Pick</span>
                    </div>
                 </div>
                 <p class="text-3xl font-serif font-black text-primary-700 tracking-tight">{{ product.price | currency }}</p>
              </div>
              
              <button (click)="addToCart(product)" class="w-full py-5 bg-bakery-dark text-white rounded-2xl font-black uppercase text-xs tracking-[0.3em] hover:bg-primary-600 transition-all transform active:scale-95 shadow-xl">
                 Reserve Yours
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Admin Float Toggle (Enhanced) -->
    <div *ngIf="auth.isAdmin()" class="fixed bottom-10 right-10 z-[60]">
      <button (click)="toggleEditMode()" 
              [class]="isEditMode ? 'bg-indigo-600 rotate-0 rounded-full' : 'bg-primary-600 rotate-12 rounded-[2.5rem]'"
              class="w-20 h-20 text-white shadow-[0_25px_60px_-15px_rgba(79,70,229,0.5)] flex flex-col items-center justify-center font-black text-[11px] uppercase tracking-widest hover:scale-110 transition-all transform group">
        <i class="fas text-2xl mb-1" [class]="isEditMode ? 'fa-save' : 'fa-pencil-ruler'"></i>
        <span>{{ isEditMode ? 'Save' : 'Mode' }}</span>
        
        <!-- Tooltip -->
        <div class="absolute right-full mr-6 py-3 px-6 bg-bakery-dark rounded-2xl text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity scale-90 group-hover:scale-100 transform origin-right">
           {{ isEditMode ? 'Finish and Publish' : 'Enter Live Edit Mode' }}
        </div>
      </button>
      
      <!-- Instant Save Overlay -->
      <div *ngIf="isEditMode" class="mt-4 flex flex-col gap-4 animate-in slide-in-from-bottom-6">
         <button (click)="saveChanges()" class="w-20 h-20 bg-emerald-600 text-white rounded-full flex flex-col items-center justify-center text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-emerald-700">
            <i class="fas fa-cloud-upload-alt text-xl mb-1"></i> Put
         </button>
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
    .animate-spin-slow { animation: spin-slow 8s linear infinite; }
  `]
})
export class HomeComponent implements OnInit {
  homeService = inject(HomeService);
  productService = inject(ProductService);
  auth = inject(AuthService);
  private router = inject(Router);

  config = this.homeService.config;
  featuredProducts = signal<Product[]>([]);
  trendingProducts = signal<Product[]>([]);
  
  isEditMode = false;
  activeEditField: string | null = null;
  editConfig: HomeConfig = {
    announcementText: '',
    heroTitle: '',
    heroSubtitle: '',
    heroImageUrl: '',
    ctaText: ''
  };

  ngOnInit() {
    this.homeService.fetchConfig().subscribe();
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe(prods => {
      this.featuredProducts.set(prods.filter(p => p.isFeatured));
      this.trendingProducts.set(prods.filter(p => p.isTrending));
    });
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode && this.config()) {
      this.editConfig = { ...this.config()! };
    } else {
       this.activeEditField = null;
    }
  }

  saveChanges() {
    this.homeService.updateConfig(this.editConfig).subscribe(() => {
      this.isEditMode = false;
      this.activeEditField = null;
    });
  }

  unpinProduct(id: number) {
    this.homeService.pinProduct(id, false, false).subscribe(() => {
      this.loadProducts();
    });
  }

  addToCart(product: Product) {
    // This will trigger the slide-out cart in next steps
    alert(`${product.name} preserved in your harvest.`);
  }
}
