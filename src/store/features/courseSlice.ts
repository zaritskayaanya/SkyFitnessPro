import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CourseTypes, WorkOutTypes } from '../../sharedTypes/shared.Types';

type initialStateType = {
  currentCourse: CourseTypes | null;
  courseList: CourseTypes[];
  allCourses: CourseTypes[];
  myCourses: CourseTypes[];
  fetchError: null | string;
  fetchIsLoading: boolean;
  pageMyCourses: CourseTypes[];
  isCourseAdded: boolean;
  addedCourseId: string | null;
  myCourseIds: string[];
  currentProgress: number[];
  workouts: WorkOutTypes[];
};

const initialState: initialStateType = {
  currentCourse: null,
  courseList: [],
  allCourses: [],
  myCourses: [],
  fetchError: null,
  fetchIsLoading: true,
  pageMyCourses: [],
  isCourseAdded: false,
  addedCourseId: null,
  myCourseIds: [],
  currentProgress: [],
  workouts: [],
};

const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    setCurrentCourse: (state, action: PayloadAction<CourseTypes>) => {
      state.currentCourse = action.payload;
    },

    setAllCourses: (state, action: PayloadAction<CourseTypes[]>) => {
      state.allCourses = action.payload;
    },

    setMyCourses: (state, action: PayloadAction<CourseTypes[]>) => {
      state.myCourses = action.payload;
    },

    setMyCourseIds: (state, action: PayloadAction<string[]>) => {
      state.myCourseIds = action.payload;
    },

    setCurrentProgress: (state, action: PayloadAction<number[]>) => {
      state.currentProgress = action.payload;
    },

    setWorkouts: (state, action: PayloadAction<WorkOutTypes[]>) => {
      state.workouts = action.payload;
    },

    addCourse: (state, action: PayloadAction<CourseTypes>) => {
      state.myCourses = [...state.myCourses, action.payload];
    },

    // removeCourse: (state, action: PayloadAction<CourseTypes>) => {
    //   state.myCourses = state.myCourses.filter(
    //     (course) => course._id !== action.payload._id,
    //   );
    // },

    // addCourse: (state, action: PayloadAction<CourseTypes>) => {
    //   if (!state.myCourses.some(c => c._id === action.payload._id)) {
    //     state.myCourses = [...state.myCourses, action.payload];
    //   }
    //   state.isCourseAdded = true;
    //   state.addedCourseId = action.payload._id;

    // },

    removeCourse: (state, action: PayloadAction<CourseTypes>) => {
      state.myCourses = state.myCourses.filter(
        (course) => course._id !== action.payload._id,
      );

      state.isCourseAdded = false;
      state.addedCourseId = null;
    },

    // resetCourseAdditionStatus: (state) => {
    //     state.isCourseAdded = false;
    //     state.addedCourseId = null;
    // },

    setFetchError: (state, action: PayloadAction<string>) => {
      state.fetchError = action.payload;
    },

    setFetchIsLoading: (state, action: PayloadAction<boolean>) => {
      state.fetchIsLoading = action.payload;
    },
  },
});

export const {
  setCurrentCourse,
  setAllCourses,
  setFetchError,
  setFetchIsLoading,
  setMyCourses,
  addCourse,
  removeCourse,
  setMyCourseIds,
  setCurrentProgress,
  setWorkouts,
} = courseSlice.actions;
export const courseSliceReducer = courseSlice.reducer;