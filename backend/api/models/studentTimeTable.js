const mongoose = require("mongoose");
const { Schema } = mongoose;

const studentTimeTableschema = new Schema({
    registrationNumber: { type: Number, required: [true, "Registration Number required"] },
    lastSync: { type: Date, required: [true, "last sync Number required"]},
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
