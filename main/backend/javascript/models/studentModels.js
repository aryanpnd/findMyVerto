const mongoose = require("mongoose");
const { Schema } = mongoose;

const studentschema = new Schema({
  photoURL: { type: String },
  name: { type: String },
  registrationNumber: { type: Number,required: [true, "Registration Number required"], unique: [true, "Registration Number already exists"]},
  password: { type: String,required: [true, "Password required"]},
  rollNo: { type: String },
  term: { type: Number },
  section: { type: String },
  group: { type: String },
  program: { type: String },
  attendance:{type:String}
});

const Student = mongoose.model("Student", studentschema);
// -------------------------------------------------------------------------

module.exports = { Student };
