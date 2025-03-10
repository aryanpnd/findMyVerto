/**
 * Types for the DB_Services
 * StudentDetails
 * * name: string;
 * * reg_no: string;
 * * password: string;
 * * program: string;
 * * section: string;
 * * studentName: string;
 * * studentPicture: string;
 * * dateofBirth: string;
 * * attendance: string;
 * * cgpa: string;
 * * rollNumber: string;
 * * pendingFee: string;
 * * encryptedDob: string;
 * * studentUid: string;
 * * stuUIDName: string;
 * * friends: string[];
 * * friendRequests: string[];
 * * sentFriendRequests: string[];
 * * lastSync: Date;
 * * allowedFieldsToShow: string[];
 * 
 */
export interface StudentDetails {
    name: string;
    reg_no: string;
    password: string;
    program?: string;
    section: string;
    studentName: string;
    studentPicture?: string;
    dateofBirth?: string;
    attendance?: string;
    cgpa?: string;
    rollNumber?: string;
    pendingFee?: string;
    encryptedDob?: string;
    studentUid?: string;
    stuUIDName?: string;
    friends?: string[];
    friendRequests?: string[];
    sentFriendRequests?: string[];
    lastSync: string;
    allowedFieldsToShow?: string[];
    devicePushToken?: string;
}

/**
 * Types for the DB_Services
 * StudentTimeTable
 * * reg_no: string;
 * * password: string;
 * * data: any;
 * * lastSync: Date;
 */
export interface StudentTimeTable {
    reg_no: string;
    data: any;
    lastSynced: string;
}