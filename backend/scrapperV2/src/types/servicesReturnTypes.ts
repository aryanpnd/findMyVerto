export interface umsLoginReturn {
    login: boolean;
    message: string;
    cookie: string;
    passwordExpiry?: string;
}