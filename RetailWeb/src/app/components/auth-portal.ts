import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-auth-portal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-bakery-cream/30 p-6">
      <div class="w-full max-w-6xl bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 overflow-hidden flex flex-col md:flex-row min-h-[700px]">
        
        <!-- Left Side: Artisan Connection (Social & Brand) -->
        <div class="md:w-5/12 bg-bakery-dark p-16 flex flex-col justify-between text-white relative overflow-hidden">
           <div class="absolute inset-0 opacity-10">
              <div class="absolute -top-24 -left-24 w-96 h-96 bg-primary-500 rounded-full blur-[120px]"></div>
              <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-600 rounded-full blur-[120px]"></div>
           </div>

           <div class="relative z-10">
              <a routerLink="/" class="text-3xl font-serif font-black text-primary-400 mb-12 block uppercase tracking-widest">Gourmet</a>
              <h2 class="text-5xl font-serif font-black mb-6 leading-tight">Handcrafted<br>Connections.</h2>
              <p class="text-slate-400 font-serif italic text-lg max-w-sm mb-12">Join our family of enthusiasts and receive member-exclusive bakes.</p>
              
              <div class="space-y-4 max-w-xs">
                 <button class="w-full bg-white/5 hover:bg-white/10 transition-all py-4 px-6 rounded-2xl flex items-center justify-center gap-4 border border-white/10 group">
                   <i class="fab fa-google text-xl text-primary-400"></i>
                   <span class="text-xs font-black uppercase tracking-widest">Connect with Google</span>
                 </button>
                 <button class="w-full bg-white/5 hover:bg-white/10 transition-all py-4 px-6 rounded-2xl flex items-center justify-center gap-4 border border-white/10 group">
                   <i class="fab fa-apple text-2xl mb-1"></i>
                   <span class="text-xs font-black uppercase tracking-widest">Connect with Apple</span>
                 </button>
              </div>
           </div>

           <div class="relative z-10 pt-10 border-t border-white/10 flex justify-between items-center">
              <div>
                 <p class="text-[10px] font-black uppercase tracking-[0.2em] text-primary-500/50 mb-2">Bakery Status</p>
                 <div class="flex items-center gap-4">
                    <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ovens Pre-heated</span>
                 </div>
              </div>
              <button (click)="isStaffMode.set(!isStaffMode())" class="text-[10px] font-black uppercase tracking-widest text-primary-400 hover:text-white transition-colors">
                {{ isStaffMode() ? 'Exit Staff Portal' : 'Staff Portal Entry' }}
              </button>
           </div>
        </div>

        <!-- Right Side: Tradition (Forms) -->
        <div class="md:w-7/12 p-16 flex flex-col justify-center bg-white relative">
          
          <!-- Regular Flow -->
          <div *ngIf="!isStaffMode()" class="animate-in fade-in slide-in-from-right-10 duration-700">
            <div class="mb-12">
              <h3 class="text-4xl font-serif font-black text-slate-900 mb-2">{{ isLogin() ? 'Welcome Back' : 'Join the Tradition' }}</h3>
              <p class="text-slate-500 text-sm font-serif italic">{{ isLogin() ? 'Access your private artisanal dashboard' : 'Begin your journey with a traditional registration' }}</p>
            </div>

            <!-- Registration Progress -->
            <div *ngIf="!isLogin()" class="w-full h-1 bg-slate-50 rounded-full mb-10 overflow-hidden">
               <div class="h-full bg-primary-600 transition-all duration-1000" [style.width]="'65%'"></div>
            </div>

            <form [formGroup]="authForm" (ngSubmit)="onSubmit()" class="space-y-6">
              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Identifier</label>
                <input type="email" formControlName="email" class="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none font-bold text-slate-800" placeholder="artisan@gourmet.com">
              </div>

              <div *ngIf="!isLogin()" class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Display Name</label>
                <input type="text" formControlName="username" class="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none font-bold text-slate-800" placeholder="MasterBaker">
              </div>

              <div class="space-y-2">
                <div class="flex justify-between items-end">
                  <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Personal Protocol (Password)</label>
                  <a href="#" class="text-[10px] font-black text-primary-600 uppercase hover:underline">Reset Passphrase?</a>
                </div>
                <input type="password" formControlName="password" class="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none font-bold text-slate-800" placeholder="••••••••">
              </div>

              <div *ngIf="errorMessage()" class="p-4 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-xl text-center border border-red-100 italic">
                {{ errorMessage() }}
              </div>

              <button type="submit" [disabled]="isLoading()" class="w-full bg-primary-600 text-white py-5 rounded-2xl text-xs font-black uppercase tracking-[0.3em] shadow-xl hover:bg-primary-700 transition-all disabled:opacity-50">
                {{ isLoading() ? 'Verifying...' : (isLogin() ? 'Initialize Session' : 'Register Member') }}
              </button>
            </form>

            <div class="mt-12 text-center">
               <button (click)="isLogin.set(!isLogin())" class="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary-600 transition-colors">
                  {{ isLogin() ? 'Need a membership? Join the Craft' : 'Already synchronized? Sign in here' }}
               </button>
            </div>
          </div>

          <!-- Staff Portal Entry (No MFA as requested) -->
          <div *ngIf="isStaffMode()" class="animate-in zoom-in-95 duration-500 text-center max-w-sm mx-auto">
             <div class="w-24 h-24 bg-primary-50 rounded-[2rem] flex items-center justify-center text-primary-600 text-4xl mx-auto mb-8 shadow-inner">
               <i class="fas fa-user-shield"></i>
             </div>
             <h3 class="text-3xl font-serif font-black text-slate-900 mb-2">Staff Portal</h3>
             <p class="text-slate-500 text-sm font-serif italic mb-10">Restricted to authorized bakery management only.</p>
             
             <form [formGroup]="authForm" (ngSubmit)="onSubmit()" class="space-y-6 mb-8 text-left">
                <div class="space-y-2">
                  <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Admin Email</label>
                  <input type="email" formControlName="email" class="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none font-bold text-slate-800">
                </div>
                <div class="space-y-2">
                  <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Admin Passphrase</label>
                  <input type="password" formControlName="password" class="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none font-bold text-slate-800">
                </div>
                <button type="submit" [disabled]="isLoading()" class="w-full bg-bakery-dark text-white py-5 rounded-2xl text-xs font-black uppercase tracking-[0.3em] shadow-xl hover:bg-black">
                   {{ isLoading() ? 'Authenticating...' : 'Secure Entry' }}
                </button>
             </form>

             <p (click)="isStaffMode.set(false)" class="mt-8 text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-primary-600 cursor-pointer transition-colors">Return to Customer Entrance</p>
          </div>

        </div>

      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class AuthPortalComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  isLogin = signal(true);
  isStaffMode = signal(false);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  authForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    username: [''],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  onSubmit() {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    const action = this.isLogin() ? this.auth.login(this.authForm.value as any) : this.auth.register(this.authForm.value);
    
    action.subscribe({
      next: (res: any) => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        if (err.status === 0) {
          this.errorMessage.set('Connection Lost: The bakery servers are unreachable.');
        } else {
          this.errorMessage.set(err.error || 'Identity Verification Failed.');
        }
        this.isLoading.set(false);
      }
    });
  }
}
