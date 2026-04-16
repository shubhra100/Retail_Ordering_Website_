import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../services/order.service';
import { ProductService, Product } from '../services/product.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-6 py-12">
      <h1 class="text-3xl font-black text-slate-800 mb-10">Admin Dashboard</h1>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <!-- Sidebar Navigation -->
        <div class="lg:col-span-1 space-y-2">
          <button 
            (click)="activeTab.set('inventory')"
            [class]="activeTab() === 'inventory' ? 'bg-primary-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'"
            class="w-full flex items-center justify-between px-6 py-4 rounded-2xl font-bold transition-all border border-slate-100 shadow-sm"
          >
            Inventory Management
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
          </button>
          
          <button 
            (click)="activeTab.set('orders')"
            [class]="activeTab() === 'orders' ? 'bg-primary-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'"
            class="w-full flex items-center justify-between px-6 py-4 rounded-2xl font-bold transition-all border border-slate-100 shadow-sm"
          >
            All Orders
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          </button>
        </div>

        <!-- Main Content -->
        <div class="lg:col-span-2">
          <!-- Inventory Tab -->
          <div *ngIf="activeTab() === 'inventory'" class="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-2xl font-bold text-slate-800">Inventory</h2>
              <button (click)="openAddModal()" class="btn-primary flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                Add Product
              </button>
            </div>

            <div class="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
              <table class="w-full text-left">
                <thead class="bg-slate-50 text-slate-400 text-[10px] uppercase font-black border-b border-slate-100">
                  <tr>
                    <th class="px-6 py-4">Product</th>
                    <th class="px-6 py-4 text-center">Stock</th>
                    <th class="px-6 py-4">Price</th>
                    <th class="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr *ngFor="let p of products()" class="hover:bg-slate-50/50 transition-colors">
                    <td class="px-6 py-4 flex items-center gap-3">
                      <img [src]="p.imageUrl" class="w-10 h-10 rounded-lg object-cover">
                      <div>
                        <p class="font-bold text-slate-800">{{ p.name }}</p>
                        <p class="text-[10px] text-slate-400">{{ p.category }}</p>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-center">
                      <span class="px-2 py-1 rounded text-xs font-bold" [ngClass]="p.stock < 10 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'">
                        {{ p.stock }}
                      </span>
                    </td>
                    <td class="px-6 py-4 font-bold text-slate-700">{{ p.price | currency }}</td>
                    <td class="px-6 py-4">
                      <div class="flex gap-2">
                        <button (click)="updateStock(p)" class="text-primary-600 hover:text-primary-700 font-bold text-[10px] uppercase underline">Stock</button>
                        <button (click)="openEditModal(p)" class="text-slate-400 hover:text-slate-600 font-bold text-[10px] uppercase underline">Edit</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Orders Tab -->
          <div *ngIf="activeTab() === 'orders'" class="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
             <h2 class="text-2xl font-bold text-slate-800 mb-6">Global Order Management</h2>
             <div *ngFor="let order of allOrders()" class="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm mb-4">
                <div class="flex justify-between items-start mb-4">
                  <div>
                    <h3 class="font-bold text-slate-800">Order #{{ order.orderId }}</h3>
                    <p class="text-xs text-slate-500">Customer: {{ order.user?.username }} ({{ order.user?.email }})</p>
                  </div>
                  <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase" 
                        [ngClass]="{
                          'bg-yellow-100 text-yellow-600': order.status === 'Pending',
                          'bg-blue-100 text-blue-600': order.status === 'Shipped',
                          'bg-green-100 text-green-600': order.status === 'Delivered'
                        }">
                    {{ order.status }}
                  </span>
                </div>
                <div class="flex flex-wrap gap-2 mb-4">
                  <div *ngFor="let item of order.orderItems" class="text-[10px] bg-slate-50 px-2 py-1 rounded border border-slate-100">
                    {{ item.quantity }}x {{ item.product?.name }}
                  </div>
                </div>
                <div class="flex justify-between items-center pt-4 border-t border-slate-50">
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-black text-slate-900">{{ order.totalAmount | currency }}</span>
                    <span class="text-[10px] text-slate-400">{{ order.orderDate | date:'medium' }}</span>
                  </div>
                  <div class="flex gap-2">
                    <button *ngIf="order.status === 'Pending'" (click)="updateStatus(order.orderId, 'Shipped')" class="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100">Mark Shipped</button>
                    <button *ngIf="order.status === 'Shipped'" (click)="updateStatus(order.orderId, 'Delivered')" class="text-[10px] font-bold bg-green-50 text-green-600 px-2 py-1 rounded hover:bg-green-100">Mark Delivered</button>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Modal -->
    <div *ngIf="showModal()" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div class="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div class="p-8">
          <div class="flex justify-between items-center mb-6">
             <h2 class="text-2xl font-black text-slate-800">{{ isEditing() ? 'Edit' : 'Add' }} Product</h2>
             <button (click)="closeModal()" class="text-slate-400 hover:text-slate-600">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
          </div>

          <form (submit)="saveProduct($event)" class="space-y-4">
            <div>
              <label class="block text-[10px] font-black uppercase text-slate-400 mb-1">Product Name</label>
              <input type="text" [(ngModel)]="currentProduct().name" name="name" class="w-full px-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-primary-500 font-medium" required>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-[10px] font-black uppercase text-slate-400 mb-1">Category</label>
                <input type="text" [(ngModel)]="currentProduct().category" name="category" class="w-full px-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-primary-500 font-medium" required>
              </div>
              <div>
                <label class="block text-[10px] font-black uppercase text-slate-400 mb-1">Price</label>
                <input type="number" [(ngModel)]="currentProduct().price" name="price" class="w-full px-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-primary-500 font-medium" required>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-[10px] font-black uppercase text-slate-400 mb-1">Stock</label>
                <input type="number" [(ngModel)]="currentProduct().stock" name="stock" class="w-full px-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-primary-500 font-medium" required>
              </div>
              <div>
                <label class="block text-[10px] font-black uppercase text-slate-400 mb-1">Image URL</label>
                <input type="text" [(ngModel)]="currentProduct().imageUrl" name="imageUrl" class="w-full px-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-primary-500 font-medium">
              </div>
            </div>

            <div class="pt-4 flex gap-3">
               <button type="submit" class="flex-1 btn-primary py-4">{{ isEditing() ? 'Update' : 'Create' }} Product</button>
               <button *ngIf="isEditing()" type="button" (click)="deleteProduct()" class="px-6 py-4 rounded-2xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-all">Delete</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class AdminDashboardComponent implements OnInit {
  private orderService = inject(OrderService);
  private productService = inject(ProductService);

  activeTab = signal('inventory');
  products = signal<Product[]>([]);
  allOrders = signal<any[]>([]);
  
  showModal = signal(false);
  isEditing = signal(false);
  currentProduct = signal<Partial<Product>>({});

  ngOnInit() {
    this.refreshData();
  }

  refreshData() {
    this.productService.getProducts().subscribe(res => this.products.set(res));
    this.orderService.getAllOrders().subscribe(res => this.allOrders.set(res));
  }

  openAddModal() {
    this.isEditing.set(false);
    this.currentProduct.set({ name: '', category: '', price: 0, stock: 0, imageUrl: '' });
    this.showModal.set(true);
  }

  openEditModal(product: Product) {
    this.isEditing.set(true);
    this.currentProduct.set({ ...product });
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  saveProduct(event: Event) {
    event.preventDefault();
    const p = this.currentProduct() as Product;
    
    if (this.isEditing()) {
      this.productService.updateProduct(p.productId, p).subscribe(() => {
        this.refreshData();
        this.closeModal();
      });
    } else {
      this.productService.createProduct(p).subscribe(() => {
        this.refreshData();
        this.closeModal();
      });
    }
  }

  deleteProduct() {
    const id = this.currentProduct().productId;
    if (id && confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe(() => {
        this.refreshData();
        this.closeModal();
      });
    }
  }

  updateStock(product: Product) {
    const newStock = prompt('Enter new stock quantity:', product.stock.toString());
    if (newStock !== null) {
      const updated = { ...product, stock: parseInt(newStock) };
      this.productService.updateProduct(product.productId, updated).subscribe(() => this.refreshData());
    }
  }

  updateStatus(orderId: number, status: string) {
    this.orderService.updateOrderStatus(orderId, status).subscribe(() => this.refreshData());
  }
}
