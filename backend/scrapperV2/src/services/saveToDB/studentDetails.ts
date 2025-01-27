import { Student } from "../../models/studentModel";
import { StudentDetails } from "../../types/DB_ServicesTypes";

export const saveStudentDetails = async (studentDetails: StudentDetails) => {
    try {
        const student = await Student.findOneAndUpdate(
            { reg_no: studentDetails.reg_no },
            studentDetails,
            {
                new: false,
                upsert: true, // create if doesn't exist
                runValidators: false // run model validators
            }
        );
        return {
            status: true,
            message: "Student details saved successfully",
            data: student
        }
    } catch (error: any) {
        console.error(error.message);
        return {
            status: false,
            message: error.message,
            data: {}
        }
    }
}