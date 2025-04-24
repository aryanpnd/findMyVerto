import { userStorage } from "../storage/storage";

export function AttendanceSyncTime(time) {
  const storedTime = userStorage.getNumber("ATTENDANCE_SYNC_TIME");
  if (time !== undefined && time !== null) {
    userStorage.set("ATTENDANCE_SYNC_TIME", time);
  }
  if (storedTime !== undefined && storedTime !== null) {
    return storedTime;
  } else {
    // Default to 8 hours (in ms)
    const defaultTime = 8 * 3600000;
    userStorage.set("ATTENDANCE_SYNC_TIME", defaultTime);
    return defaultTime;
  }
}

export function TimetableSyncTime(time) {
  const storedTime = userStorage.getNumber("TIMETABLE_SYNC_TIME");
  if (time !== undefined && time !== null) {
    userStorage.set("TIMETABLE_SYNC_TIME", time);
  }
  if (storedTime !== undefined && storedTime !== null) {
    return storedTime;
  } else {
    // Default to 1 day (in ms)
    const defaultTime = 24 * 3600000;
    userStorage.set("TIMETABLE_SYNC_TIME", defaultTime);
    
    return defaultTime;
  }
}

export function ExamsSyncTime(time) {
  const storedTime = userStorage.getNumber("EXAMS_SYNC_TIME");
  if (time !== undefined && time !== null) {
    userStorage.set("EXAMS_SYNC_TIME", time);
  }
  if (storedTime !== undefined && storedTime !== null) {
    return storedTime;
  } else {
    // Default to 1 month (30 days)
    const defaultTime = 30 * 24 * 3600000;
    userStorage.set("EXAMS_SYNC_TIME", defaultTime);
    return defaultTime;
  }
}

export function AssignmentsSyncTime(time) {
  const storedTime = userStorage.getNumber("ASSIGNMENTS_SYNC_TIME");
  if (time !== undefined && time !== null) {
    userStorage.set("ASSIGNMENTS_SYNC_TIME", time);
  }
  if (storedTime !== undefined && storedTime !== null) {
    return storedTime;
  } else {
    // Default to 3 days
    const defaultTime = 3 * 24 * 3600000;
    userStorage.set("ASSIGNMENTS_SYNC_TIME", defaultTime);
    return defaultTime;
  }
}

export function MyMessagesSyncTime(time) {
  const storedTime = userStorage.getNumber("MY_MESSAGES_SYNC_TIME");
  if (time !== undefined && time !== null) {
    userStorage.set("MY_MESSAGES_SYNC_TIME", time);
  }
  if (storedTime !== undefined && storedTime !== null) {
    return storedTime;
  } else {
    // Default to 1 day
    const defaultTime = 24 * 3600000;
    userStorage.set("MY_MESSAGES_SYNC_TIME", defaultTime);
    return defaultTime;
  }
}

export function DrivesSyncTime(time) {
  const storedTime = userStorage.getNumber("DRIVES_SYNC_TIME");
  if (time !== undefined && time !== null) {
    userStorage.set("DRIVES_SYNC_TIME", time);
  }
  if (storedTime !== undefined && storedTime !== null) {
    return storedTime;
  } else {
    // Default to 1 day (24 hours)
    const defaultTime = 24 * 3600000;
    userStorage.set("DRIVES_SYNC_TIME", defaultTime);
    return defaultTime;
  }
}
