// src/app/store/auth.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { UserProfile } from '@angular/fire/auth';
import * as AuthActions from './auth.actions';

export interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
}

export const initialAuthState: AuthState = {
  user: null,
  loading: true,
  error: null,
};

export const authReducer = createReducer(
  initialAuthState,
  // loginWithGoogle inizia → loading true
  on(AuthActions.loginWithGoogle, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  // Login in corso
  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  // Login riuscito
  on(AuthActions.loginSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
    error: null,
  })),

  // Login fallito
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    user: null,
    loading: false,
    error,
  })),

  // logout → reset completo di user (ma non del loading/error)
  on(AuthActions.logout, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AuthActions.logoutSuccess, (state) => ({
    ...state,
    user: null,
    loading: false,
    error: null,
  })),

  on(AuthActions.logoutFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Sincronizzazione con onAuthStateChanged
  on(AuthActions.authStateChanged, (state, { user }) => ({
    ...state,
    user,
    loading: false,
    error: null,
  }))
);
