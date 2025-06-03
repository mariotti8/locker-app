import { createAction, props } from "@ngrx/store";
import { User, UserProfile } from "firebase/auth";

export const login = createAction(
  '[Auth] Login',
  props<{ email: string; password: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: UserProfile }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

export const loginWithGoogle = createAction('[Auth] Login With Google');

export const logout = createAction('[Auth] Logout');

export const logoutSuccess = createAction('[Auth] Logout Success');
export const logoutFailure = createAction(
  '[Auth] Logout Failure',
  props<{ error: string }>()
);

// Questa action la useremo per sincronizzare lo stato iniziale con onAuthStateChanged
export const authStateChanged = createAction(
  '[Auth] Auth State Changed',
  props<{ user: UserProfile | null }>()
);