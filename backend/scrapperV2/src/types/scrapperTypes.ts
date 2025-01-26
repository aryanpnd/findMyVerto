export interface User {
    reg_no: string;
    password: string;
    cookie?: string;
}

export interface umsLoginReturn {
    login: boolean;
    message: string;
    cookie: string;
    passwordExpiry?: string;
}

export interface StudentAttendanceSummary {
    attendance_summary: any[],
    total_details: {
        duty_leaves: string,
        total_attended: string,
        total_delivered: string,
        agg_attendance: string
    } | null,
    status?: boolean,
}

export interface TimeTable {
    time_table: Record<string, Record<string, string>>;
    section: string;
    last_updated: string;
    registration_number: string;
    courses: Record<string, any>;
}


export interface checkUserCookieStateReturnType {
    status: boolean,
    data: any
}