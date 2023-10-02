const mongoose = require("mongoose");
const { Schema } = mongoose;

const studentTimeTableschema = new Schema({
    RegistrationNumber: { type: Number, required: [true, "Registration Number required"], unique: [true, "Registration Number already exists"] },
    Monday:{},
    Tuesday:{},
    Wednesday:{},
    Thursday:{},
    Friday:{},
    Saturday:{},
    Sunday:{}
});

const TimeTable = mongoose.model("TimeTable", studentTimeTableschema);
// -------------------------------------------------------------------------

module.exports = { TimeTable };
