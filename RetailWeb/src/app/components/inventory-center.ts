import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../services/product.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inventory-center',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex min-h-screen bg-slate-50">
      <!-- Admin Sidebar -->
      <aside class="w-72 bg-bakery-dark text-white p-10 flex flex-col gap-10">
         <div class="mb-10">
            <h2 class="text-2xl font-serif font-black text-amber-500">Inventory</h2>
            <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">Control Center</p>
         </div>
         <nav class="flex flex-col gap-6">
            <a routerLink="/inventory" class="text-sm font-black uppercase tracking-widest text-white flex items-center gap-3">
               <i class="fas fa-boxes"></i> Master Stock
            </a>
            <a routerLink="/fulfillment" class="text-sm font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all flex items-center gap-3">
               <i class="fas fa-truck"></i> Fulfillment
            </a>
         </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 py-16 px-10">
        <header class="flex justify-between items-end mb-16">
          <div>
            <h1 class="text-5xl font-serif font-black text-slate-900 tracking-tight mb-2">Artisan Supply</h1>
            <p class="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">Merchant Stock & Price Management</p>
          </div>
          <div class="flex gap-4">
            <button (click)="applyBulkPriceUpdate()" class="bg-primary-600 text-white px-8 h-14 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-primary-600/30 hover:bg-primary-700 transition-all">
               Apply Adjustments
            </button>
          </div>
        </header>

        <!-- Low Stock Alert Dashboard -->
        <section class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div *ngFor="let item of lowStockItems()" class="bg-red-50 border border-red-100 rounded-[2rem] p-8 flex items-center gap-6 animate-in slide-in-from-top-4">
             <div class="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center text-white text-2xl">
                <i class="fas fa-exclamation-triangle"></i>
             </div>
             <div>
                <p class="text-[10px] font-black uppercase text-red-400 tracking-widest mb-1">Low Inventory</p>
                <h4 class="text-xl font-serif font-black text-slate-900 leading-tight">{{ item.name }}</h4>
                <p class="text-red-600 font-bold text-sm">{{ item.stock }} units remaining</p>
             </div>
          </div>
        </section>

        <!-- Product Management Table -->
        <div class="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
           <table class="w-full text-left border-collapse">
             <thead>
               <tr class="bg-slate-50/50">
                 <th class="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Produce</th>
                 <th class="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Stock Level</th>
                 <th class="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
               </tr>
             </thead>
             <tbody class="divide-y divide-slate-100">
               <tr *ngFor="let product of products()" class="group hover:bg-slate-50/30 transition-all">
                 <td class="px-10 py-6">
                   <div class="flex items-center gap-6">
                     <img [src]="product.imageUrl" class="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100 group-hover:ring-primary-400 transition-all">
                     <div>
                       <p class="font-black text-slate-800">{{ product.name }}</p>
                       <p class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{{ product.category }}</p>
                     </div>
                   </div>
                 </td>
                 <td class="px-6 py-6">
                    <div class="flex items-center gap-3">
                       <input type="number" [(ngModel)]="product.stock" 
                              class="w-20 px-3 py-2 bg-slate-50 border-none rounded-xl text-sm font-black text-slate-700 focus:ring-2 focus:ring-primary-500 outline-none">
                       <span [class]="product.stock < 10 ? 'text-red-500' : 'text-emerald-500'" class="text-[10px] font-black uppercase">
                         {{ product.stock < 10 ? 'Scant' : 'Abundant' }}
                       </span>
                    </div>
                 </td>
                 <td class="px-6 py-6 text-right">
                    <button class="w-10 h-10 bg-slate-100 text-slate-400 rounded-xl hover:bg-slate-200 hover:text-slate-600 transition-all">
                       <i class="fas fa-ellipsis-h"></i>
                    </button>
                 </td>
               </tr>
             </tbody>
           </table>
        </div>
      </main>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class InventoryCenterComponent implements OnInit {
  private productService = inject(ProductService);
  
  products = signal<Product[]>([]);
  lowStockItems = signal<Product[]>([]);

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe(prods => {
      this.products.set(prods);
      this.lowStockItems.set(prods.filter(p => p.stock < 10));
    });
  }

  toggleAvailability(product: Product) {
    product.stock = product.stock > 0 ? 0 : 50; // Mock toggle logic
    // In a real app, call PutProduct
  }

  applyBulkPriceUpdate() {
   this.productService.updateProducts(this.products()).subscribe({
    next: () => {
      alert('Inventory adjustments successfully persistent to the archives.');
      this.loadProducts(); // Reload to refresh signals
    },
    error: (err) => {
      console.error('Failed to save adjustments:', err);
      alert('Spectral shift detected: The adjustments could not be persisted. Check the logs.');
    }
   });
  }
}
