import mongoose from "mongoose";
const { Schema } = mongoose;

const studentschema = new Schema({
    name: { type: String },
    reg_no: { type: String, required: [true, "Registration Number required"], unique: true }, // Remove index here
    password: { type: String, required: [true, "Password required"] },
    program: { type: String },
    section: { type: String },
    studentName: { type: String },
    studentPicture: { type: String },
    dateofBirth: { type: String },
    attendance: { type: String },
    cgpa: { type: String },
    rollNumber: { type: String },
    pendingFee: { type: String },
    encryptedDob: { type: String },
    studentUid: { type: String },
    stuUIDName: { type: String },
    friends: [{
        type: Schema.Types.ObjectId,
        ref: 'Student'
    }],
    friendRequests: [{
        type: Schema.Types.ObjectId,
        ref: 'Student'
    }],
    sentFriendRequests: [{
        type: Schema.Types.ObjectId,
        ref: 'Student'
    }],
    lastSync: { type: Date },
    allowedFieldsToShow: { type: Array },
});
export const Student = mongoose.model("Student", studentschema);