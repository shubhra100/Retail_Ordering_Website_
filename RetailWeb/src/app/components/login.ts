import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-[80vh] flex items-center justify-center px-6">
      <div class="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 p-8 md:p-12">
        <div class="text-center mb-10">
          <h1 class="text-3xl font-black text-slate-800 mb-2">Welcome Back</h1>
          <p class="text-slate-500">Enter your credentials to access your account</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div>
            <label class="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
            <input type="email" formControlName="email" class="input-field" placeholder="name@example.com">
            <p *ngIf="f['email'].touched && f['email'].errors" class="text-xs text-red-500 mt-1 font-medium">Please enter a valid email</p>
          </div>

          <div>
            <div class="flex justify-between mb-2">
              <label class="block text-sm font-bold text-slate-700">Password</label>
              <a href="#" class="text-xs font-bold text-primary-600 hover:text-primary-700">Forgot password?</a>
            </div>
            <input type="password" formControlName="password" class="input-field" placeholder="••••••••">
          </div>

          <div *ngIf="errorMessage()" class="p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-lg text-center animate-shake">
            {{ errorMessage() }}
          </div>

          <button type="submit" [disabled]="loginForm.invalid || isLoading()" class="w-full btn-primary py-4 text-lg disabled:bg-slate-300">
            {{ isLoading() ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <p class="text-center text-sm text-slate-500 mt-8">
          Don't have an account? 
          <a routerLink="/register" class="text-primary-600 font-bold hover:underline">Create one</a>
        </p>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  get f() { return this.loginForm.controls; }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.auth.login(this.loginForm.value as any).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.errorMessage.set(err.error || 'Login failed. Please try again.');
        this.isLoading.set(false);
      }
    });
  }
}
