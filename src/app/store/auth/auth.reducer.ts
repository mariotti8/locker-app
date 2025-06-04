// src/app/store/auth.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { UserProfile } from './auth.models';

export interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  initialized: boolean; // Aggiunto per tenere traccia dell'inizializzazione
}

export const initialAuthState: AuthState = {
  user: null,
  loading: true,
  error: null,
  initialized: false, // Inizialmente non inizializzato
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
    initialized: true,
  })),

  // Login fallito
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    user: null,
    loading: false,
    error,
    initialized: true,
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
    initialized: true,
  })),

  on(AuthActions.logoutFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    initialized: true,
  })),

  // Sincronizzazione con onAuthStateChanged
  on(AuthActions.authStateChanged, (state, { user }) => ({
    ...state,
    user,
    loading: false,
    error: null,
    initialized: true,
  }))
);
