import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-[80vh] flex items-center justify-center px-6">
      <div class="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 p-8 md:p-12">
        <div class="text-center mb-10">
          <h1 class="text-3xl font-black text-slate-800 mb-2">Create Account</h1>
          <p class="text-slate-500">Join our community and start ordering</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div>
            <label class="block text-sm font-bold text-slate-700 mb-2">Username</label>
            <input type="text" formControlName="username" class="input-field" placeholder="John Doe">
          </div>

          <div>
            <label class="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
            <input type="email" formControlName="email" class="input-field" placeholder="name@example.com">
          </div>

          <div>
            <label class="block text-sm font-bold text-slate-700 mb-2">Password</label>
            <input type="password" formControlName="password" class="input-field" placeholder="••••••••">
          </div>

          <div *ngIf="errorMessage()" class="p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-lg text-center">
            {{ errorMessage() }}
          </div>

          <button type="submit" [disabled]="registerForm.invalid || isLoading()" class="w-full btn-primary py-4 text-lg disabled:bg-slate-300">
            {{ isLoading() ? 'Creating account...' : 'Create Account' }}
          </button>
        </form>

        <p class="text-center text-sm text-slate-500 mt-8">
          Already have an account? 
          <a routerLink="/login" class="text-primary-600 font-bold hover:underline">Sign in</a>
        </p>
      </div>
    </div>
  `,
  styles: []
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  registerForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.auth.register(this.registerForm.value).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage.set(err.error || 'Registration failed.');
        this.isLoading.set(false);
      }
    });
  }
}
