import { Student } from "../../models/studentModel";
import { StudentDetails } from "../../types/DB_ServicesTypes";

export const saveStudentDetails = async (studentDetails: StudentDetails) => {
    try {
        const existingStudent = await Student.findOne({ reg_no: studentDetails.reg_no });

        if (!existingStudent) {
            studentDetails.allowedFieldsToShow = ["timetable"];
        } else {
            studentDetails.allowedFieldsToShow = existingStudent.allowedFieldsToShow;
        }

        const student = await Student.findOneAndUpdate(
            { reg_no: studentDetails.reg_no },
            studentDetails,
            {
                new: true, 
                upsert: true,
                runValidators: false,
            }
        );

        return {
            success: true,
            message: "Student details saved successfully",
            data: student
        };
    } catch (error: any) {
        console.error(error.message);
        return {
            success: false,
            message: error.message,
            data: {}
        };
    }
};
