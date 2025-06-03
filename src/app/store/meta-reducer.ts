// src/app/store/meta-reducers.ts
import { ActionReducer, MetaReducer } from '@ngrx/store';
import { AppState } from './index';
import { logout } from './auth/auth.actions';

// Questo meta-reducer intercetta l’azione [Auth] Logout
export function clearStateMetaReducer(
  reducer: ActionReducer<AppState>
): ActionReducer<AppState> {
  return (state, action) => {
    if (action.type === logout.type) {
      // Passo `undefined` al reducer principale: ogni slice torna al suo initialState
      return reducer(undefined, { type: '@ngrx/store/init' });
    }
    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<AppState>[] = [
  clearStateMetaReducer
];