const MY_COURSES_KEY = 'sky_fitness_my_course_ids';

export function loadMyCourseIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = sessionStorage.getItem(MY_COURSES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

export function saveMyCourseIds(ids: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(MY_COURSES_KEY, JSON.stringify(ids));
  } catch {
    // ignore
  }
}

export function clearMyCourseIds(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(MY_COURSES_KEY);
  } catch {
    // ignore
  }
}
