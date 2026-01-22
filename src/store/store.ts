import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useStore } from 'react-redux';
import { authSliceReducer } from './features/authSlice';
import { courseSliceReducer } from './features/courseSlice';
import { loadAuthState } from './features/authSrorage';

export const makeStore = () => {
  const preloadedAuthState = loadAuthState();

  const rootReducer = combineReducers({
    course: courseSliceReducer,
    auth: authSliceReducer,
  });

  return configureStore({
    reducer: rootReducer,

    preloadedState: {
      auth: preloadedAuthState,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

// Для нового TS
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();

// Для старого TS
// export const useAppDispatch: () => AppDispatch = useDispatch;
// export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
// export const useAppStore: () => AppStore = useStore;