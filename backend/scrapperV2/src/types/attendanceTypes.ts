export interface StudentAttendanceSummary {
    attendance_summary: any[],
    total_details: {
        duty_leaves: string,
        total_attended: string,
        total_delivered: string,
        agg_attendance: string
    } | null
}