import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useStore } from 'react-redux';
import { authSliceReducer } from './features/authSlice';
import { courseSliceReducer, courseInitialState } from './features/courseSlise';
import { loadAuthState } from './features/authSrorage';
import { loadMyCourseIds } from './features/courseStorage';

export const makeStore = () => {
  const preloadedAuthState = loadAuthState();
  const savedCourseIds = loadMyCourseIds();

  const rootReducer = combineReducers({
    course: courseSliceReducer,
    auth: authSliceReducer,
  });

  return configureStore({
    reducer: rootReducer,
    preloadedState: {
      auth: preloadedAuthState,
      course: {
        ...courseInitialState,
        myCourseIds: savedCourseIds.length > 0 ? savedCourseIds : courseInitialState.myCourseIds,
      },
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();