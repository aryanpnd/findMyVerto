const mongoose = require("mongoose");
const { Schema } = mongoose;

const studentAttendancechema = new Schema({
    registrationNumber: { type: Number, required: [true, "Registration Number required"], unique: [true, "Registration Number already exists"] },
    lastSync: { type: Date, required: [true, "Registration Number required"]},
    attendanceHistory: [{
        course: { type: String },
        lastAttended: { type: String },
        dutyLeave: { type: String },
        totalDelivered: { type: String },
        totalAttended: { type: String },
        totalPercentage: { type: String }
    }],
});

const Attendance = mongoose.model("Attendance", studentAttendancechema);
// -------------------------------------------------------------------------

module.exports = { Attendance };
