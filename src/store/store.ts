import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useStore } from 'react-redux';
import { authSliceReducer } from './features/authSlice';
import { courseSliceReducer } from './features/courseSlice';

export const makeStore = () => {
  return configureStore({
    reducer: combineReducers({
      course: courseSliceReducer,
      auth: authSliceReducer,
    }),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;

// Infer the \`RootState\` and \`AppDispatch\` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

// Для нового TS
// Use throughout your app instead of plain \`useDispatch\` and \`useSelector\`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();

// Для старого TS
// export const useAppDispatch: () => AppDispatch = useDispatch;
// export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
// export const useAppStore: () => AppStore = useStore;