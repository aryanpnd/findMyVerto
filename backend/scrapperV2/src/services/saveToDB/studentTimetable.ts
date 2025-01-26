import { TimeTable } from "../../models/studentTimetableModel";
import { StudentTimeTable } from "../../types/DB_ServicesTypes";

export const saveStudentTimeTable = async (studentTimeTable: StudentTimeTable) => {
    try {
        const student = await TimeTable.findOneAndUpdate(
            { reg_no: studentTimeTable.reg_no },
            studentTimeTable,
            {
                new: false,
                upsert: true, 
                runValidators: false 
            }
        );

        return {
            status: true,
            message: "Student timetable saved successfully",
            data: student
        }
    } catch (error: any) {
        console.error(error);
        return {
            status: false,
            message: error.message,
            data: null
        }
    }
}