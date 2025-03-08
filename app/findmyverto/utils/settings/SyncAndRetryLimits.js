import { userStorage } from "../storage/storage";

export function SyncAndRetryLimits(){

}

export function AttendanceSyncTime(time){
    const getAttendanceSyncTime = userStorage.getNumber("ATTENDANCE_SYNC_TIME");
    if(time){
        userStorage.set("ATTENDANCE_SYNC_TIME", time);
    }
    if(getAttendanceSyncTime){
        return getAttendanceSyncTime;
    }else{
        userStorage.set("ATTENDANCE_SYNC_TIME", 18000000); // 5 hours
        return 18000000;
    }
}