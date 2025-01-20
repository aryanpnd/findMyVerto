export interface StudentAttendanceSummary {
    summary: any[],
    attendance_details: {
        total_duty_leaves: string,
        total_lectures_attended: string,
        total_lectures_delivered: string,
        total_agg_attendance: string
    } | null
}