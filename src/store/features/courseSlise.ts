import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  CourseTypes,
  ProgressWorkOutCourseTypes,
  ProgressWorkOutTypes,
  WorkOutTypes,
} from '../../sharedTyres/shared.Types';

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
  currentProgress: number[] // по тренировке
  currentProgressCourse: ProgressWorkOutCourseTypes[]; // по курсу (массив)
  totalWorkoutProgress: number | null; // по тренировке
  workouts: WorkOutTypes[]; // все по курсу
  workoutData: WorkOutTypes | null; // по тренировке
  completedStatus: boolean;
  completedWorkout: string[];
  courseProgress: {
    [courseId: string]: ProgressWorkOutCourseTypes; // по курсу (объект)
  };
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
  currentProgressCourse: [],
  totalWorkoutProgress: null,
  workouts: [],
  workoutData: null,
  completedStatus: false,
  completedWorkout: [],
  courseProgress: {},
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

    setTotalWorkoutProgress: (state, action: PayloadAction<number>) => {
      state.totalWorkoutProgress = action.payload;
    },

    // Для работы с массивом прогресса
    setCurrentProgressCourse: (
      state,
      action: PayloadAction<ProgressWorkOutCourseTypes[]>,
    ) => {
      state.currentProgressCourse = action.payload;
    },

    // Для работы с объектом прогресса (по courseId)
    setCourseProgress: (
      state,
      action: PayloadAction<{ courseId: string; progress: ProgressWorkOutCourseTypes }>
    ) => {
      const { courseId, progress } = action.payload;
      state.courseProgress[courseId] = progress;
    },

    // Для обновления прогресса тренировки внутри курса
    updateWorkoutProgress: (
      state,
      action: PayloadAction<{ 
        courseId: string; 
        workoutId: string; 
        progressData: number[];
        workoutCompleted: boolean;
      }>
    ) => {
      const { courseId, workoutId, progressData, workoutCompleted } = action.payload;
      
      if (state.courseProgress[courseId]) {
        const workoutIndex = state.courseProgress[courseId].workoutsProgress
          .findIndex(w => w.workoutId === workoutId);
        
        if (workoutIndex !== -1) {
          state.courseProgress[courseId].workoutsProgress[workoutIndex] = {
            workoutId,
            workoutCompleted,
            progressData,
          };
        } else {
          state.courseProgress[courseId].workoutsProgress.push({
            workoutId,
            workoutCompleted,
            progressData,
          });
        }
      }
    },

    setWorkouts: (state, action: PayloadAction<WorkOutTypes[]>) => {
      state.workouts = action.payload;
    },

    setWorkoutData: (state, action: PayloadAction<WorkOutTypes | null>) => {
      state.workoutData = action.payload;
    },

    setCompleted: (state, action: PayloadAction<boolean>) => {
      state.completedStatus = action.payload;
    },

    setCompletedWorkout: (state, action: PayloadAction<string>) => {
      state.completedWorkout = [...state.completedWorkout, action.payload];
    },

    addCourse: (state, action: PayloadAction<CourseTypes>) => {
      state.myCourses = [...state.myCourses, action.payload];
    },

    removeCourse: (state, action: PayloadAction<CourseTypes>) => {
      state.myCourses = state.myCourses.filter(
        (course) => course._id !== action.payload._id,
      );

      state.isCourseAdded = false;
      state.addedCourseId = null;
    },

    resetCourseAdditionStatus: (state) => {
      state.currentProgress = [];
      state.currentProgressCourse = [];
      state.totalWorkoutProgress = null;
      state.completedStatus = false;
      state.completedWorkout = [];
    },

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
  setCompletedWorkout,
  setWorkoutData,
  setTotalWorkoutProgress,
  setCurrentProgressCourse,
  setCourseProgress,
  updateWorkoutProgress,
  setCompleted,
  resetCourseAdditionStatus,
} = courseSlice.actions;
export const courseSliceReducer = courseSlice.reducer;
