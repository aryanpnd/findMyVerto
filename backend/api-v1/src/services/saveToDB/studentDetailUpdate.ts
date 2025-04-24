import { Student } from "../../models/studentModel";
import { StudentDetails } from "../../types/DB_ServicesTypes";

export const studentDetailUpdate = async (reg_no: string, updateFields: Partial<StudentDetails>) => {
    try {    
        // Find the student by a specific field and update their details
        const updatedStudent = await Student.findOneAndUpdate(
            { reg_no: reg_no }, // Search criteria (e.g., { email: "example@example.com" })
            { $set: updateFields }, // Fields to update
            { new: true, runValidators: true } // Return the updated document and run validation
        );

        if (!updatedStudent) {
            return {
                success: false,
                message: "Student not found",
                data: {}
            };
        }

        return {
            success: true,
            message: "Student details updated successfully",
            data: updatedStudent
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