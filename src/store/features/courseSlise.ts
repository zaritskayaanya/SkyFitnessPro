import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  CourseTypes,
  ProgressWorkOutCourseTypes,
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
  currentProgress: number[]; // по тренировке
  totalWorkoutProgress: number | null; // по тренировке
  workouts: WorkOutTypes[]; // все по курсу
  workoutData: WorkOutTypes | null; // по тренировке
  completedStatus: boolean;
  completedWorkout: string[];
  /** Завершённые тренировки по курсам: courseId -> workoutId[] */
  completedWorkoutsByCourse: Record<string, string[]>;
  courseProgress: {
    [courseId: string]: ProgressWorkOutCourseTypes; // прогресс по курсу
  };
};

export const courseInitialState: initialStateType = {
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
  totalWorkoutProgress: null,
  workouts: [],
  workoutData: null,
  completedStatus: false,
  completedWorkout: [],
  completedWorkoutsByCourse: {},
  courseProgress: {},
};

const courseSlice = createSlice({
  name: 'course',
  initialState: courseInitialState,
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

    // Исправленный редуксер: сохраняем прогресс курса в courseProgress
    setCurrentProgressCourse: (
      state,
      action: PayloadAction<{ courseId: string; progress: ProgressWorkOutCourseTypes }>
    ) => {
      const { courseId, progress } = action.payload;
      state.courseProgress[courseId] = progress;
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

    setCompletedWorkoutForCourse: (
      state,
      action: PayloadAction<{ courseId: string; workoutId: string }>,
    ) => {
      const { courseId, workoutId } = action.payload;
      const list = state.completedWorkoutsByCourse[courseId] ?? [];
      if (!list.includes(workoutId)) {
        state.completedWorkoutsByCourse[courseId] = [...list, workoutId];
      }
    },

    setCompletedWorkoutsForCourse: (
      state,
      action: PayloadAction<{ courseId: string; workoutIds: string[] }>,
    ) => {
      const { courseId, workoutIds } = action.payload;
      state.completedWorkoutsByCourse[courseId] = Array.isArray(workoutIds)
        ? workoutIds
        : [];
    },

    clearCompletedWorkoutsForCourse: (
      state,
      action: PayloadAction<string>,
    ) => {
      delete state.completedWorkoutsByCourse[action.payload];
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

    resetCourseAdditionStatus: (
      state,
      action: PayloadAction<string | undefined>,
    ) => {
      const courseId = action.payload;
      state.currentProgress = [];
      state.totalWorkoutProgress = null;
      state.completedStatus = false;
      state.completedWorkout = [];
      if (courseId) {
        delete state.completedWorkoutsByCourse[courseId];
        delete state.courseProgress[courseId];
      }
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
  setCompletedWorkoutForCourse,
  setCompletedWorkoutsForCourse,
  clearCompletedWorkoutsForCourse,
  setWorkoutData,
  setTotalWorkoutProgress,
  setCurrentProgressCourse,
  setCompleted,
  resetCourseAdditionStatus,
} = courseSlice.actions;


export const courseSliceReducer = courseSlice.reducer;