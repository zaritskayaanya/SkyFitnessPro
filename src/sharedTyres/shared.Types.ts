export interface CourseTypes {
  _id: string;
  nameRU: string;
  nameEN: string;
  description: string;
  directions: string[];
  fitting: string[];
  difficulty: string;
  durationInDays: number;
  dailyDurationInMinutes: {
    from: number;
    to: number;
  };
  workouts: string[];
  courseProgress: {
    [courseId: string]: ProgressWorkOutCourseTypes;
  };
}

export interface WorkOutTypes {
  _id: string;
  name: string;
  video: string;
  exercises: [
    {
      name: string;
      quantity: number;
      _id: string;
    },
  ];
}

export interface ProgressWorkOutTypes {
  workoutId: string;
  workoutCompleted: boolean;
  progressData: number[];
}

export interface ProgressWorkOutCourseTypes {
  courseId: string;
  courseCompleted: boolean;
  workoutsProgress: [
    { workoutId: string; workoutCompleted: boolean; progressData: number[] },
  ];
}

export interface UserTypes {
  user: {
    _id: string;
    email: string;
    selectedCourses: string[];
    courseProgress: string[];
  };
}